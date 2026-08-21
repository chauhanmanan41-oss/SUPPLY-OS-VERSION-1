from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.inventory.models import InventoryItem
from apps.inventory.services import adjust_reserved, apply_movement, get_or_create_inventory_item

from .models import SalesOrder


@receiver(post_save, sender=SalesOrder)
def reserve_stock_on_creation(sender, instance: SalesOrder, created, **kwargs):
    """New order -> reserve finished-goods stock so it isn't double-sold ('Reserve Inventory' step in the brief)."""
    if not created or instance.warehouse_id is None:
        return
    item = get_or_create_inventory_item(
        organization=instance.organization, warehouse=instance.warehouse, finished_product=instance.product
    )
    adjust_reserved(inventory_item=item, quantity_delta=instance.quantity)


@receiver(pre_save, sender=SalesOrder)
def release_and_ship_stock(sender, instance: SalesOrder, **kwargs):
    """Order transitions to 'shipped' -> release the reservation and actually decrement on-hand stock."""
    if instance.pk is None or instance.warehouse_id is None:
        return
    previous = SalesOrder.objects.filter(pk=instance.pk).only("order_status").first()
    if previous is None or previous.order_status == "shipped" or instance.order_status != "shipped":
        return

    item = InventoryItem.objects.filter(
        organization=instance.organization, warehouse=instance.warehouse, finished_product=instance.product
    ).first()
    if item is None:
        return

    adjust_reserved(inventory_item=item, quantity_delta=-instance.quantity)
    apply_movement(
        inventory_item=item,
        movement_type="sales_shipment",
        quantity_delta=-instance.quantity,
        reference=instance.order_number,
        notes=f"Shipped for order {instance.order_number}",
        organization=instance.organization,
        created_by=instance.updated_by,
    )
