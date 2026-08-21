from django.db import models

from apps.common.models import OrgOwnedModel

ORDER_STATUS = [
    ("draft", "Draft"), ("received", "Received"), ("payment_confirmed", "Payment Confirmed"),
    ("packing", "Packing"), ("shipped", "Shipped"), ("delivered", "Delivered"),
    ("cancelled", "Cancelled"),
]


class SalesOrder(OrgOwnedModel):
    order_number = models.CharField(max_length=40, unique=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField(blank=True)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    order_status = models.CharField(max_length=30, choices=ORDER_STATUS, default="draft")
    warehouse = models.ForeignKey(
        "warehouses.Warehouse", null=True, blank=True, related_name="sales_orders", on_delete=models.SET_NULL
    )

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"SO-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

class SalesOrderLine(OrgOwnedModel):
    sales_order = models.ForeignKey(SalesOrder, related_name="lines", on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", related_name="sales_order_lines", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
