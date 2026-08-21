from django.dispatch import receiver
from django.db.models.signals import pre_save

from .models import ProductionBatch


@receiver(pre_save, sender=ProductionBatch)
def add_finished_goods_on_completion(sender, instance: ProductionBatch, **kwargs):
    """
    When a batch transitions into "completed", credits `quantity_produced`
    units of the parent product's finished-goods inventory — matches
    "Finished products move into Finished Goods Inventory" from the brief.
    """
    if instance.pk is None:
        return
    previous = ProductionBatch.objects.filter(pk=instance.pk).only("batch_status").first()
    if previous is None or previous.batch_status == "completed" or instance.batch_status != "completed":
        return
    if instance.warehouse_id is None or not instance.quantity_produced:
        return

    from apps.inventory.services import apply_movement, get_or_create_inventory_item

    product = instance.production_plan.product
    item = get_or_create_inventory_item(
        organization=instance.organization, warehouse=instance.warehouse, finished_product=product
    )
    apply_movement(
        inventory_item=item,
        movement_type="production_output",
        quantity_delta=instance.quantity_produced,
        reference=instance.batch_number,
        notes=f"Finished goods from {instance.batch_number}",
        organization=instance.organization,
        created_by=instance.updated_by,
    )
