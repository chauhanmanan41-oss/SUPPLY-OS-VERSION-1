import csv
import re
from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.marketplace.models import MarketplaceCategory, MarketplacePartner
from apps.organizations.models import Organization

# Configurable constant for multi-organization deployments (set to a specific name or None to target all organizations)
DEFAULT_TENANT_NAME = None

BUSINESS_TYPE_MAP = {
    "Raw Material Supplier": {
        "code": "raw_materials",
        "name": "Raw Material Suppliers",
        "icon": "🧪",
        "color": "#16a34a",
        "bg": "rgba(22,163,74,0.08)",
        "desc": "Verified ingredients, chemicals & bulk active formulations",
    },
    "Contract Manufacturer": {
        "code": "manufacturers",
        "name": "Manufacturers",
        "icon": "🏭",
        "color": "#3b82f6",
        "bg": "rgba(59,130,246,0.08)",
        "desc": "GMP-certified contract & private label OEM/ODM facilities",
    },
    "Manufacturer": {
        "code": "manufacturers",
        "name": "Manufacturers",
        "icon": "🏭",
        "color": "#3b82f6",
        "bg": "rgba(59,130,246,0.08)",
        "desc": "GMP-certified contract & private label OEM/ODM facilities",
    },
    "Packaging Company": {
        "code": "packaging",
        "name": "Packaging Companies",
        "icon": "📦",
        "color": "#a855f7",
        "bg": "rgba(168,85,247,0.08)",
        "desc": "Bottles, jars, pouches, rigid containers & labels",
    },
    "Warehouse": {
        "code": "warehouses",
        "name": "Warehouses",
        "icon": "🏪",
        "color": "#f97316",
        "bg": "rgba(249,115,22,0.08)",
        "desc": "Dry, ambient, cold-chain & customs bonded port storage",
    },
    "Logistics Provider": {
        "code": "logistics",
        "name": "Logistics Providers",
        "icon": "🚚",
        "color": "#14b8a6",
        "bg": "rgba(20,184,166,0.08)",
        "desc": "Pan-India FTL/LTL freight, express ocean & air cargo",
    },
    "Quality Lab": {
        "code": "quality_labs",
        "name": "Quality Testing Labs",
        "icon": "🧫",
        "color": "#eab308",
        "bg": "rgba(234,179,8,0.08)",
        "desc": "NABL & ISO 17025 accredited analytical & shelf-life testing",
    },
    "Machinery Supplier": {
        "code": "machinery",
        "name": "Machinery Suppliers",
        "icon": "⚙️",
        "color": "#6b7280",
        "bg": "rgba(107,114,128,0.08)",
        "desc": "High-speed manufacturing, packaging & automation machinery",
    },
    "Certification Agency": {
        "code": "certifications",
        "name": "Certification Agencies",
        "icon": "🏅",
        "color": "#ff8a73",
        "bg": "rgba(255,138,115,0.08)",
        "desc": "GMP, FSSAI, CE, ISO 9001 & global regulatory audits",
    },
    "Consultant": {
        "code": "consultants",
        "name": "Business Consultants",
        "icon": "💼",
        "color": "#6366f1",
        "bg": "rgba(99,102,241,0.08)",
        "desc": "Factory setup, lean manufacturing & supply chain strategy",
    },
}


