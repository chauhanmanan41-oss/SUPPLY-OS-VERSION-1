from django.conf import settings
from django.db import models

from apps.common.models import OrgOwnedModel

PR_STATUS = [("draft", "Draft"), ("pending_approval", "Pending Approval"), ("open", "Open"), ("sourcing", "Sourcing"), ("fulfilled", "Fulfilled"), ("cancelled", "Cancelled")]
RFQ_STATUS = [("draft", "Draft"), ("sent", "Sent"), ("quotes_received", "Quotes Received"), ("closed", "Closed")]
QUOTE_STATUS = [("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")]
PO_STATUS = [
    ("draft", "Draft"), ("sent", "Sent"), ("accepted", "Accepted"),
    ("in_production", "In Production"), ("shipped", "Shipped"),
    ("received", "Received"), ("cancelled", "Cancelled"),
]


class PurchaseRequest(OrgOwnedModel):
    """'Material Needed' — the trigger that starts the procurement workflow."""
    needed_by = models.DateField(null=True, blank=True)
    pr_status = models.CharField(max_length=20, choices=PR_STATUS, default="draft")
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

class PurchaseRequestLine(OrgOwnedModel):
    purchase_request = models.ForeignKey(PurchaseRequest, related_name="lines", on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", null=True, blank=True, related_name="pr_lines", on_delete=models.SET_NULL)
    material = models.ForeignKey("materials.Material", related_name="pr_lines", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=14, decimal_places=2)


class RFQ(OrgOwnedModel):
    """Request For Quotation, sent to one or more suppliers for a purchase request."""
    purchase_request = models.ForeignKey(
        PurchaseRequest, null=True, blank=True, related_name="rfqs", on_delete=models.SET_NULL
    )
    suppliers = models.ManyToManyField("suppliers.Supplier", related_name="rfqs")
    due_date = models.DateField(null=True, blank=True)
    rfq_status = models.CharField(max_length=20, choices=RFQ_STATUS, default="draft")
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

class RFQLine(OrgOwnedModel):
    rfq = models.ForeignKey(RFQ, related_name="lines", on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", related_name="rfq_lines", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=14, decimal_places=2)


class Quotation(OrgOwnedModel):
    """A single supplier's response to an RFQ."""
    rfq = models.ForeignKey(RFQ, related_name="quotations", on_delete=models.CASCADE)
    supplier = models.ForeignKey("suppliers.Supplier", related_name="quotations", on_delete=models.CASCADE)
    quote_status = models.CharField(max_length=20, choices=QUOTE_STATUS, default="pending")
    notes = models.TextField(blank=True)
    # Total quote summary
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    delivery_days = models.PositiveIntegerField(null=True, blank=True)
    
    # Filled in when AI comparison runs
    ai_recommended = models.BooleanField(default=False)
    ai_recommendation_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["total_amount"]
        unique_together = ("rfq", "supplier")

class QuotationLine(OrgOwnedModel):
    quotation = models.ForeignKey(Quotation, related_name="lines", on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", related_name="quote_lines", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=14, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)


class PurchaseOrder(OrgOwnedModel):
    """Issued once a quotation is accepted. This is what actually triggers inventory updates on receipt."""
    po_number = models.CharField(max_length=40, unique=True)
    supplier = models.ForeignKey("suppliers.Supplier", related_name="purchase_orders", on_delete=models.PROTECT)
    warehouse = models.ForeignKey(
        "warehouses.Warehouse", null=True, blank=True, related_name="purchase_orders", on_delete=models.SET_NULL
    )
    quotation = models.ForeignKey(
        Quotation, null=True, blank=True, related_name="purchase_orders", on_delete=models.SET_NULL
    )
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    po_status = models.CharField(max_length=20, choices=PO_STATUS, default="draft")
    expected_delivery = models.DateField(null=True, blank=True)
    actual_delivery = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.po_number

    def save(self, *args, **kwargs):
        if not self.po_number:
            import uuid
            self.po_number = f"PO-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

class PurchaseOrderLine(OrgOwnedModel):
    purchase_order = models.ForeignKey(PurchaseOrder, related_name="lines", on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", related_name="po_lines", on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=14, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    received_quantity = models.DecimalField(max_digits=14, decimal_places=2, default=0)
