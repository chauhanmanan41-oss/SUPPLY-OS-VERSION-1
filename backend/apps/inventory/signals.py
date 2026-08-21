from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.procurement.models import PurchaseOrder

from .models import InventoryMovement
from .services import apply_movement, get_or_create_inventory_item


@receiver(post_save, sender=InventoryMovement)
def notify_if_low_stock(sender, instance: InventoryMovement, created, **kwargs):
    if not created:
        return
    item = instance.inventory_item
    if item.is_low_stock:
        from apps.notifications.services import notify_all_org_members
        subject = item.material.name if item.material_id else item.finished_product.name
        notify_all_org_members(
            organization=instance.organization,
            notification_type="low_stock",
            message=f"{subject} is running low at {item.warehouse.name} "
                     f"({item.quantity_available} available).",
            link="/inventory",
            roles=["inventory_manager", "org_admin"],
        )


@receiver(pre_save, sender=PurchaseOrder)
def receive_purchase_order_stock(sender, instance: PurchaseOrder, **kwargs):
    """
    Fires right before a PurchaseOrder is saved. If its status is transitioning
    INTO "received" for the first time, creates an inventory receipt movement
    for every line item — this is what makes "Whenever supplier delivers:
    Inventory increases automatically" (from the project brief) actually true.

    Uses pre_save + comparing against the DB's previous value (rather than
    post_save) so we can tell a genuine transition apart from re-saving an
    already-received PO for an unrelated field change.
    """
    if instance.pk is None:
        return  # brand new PO, can't already be "received"

    previous = PurchaseOrder.objects.filter(pk=instance.pk).only("po_status").first()
    if previous is None or previous.po_status == "received" or instance.po_status != "received":
        return

    if instance.warehouse_id is None:
        # No warehouse chosen on the PO — nothing we can safely receive into.
        # Left as a warning rather than raising, so mark-received doesn't hard-fail.
        return

    for line in instance.line_items or []:
        material_id = line.get("material_id")
        quantity = line.get("quantity")
        if not material_id or quantity is None:
            continue

        from apps.materials.models import Material
        material = Material.objects.filter(id=material_id, organization=instance.organization).first()
        if material is None:
            continue

        item = get_or_create_inventory_item(
            organization=instance.organization, warehouse=instance.warehouse, material=material
        )
        apply_movement(
            inventory_item=item,
            movement_type="purchase_receipt",
            quantity_delta=quantity,
            reference=instance.po_number,
            notes=f"Auto-received from {instance.po_number}",
            organization=instance.organization,
            created_by=instance.updated_by,
        )
