from django.db import models

from apps.common.models import OrgOwnedModel

MOVEMENT_TYPE_CHOICES = [
    ("purchase_receipt", "Purchase Receipt"),
    ("production_consumption", "Production Consumption"),
    ("production_output", "Production Output"),
    ("sales_shipment", "Sales Shipment"),
    ("transfer_in", "Warehouse Transfer In"),
    ("transfer_out", "Warehouse Transfer Out"),
    ("adjustment", "Manual Adjustment"),
    ("damage", "Damaged / Written Off"),
]


class InventoryItem(OrgOwnedModel):
    """
    Current stock of one material (or finished product) at one warehouse.
    `quantity_on_hand` is the physical count; `quantity_reserved` is stock
    already allocated to an order/production run; `available` = on_hand - reserved.
    """
    material = models.ForeignKey(
        "materials.Material", null=True, blank=True, related_name="inventory_items", on_delete=models.CASCADE
    )
    finished_product = models.ForeignKey(
        "products.Product", null=True, blank=True, related_name="finished_goods_items", on_delete=models.CASCADE
    )
    warehouse = models.ForeignKey("warehouses.Warehouse", related_name="inventory_items", on_delete=models.CASCADE)
    quantity_on_hand = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    quantity_reserved = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    quantity_damaged = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    reorder_threshold = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(material__isnull=False, finished_product__isnull=True)
                    | models.Q(material__isnull=True, finished_product__isnull=False)
                ),
                name="inventory_item_exactly_one_of_material_or_product",
            )
        ]

    @property
    def quantity_available(self):
        return self.quantity_on_hand - self.quantity_reserved

    @property
    def is_low_stock(self):
        return self.quantity_available <= self.reorder_threshold

    def __str__(self):
        subject = self.material.name if self.material_id else self.finished_product.name
        return f"{subject} @ {self.warehouse.name}"


class InventoryMovement(OrgOwnedModel):
    """
    Immutable ledger row for every stock change. InventoryItem.quantity_on_hand
    is a derived/cached total kept in sync by apps.inventory.services.apply_movement()
    — never mutate quantity_on_hand directly, always go through a movement.
    """
    inventory_item = models.ForeignKey(InventoryItem, related_name="movements", on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=30, choices=MOVEMENT_TYPE_CHOICES)
    quantity_delta = models.DecimalField(max_digits=14, decimal_places=2)  # signed: + increases, - decreases
    reference = models.CharField(max_length=100, blank=True)  # e.g. PO number, sales order number
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
