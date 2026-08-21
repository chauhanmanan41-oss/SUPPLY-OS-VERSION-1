from django.db import models

from apps.common.models import OrgOwnedModel

SHIPMENT_STATUS = [
    ("ready", "Ready"), ("packed", "Packed"), ("dispatched", "Dispatched"),
    ("in_transit", "In Transit"), ("delivered", "Delivered"), ("delayed", "Delayed"),
]
SHIPMENT_TYPE = [("inbound_po", "Inbound (Purchase Order)"), ("outbound_order", "Outbound (Sales Order)"), ("warehouse_transfer", "Warehouse Transfer")]


class Shipment(OrgOwnedModel):
    """
    Tracks any physical movement — inbound from a supplier PO, outbound to a
    customer sales order, or a transfer between warehouses. Exactly one of
    purchase_order / sales_order is set depending on shipment_type.
    """
    shipment_type = models.CharField(max_length=30, choices=SHIPMENT_TYPE)
    purchase_order = models.ForeignKey(
        "procurement.PurchaseOrder", null=True, blank=True, related_name="shipments", on_delete=models.CASCADE
    )
    sales_order = models.ForeignKey(
        "orders.SalesOrder", null=True, blank=True, related_name="shipments", on_delete=models.CASCADE
    )
    courier = models.CharField(max_length=120, blank=True)
    vehicle = models.CharField(max_length=120, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    shipment_status = models.CharField(max_length=20, choices=SHIPMENT_STATUS, default="ready")
    eta = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
