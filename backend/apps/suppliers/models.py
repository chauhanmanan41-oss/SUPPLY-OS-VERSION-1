from django.db import models

from apps.common.models import OrgOwnedModel


class Supplier(OrgOwnedModel):
    name = models.CharField(max_length=255)
    website = models.URLField(blank=True)
    gst_number = models.CharField(max_length=50, blank=True)
    address_line_1 = models.CharField(max_length=255, blank=True)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=120, blank=True)
    industry = models.CharField(max_length=120, blank=True)
    materials_supplied = models.JSONField(default=list, blank=True)  # [str, ...] material names/tags
    certifications = models.JSONField(default=list, blank=True)  # [str, ...]
    preferred_supplier = models.BooleanField(default=False)
    logo = models.ImageField(upload_to="suppliers/logos/", blank=True, null=True)
    description = models.TextField(blank=True)
    moq = models.PositiveIntegerField(null=True, blank=True)
    lead_time_days = models.PositiveIntegerField(null=True, blank=True)
    quality_score = models.PositiveSmallIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    performance_score = models.PositiveSmallIntegerField(default=0)  # rolling on-time/quality composite
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=32, blank=True)
    notes = models.TextField(blank=True)

    products = models.ManyToManyField(
        "products.Product", related_name="suppliers", blank=True, through="ProductSupplier"
    )

    class Meta:
        ordering = ["-rating", "name"]

    def __str__(self):
        return self.name


class SupplierContact(OrgOwnedModel):
    supplier = models.ForeignKey(Supplier, related_name="contacts", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    designation = models.CharField(max_length=120, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_primary", "name"]


class SupplierDocument(OrgOwnedModel):
    supplier = models.ForeignKey(Supplier, related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50, blank=True)
    file = models.FileField(upload_to="suppliers/documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]


class ProductSupplier(OrgOwnedModel):
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", null=True, blank=True, on_delete=models.SET_NULL)
    is_selected = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ("product", "supplier", "material")
