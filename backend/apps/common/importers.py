import os
import json
from decimal import Decimal, InvalidOperation
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction, IntegrityError
import pandas as pd
import numpy as np


def clean_value(val, default=None):
    """
    Cleans values read from Excel via pandas/numpy.
    Converts NaN, NaT, Inf, and empty/whitespace-only strings to default.
    """
    if val is None:
        return default
    if isinstance(val, (float, np.floating)):
        if np.isnan(val) or np.isinf(val):
            return default
    if pd.isna(val):
        return default
    if isinstance(val, str):
        cleaned = val.strip()
        if not cleaned:
            return default
        return cleaned
    return val


def parse_json_field(val, default_type=list):
    """
    Safely parses JSON strings or comma-separated lists into Python objects for JSONField.
    """
    val = clean_value(val)
    if val is None:
        return default_type()
    if isinstance(val, (list, dict)):
        return val
    if isinstance(val, str):
        val_str = val.strip()
        if val_str.startswith("[") or val_str.startswith("{"):
            try:
                return json.loads(val_str)
            except (json.JSONDecodeError, ValueError):
                pass
        if default_type == list:
            if "," in val_str:
                return [item.strip() for item in val_str.split(",") if item.strip()]
            return [val_str] if val_str else []
    return default_type()


def parse_int(val, default=None):
    """Safely converts a value to an integer."""
    val = clean_value(val)
    if val is None:
        return default
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default


def parse_decimal(val, default="0.00"):
    """Safely converts a value to a Decimal."""
    val = clean_value(val)
    if val is None:
        return Decimal(str(default))
    try:
        return Decimal(str(val))
    except (InvalidOperation, ValueError, TypeError):
        return Decimal(str(default))


def parse_bool(val, default=False):
    """Safely converts a value to a boolean."""
    val = clean_value(val)
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    if isinstance(val, str):
        val_lower = val.lower()
        if val_lower in ("true", "1", "yes", "y", "t", "active"):
            return True
        if val_lower in ("false", "0", "no", "n", "f", "inactive"):
            return False
    return default


