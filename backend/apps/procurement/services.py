from datetime import date
from django.db import transaction

from .models import PurchaseOrder, PurchaseOrderLine, Quotation


@transaction.atomic
def create_po_from_quotation(*, organization, user, quotation_id: str, expected_delivery=None) -> PurchaseOrder:
    """
    Creates a PurchaseOrder from an accepted Quotation and its lines.
    """
    quotation = Quotation.objects.prefetch_related("lines").select_related("rfq", "supplier").filter(
        id=quotation_id, organization=organization
    ).first()
    
    if not quotation:
        raise ValueError("Quotation not found in your organization.")

    po = PurchaseOrder.objects.create(
        organization=organization,
        created_by=user,
        supplier=quotation.supplier,
        quotation=quotation,
        total_amount=quotation.total_amount,
        expected_delivery=expected_delivery,
    )
    
    for q_line in quotation.lines.all():
        PurchaseOrderLine.objects.create(
            purchase_order=po,
            organization=organization,
            created_by=user,
            material=q_line.material,
            quantity=q_line.quantity,
            unit_price=q_line.unit_price,
            received_quantity=0,
        )
        
    return po


@transaction.atomic
def mark_po_received(po: PurchaseOrder) -> PurchaseOrder:
    """
    Marks the PO as received. apps.inventory listens for this transition.
    """
    if po.po_status == "received":
        return po
        
    po.po_status = "received"
    po.actual_delivery = date.today()
    po.save(update_fields=["po_status", "actual_delivery"])
    
    # Mark lines as fully received for now
    for line in po.lines.all():
        line.received_quantity = line.quantity
        line.save(update_fields=["received_quantity"])
        
    return po
