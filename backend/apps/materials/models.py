from django.db import models

from apps.common.models import OrgOwnedModel

UNIT_CHOICES = [
    ("kg", "Kilogram"), ("g", "Gram"), ("l", "Liter"), ("ml", "Milliliter"),
    ("unit", "Unit"), ("box", "Box"), ("pallet", "Pallet"), ("m", "Meter"),
    ("cm", "Centimeter"), ("roll", "Roll"), ("pack", "Pack"), ("ton", "Ton")
]


class Material(OrgOwnedModel):
    """Raw-material / packaging master record. Referenced by BOM line items, RFQs, and inventory."""
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=120, blank=True)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default="unit")
    specifications = models.JSONField(default=dict, blank=True)
    safety_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    minimum_stock = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    maximum_stock = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    lead_time_days = models.PositiveIntegerField(null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    weight_unit = models.CharField(max_length=10, choices=[("kg", "kg"), ("g", "g"), ("lb", "lb"), ("oz", "oz")], blank=True)
    image = models.ImageField(upload_to="materials/images/", blank=True, null=True)
    default_supplier = models.ForeignKey(
        "suppliers.Supplier", null=True, blank=True, related_name="default_for_materials",
        on_delete=models.SET_NULL,
    )
    last_purchase_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    reorder_threshold = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