class BaseMasterDataImportCommand(BaseCommand):
    """
    Reusable base command for importing master data (Suppliers, Manufacturers,
    Materials, Warehouses, Logistics, Products) into SupplyOS from Excel files.
    """
    help = "Base master data import command."

    # Override in subclass:
    model = None
    default_file_path = None  # e.g., "data/SupplyOS_Realistic_100_Suppliers.xlsx"
    required_columns = []     # e.g., ["name", "country", "city"]

    # Status constants for row processing returns
    IMPORTED = "IMPORTED"
    SKIPPED = "SKIPPED"
    FAILED = "FAILED"

    def add_arguments(self, parser):
        parser.add_argument(
            "--organization",
            type=str,
            default=None,
            help="Name or slug of the target Organization (defaults to first organization if not supplied).",
        )
        parser.add_argument(
            "--file",
            type=str,
            default=None,
            help="Path to the Excel (.xlsx) file to import.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Perform validation and print report without saving changes to the database.",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=0,
            help="Limit the number of rows processed (useful for testing).",
        )

    def resolve_file_path(self, file_arg):
        path = file_arg or self.default_file_path
        if not path:
            raise CommandError("No file path specified and no default_file_path defined on command.")

        if not os.path.exists(path):
            # Try resolving relative to Django project root / base_dir
            from django.conf import settings
            base_dir = getattr(settings, "BASE_DIR", os.getcwd())
            potential_path = os.path.join(base_dir, path)
            if os.path.exists(potential_path):
                return potential_path
            raise CommandError(f"Excel file not found at '{path}' or '{potential_path}'.")
        return path

    def get_organization(self, org_name_or_slug=None):
        from apps.organizations.models import Organization
        if org_name_or_slug:
            org = Organization.objects.filter(name__iexact=org_name_or_slug).first()
            if not org:
                org = Organization.objects.filter(slug__iexact=org_name_or_slug).first()
            if not org:
                org = Organization.objects.filter(name__icontains=org_name_or_slug).first()
            if not org:
                raise CommandError(f"Organization '{org_name_or_slug}' not found.")
            return org
        else:
            org = Organization.objects.first()
            if not org:
                # Create a default organization if none exists so automatic assignment succeeds
                org = Organization.objects.create(
                    name="SupplyOS Default Org",
                    slug="supplyos-default-org",
                    plan="enterprise",
                    is_active=True,
                )
                self.stdout.write(self.style.NOTICE(f"[Notice] No organizations existed in DB. Created default organization: '{org.name}' ({org.id})"))
            return org

    def validate_columns(self, df_columns):
        missing = [col for col in self.required_columns if col not in df_columns]
        if missing:
            raise CommandError(
                f"Missing required columns in Excel file: {', '.join(missing)}.\n"
                f"Available columns in file: {', '.join(str(c) for c in df_columns)}"
            )

    def check_duplicate(self, model_class, organization, **filter_kwargs):
        """
        Helper method to check if a record already exists within the tenant organization using Django ORM.
        """
        return model_class.objects.filter(organization=organization, **filter_kwargs).exists()

    def process_row(self, row_dict, organization):
        """
        Override in subclass to map row_dict to Django ORM models and save.
        Must return a tuple: (status, message_or_instance)
        where status is self.IMPORTED, self.SKIPPED, or self.FAILED.
        """
        raise NotImplementedError("Subclasses of BaseMasterDataImportCommand must implement process_row().")

    def handle(self, *args, **options):
        org_arg = options.get("organization")
        file_arg = options.get("file")
        dry_run = options.get("dry_run", False)
        limit = options.get("limit", 0)

        organization = self.get_organization(org_arg)
        file_path = self.resolve_file_path(file_arg)

        self.stdout.write(self.style.MIGRATE_HEADING(f"=== SupplyOS Master Data Importer ==="))
        self.stdout.write(f"Target Organization : {self.style.SUCCESS(f'{organization.name} (UUID: {organization.id})')}")
        self.stdout.write(f"Source Excel File   : {file_path}")
        if dry_run:
            self.stdout.write(self.style.WARNING("Mode                : DRY RUN (No changes will be committed to DB)"))

        try:
            df = pd.read_excel(file_path)
        except Exception as e:
            raise CommandError(f"Failed to read Excel file '{file_path}': {e}")

        self.validate_columns(list(df.columns))

        if limit > 0:
            df = df.head(limit)
            self.stdout.write(f"Processing limit    : {limit} rows")

        total_rows = len(df)
        self.stdout.write(f"Total rows found    : {total_rows}\n")

        imported_count = 0
        skipped_count = 0
        failed_count = 0

        # Convert DataFrame rows to plain dictionary records
        records = df.to_dict(orient="records")

        # Wrap the entire import process in a database transaction
        try:
            with transaction.atomic():
                for idx, row in enumerate(records, start=1):
                    try:
                        # Nested savepoint transaction so an individual row failure doesn't break the whole transaction
                        with transaction.atomic():
                            status, msg = self.process_row(row, organization)
                            if status == self.IMPORTED:
                                imported_count += 1
                            elif status == self.SKIPPED:
                                skipped_count += 1
                                if options.get("verbosity", 1) >= 2:
                                    self.stdout.write(self.style.NOTICE(f"[Row {idx}/{total_rows}] Skipped: {msg}"))
                            elif status == self.FAILED:
                                failed_count += 1
                                self.stdout.write(self.style.ERROR(f"[Row {idx}/{total_rows}] Failed: {msg}"))
                            else:
                                raise ValueError(f"Unknown status returned from process_row: {status}")
                    except Exception as exc:
                        failed_count += 1
                        self.stdout.write(self.style.ERROR(f"[Row {idx}/{total_rows}] Exception: {str(exc)}"))

                    # Print progress updates every 25 rows or on final row
                    if idx % 25 == 0 or idx == total_rows:
                        self.stdout.write(
                            f"Progress: [{idx:3d}/{total_rows}] | "
                            f"Imported: {imported_count} | Skipped: {skipped_count} | Failed: {failed_count}"
                        )

                if dry_run:
                    self.stdout.write(self.style.WARNING("\nDRY RUN activated — Rolling back transaction..."))
                    raise CommandError("Dry run rollback.")

        except CommandError as e:
            if str(e) != "Dry run rollback.":
                raise e

        # Print Final Summary
        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.MIGRATE_HEADING("FINAL IMPORT SUMMARY"))
        self.stdout.write("=" * 50)
        self.stdout.write(f"Total Processed : {total_rows}")
        self.stdout.write(self.style.SUCCESS(f"Imported        : {imported_count}"))
        self.stdout.write(self.style.WARNING(f"Skipped         : {skipped_count}"))
        self.stdout.write(self.style.ERROR(  f"Failed          : {failed_count}"))
        self.stdout.write("=" * 50 + "\n")

        if failed_count > 0:
            self.stdout.write(self.style.WARNING(f"Import completed with {failed_count} failures."))
        else:
            self.stdout.write(self.style.SUCCESS("Import completed successfully!"))
