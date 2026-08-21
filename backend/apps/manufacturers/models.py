from django.db import models

from apps.common.models import OrgOwnedModel


class Manufacturer(OrgOwnedModel):
    """
    A manufacturer directory entry. Organizations build up their own list of
    known/vetted manufacturers (this is NOT a shared cross-tenant directory —
    each org's manufacturer list is private data, per the multi-tenancy rule).
    """
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True)
    address_line_1 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=120, blank=True)
    industry = models.CharField(max_length=120, blank=True)
    capabilities = models.JSONField(default=list, blank=True)   # [str, ...]
    machinery = models.JSONField(default=list, blank=True)      # [str, ...]
    certifications = models.JSONField(default=list, blank=True)  # [str, ...]
    supported_materials = models.JSONField(default=list, blank=True)  # [str, ...]
    monthly_capacity_units = models.PositiveIntegerField(null=True, blank=True)
    available_capacity_units = models.PositiveIntegerField(null=True, blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    logo = models.ImageField(upload_to="manufacturers/logos/", blank=True, null=True)
    description = models.TextField(blank=True)
    moq = models.PositiveIntegerField(null=True, blank=True)
    lead_time_days = models.PositiveIntegerField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    quality_score = models.PositiveSmallIntegerField(default=0)
    price_tier = models.CharField(max_length=20, blank=True)  # e.g. "$", "$$", "$$$"
    contact_person = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)
    notes = models.TextField(blank=True)

    products = models.ManyToManyField(
        "products.Product", related_name="manufacturers", blank=True,
        through="ProductManufacturer",
    )

    class Meta:
        ordering = ["-rating", "name"]

    def __str__(self):
        return self.name


class ManufacturerContact(OrgOwnedModel):
    manufacturer = models.ForeignKey(Manufacturer, related_name="contacts", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    designation = models.CharField(max_length=120, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_primary", "name"]


class ManufacturerDocument(OrgOwnedModel):
    manufacturer = models.ForeignKey(Manufacturer, related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50, blank=True)
    file = models.FileField(upload_to="manufacturers/documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]


class ProductManufacturer(OrgOwnedModel):
    """Through-table linking a Product to a chosen Manufacturer (a product can compare several before picking one)."""
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    is_selected = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("product", "manufacturer")