class Command(BaseCommand):
    help = "Imports marketplace company directory from SupplyOS_Marketplace_Dataset_V1.csv"

    def handle(self, *args, **options):
        # Resolve CSV path safely
        base_dir = Path(settings.BASE_DIR)
        csv_path = base_dir / "data" / "marketplace" / "SupplyOS_Marketplace_Dataset_V1.csv"
        if not csv_path.exists():
            csv_path = Path(__file__).resolve().parents[4] / "data" / "marketplace" / "SupplyOS_Marketplace_Dataset_V1.csv"
        if not csv_path.exists():
            self.stdout.write(self.style.ERROR(f"Error: Dataset CSV not found at {csv_path}"))
            return

        # Resolve target organization(s)
        if DEFAULT_TENANT_NAME:
            orgs = Organization.objects.filter(name=DEFAULT_TENANT_NAME)
        else:
            orgs = Organization.objects.all()

        if not orgs.exists():
            self.stdout.write(self.style.ERROR("Error: No organization exists in the database to link marketplace partners."))
            return

        for org in orgs:
            self.stdout.write(f"\nProcessing import for organization: {org.name}...")

            # Ensure all category taxonomy relationships exist in organization
            category_cache = {}
            for b_type, meta in BUSINESS_TYPE_MAP.items():
                cat, _ = MarketplaceCategory.objects.get_or_create(
                    organization=org,
                    category_code=meta["code"],
                    defaults={
                        "name": meta["name"],
                        "slug": slugify(meta["name"]),
                        "icon": meta["icon"],
                        "color_theme": meta["color"],
                        "bg_theme": meta["bg"],
                        "description": meta["desc"],
                    }
                )
                category_cache[b_type] = cat

            self.stdout.write("Reading CSV...")

            imported_count = 0
            skipped_count = 0
            failed_count = 0

            existing_slugs = set(MarketplacePartner.objects.filter(organization=org).values_list("slug", flat=True))

            with open(csv_path, mode="r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row_idx, row in enumerate(reader, start=1):
                    company_name = str(row.get("company_name") or "").strip()
                    if not company_name:
                        continue

                    try:
                        business_type = str(row.get("business_type") or "").strip()
                        cat_info = BUSINESS_TYPE_MAP.get(business_type)
                        cat_code = cat_info["code"] if cat_info else ""

                        # Duplicate Check using company name, organization, business type
                        existing_qs = MarketplacePartner.objects.filter(organization=org, name=company_name)
                        if cat_code and existing_qs.filter(categories__category_code=cat_code).exists() or existing_qs.exists():
                            self.stdout.write(f"Skipped: Company already exists ({company_name})")
                            skipped_count += 1
                            continue

                        # Data Cleanup & Conversions
                        industry = str(row.get("industry") or "").strip()
                        city = str(row.get("city") or "").strip()
                        state = str(row.get("state") or "").strip()
                        website = str(row.get("website") or "").strip()

                        # Boolean conversion for verified status
                        verified_raw = str(row.get("verified") or "").strip().lower()
                        is_verified = verified_raw in ["yes", "y", "true", "1"]

                        # Rating conversion to Decimal
                        try:
                            rating_val = Decimal(str(row.get("rating") or "4.80").strip())
                        except (ValueError, TypeError, InvalidOperation):
                            rating_val = Decimal("4.80")

                        # Reviews count conversion to int
                        try:
                            reviews_val = int(float(str(row.get("reviews") or 0).strip()))
                        except (ValueError, TypeError):
                            reviews_val = 0

                        # Lead time conversion to int
                        try:
                            lead_time_val = int(float(str(row.get("lead_time_days") or 14).strip()))
                        except (ValueError, TypeError):
                            lead_time_val = 14

                        # Response time conversion to int & display
                        try:
                            resp_hours = int(float(str(row.get("response_time_hours") or 4).strip()))
                        except (ValueError, TypeError):
                            resp_hours = 4
                        response_time_display = f"< {resp_hours} hrs"

                        # Established year conversion
                        try:
                            est_year = int(float(str(row.get("established_year") or 2015).strip()))
                        except (ValueError, TypeError):
                            est_year = 2015

                        # MOQ conversion (both numeric and display string)
                        moq_display_str = str(row.get("moq") or "500 units").strip()
                        moq_nums = re.findall(r"\d+", moq_display_str)
                        moq_num = int(moq_nums[0]) if moq_nums else 500

                        # Capacity conversion
                        capacity_display_str = str(row.get("capacity") or "").strip()
                        cap_nums = re.findall(r"\d+", capacity_display_str)
                        capacity_num = int(cap_nums[0]) if cap_nums else None

                        # Normalize lists: certifications, products_services, capabilities
                        def split_norm(val_str):
                            if not val_str:
                                return []
                            return [item.strip() for item in str(val_str).split(",") if item.strip()]

                        certifications_list = split_norm(row.get("certifications"))
                        products_list = split_norm(row.get("products_services"))
                        capabilities_list = split_norm(row.get("capabilities"))

                        # Description generation (do not overwrite if exists/provided)
                        desc = str(row.get("description") or "").strip()
                        if not desc:
                            prods_summary = ", ".join(products_list[:3])
                            spec_str = f" specializing in {prods_summary}" if prods_summary else ""
                            loc_parts = [part for part in [city, state] if part]
                            loc_str = ", ".join(loc_parts) if loc_parts else "India"
                            ind_str = f"{industry} " if industry else ""
                            desc = f"Leading {ind_str}{business_type}{spec_str} serving manufacturers across {loc_str} and nationwide."

                        # Unique Slug Generation
                        base_slug = slugify(company_name)[:250] or f"partner-{row_idx}"
                        slug_cand = base_slug
                        suffix_counter = 1
                        while slug_cand in existing_slugs or MarketplacePartner.objects.filter(organization=org, slug=slug_cand).exists():
                            slug_cand = f"{base_slug}-{suffix_counter}"
                            suffix_counter += 1
                        existing_slugs.add(slug_cand)

                        # Prepare category-specific JSON fields
                        materials_supplied = products_list if business_type in ["Raw Material Supplier", "Packaging Company"] else []
                        testing_capabilities = capabilities_list if business_type == "Quality Lab" else []
                        consulting_specialities = capabilities_list if business_type == "Consultant" else []
                        shipping_modes = capabilities_list if business_type == "Logistics Provider" else []
                        machinery = capabilities_list if business_type == "Machinery Supplier" else []

                        # Create MarketplacePartner
                        partner = MarketplacePartner.objects.create(
                            organization=org,
                            name=company_name,
                            slug=slug_cand,
                            description=desc,
                            established_year=est_year,
                            website=website,
                            city=city,
                            state=state,
                            country="India",
                            status="active",
                            verified_status=is_verified,
                            moq_number=moq_num,
                            moq_display=moq_display_str,
                            lead_time_days=lead_time_val,
                            response_time_hours=resp_hours,
                            response_time_display=response_time_display,
                            rating=rating_val,
                            reviews_count=reviews_val,
                            monthly_capacity_display=capacity_display_str,
                            monthly_capacity_number=capacity_num,
                            certifications=certifications_list,
                            industries_served=[industry] if industry else [],
                            products_offered=products_list,
                            materials_supplied=materials_supplied,
                            capabilities=capabilities_list,
                            testing_capabilities=testing_capabilities,
                            consulting_specialities=consulting_specialities,
                            shipping_modes=shipping_modes,
                            machinery=machinery,
                            oem_available=True if business_type in ["Contract Manufacturer", "Manufacturer"] else False,
                            odm_available=True if business_type in ["Contract Manufacturer", "Manufacturer"] else False,
                        )

                        # Link Category
                        cat_obj = category_cache.get(business_type)
                        if not cat_obj:
                            fallback_code = slugify(business_type or "general")
                            cat_obj, _ = MarketplaceCategory.objects.get_or_create(
                                organization=org,
                                category_code=fallback_code,
                                defaults={"name": business_type or "General", "slug": fallback_code}
                            )
                        partner.categories.add(cat_obj)

                        self.stdout.write(f"{company_name} imported")
                        imported_count += 1

                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"{company_name}\nReason: {str(e)}"))
                        failed_count += 1
                        continue

            self.stdout.write("\nImport Complete")
            self.stdout.write(f"Imported: {imported_count}")
            self.stdout.write(f"Skipped: {skipped_count}")
            self.stdout.write(f"Failed: {failed_count}")

