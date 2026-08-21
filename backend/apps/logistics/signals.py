from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Shipment


@receiver(pre_save, sender=Shipment)
def auto_complete_orders_on_delivery(sender, instance: Shipment, **kwargs):
    """
    If a Shipment is marked as 'delivered', transition the associated
    Sales Order or Purchase Order to its final state (delivered or received).
    """
    if instance.pk is None:
        return
        
    previous = Shipment.objects.filter(pk=instance.pk).only("shipment_status").first()
    if previous is None or previous.shipment_status == "delivered" or instance.shipment_status != "delivered":
        return
        
    if instance.shipment_type == "inbound" and instance.purchase_order:
        from apps.procurement.services import mark_po_received
        mark_po_received(instance.purchase_order)
    elif instance.shipment_type == "outbound" and instance.sales_order:
        from apps.orders.services import update_order_status
        update_order_status(instance.sales_order, "delivered")
