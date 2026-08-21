from decimal import Decimal
from django.db import transaction

from apps.common.importers import (
    BaseMasterDataImportCommand,
    clean_value,
    parse_bool,
    parse_decimal,
    parse_int,
    parse_json_field,
)
from apps.suppliers.models import Supplier, SupplierContact


class Command(BaseMasterDataImportCommand):
    help = "Imports Supplier master data from Excel files into SupplyOS using Django ORM."
    model = Supplier
    default_file_path = "data/SupplyOS_Realistic_100_Suppliers.xlsx"
    required_columns = ["name", "country", "city"]

    def process_row(self, row_dict, organization):
        name = clean_value(row_dict.get("name"))
        if not name:
            return self.FAILED, "Supplier name is missing or empty."

        # Skip duplicates by supplier name within the same organization
        if self.check_duplicate(Supplier, organization, name=name):
            return self.SKIPPED, f"Supplier '{name}' already exists in organization '{organization.name}'."

        # Extract and clean field values
        country = clean_value(row_dict.get("country"), default="")
        city = clean_value(row_dict.get("city"), default="")
        # Map 'category' column from Excel to 'industry' field on Supplier model
        industry = clean_value(row_dict.get("industry") or row_dict.get("category"), default="")
        
        materials_supplied = parse_json_field(row_dict.get("materials_supplied"), default_type=list)
        moq = parse_int(row_dict.get("moq"), default=None)
        lead_time_days = parse_int(row_dict.get("lead_time_days"), default=None)
        quality_score = parse_int(row_dict.get("quality_score"), default=0)
        rating = parse_decimal(row_dict.get("rating"), default="0.00")
        performance_score = parse_int(row_dict.get("performance_score"), default=0)
        contact_email = clean_value(row_dict.get("contact_email"), default="")
        contact_phone = clean_value(row_dict.get("contact_phone"), default="")
        notes = clean_value(row_dict.get("notes"), default="")
        
        # Calculate preferred supplier status if not explicitly specified in sheet
        preferred_supplier = parse_bool(
            row_dict.get("preferred_supplier"),
            default=(quality_score >= 90 or rating >= Decimal("4.50"))
        )

        # Create Supplier record exclusively using Django ORM inside transaction block
        supplier = Supplier.objects.create(
            organization=organization,
            name=name,
            country=country,
            city=city,
            industry=industry,
            materials_supplied=materials_supplied,
            moq=moq,
            lead_time_days=lead_time_days,
            quality_score=quality_score,
            rating=rating,
            performance_score=performance_score,
            contact_email=contact_email,
            contact_phone=contact_phone,
            notes=notes,
            preferred_supplier=preferred_supplier,
        )

        # Proactively create a primary SupplierContact if email or phone is available
        if contact_email or contact_phone:
            SupplierContact.objects.create(
                organization=organization,
                supplier=supplier,
                name=f"{name} Primary Contact",
                email=contact_email,
                phone=contact_phone,
                designation="Procurement Representative",
                is_primary=True,
            )

        return self.IMPORTED, supplier
