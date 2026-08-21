"""
The only correct way to change stock levels is through apply_movement().
Every other app (procurement, production, orders) that needs to move
inventory calls this function rather than writing to InventoryItem directly
— that's what keeps InventoryMovement a trustworthy audit ledger.
"""
from django.db import transaction

from .models import InventoryItem, InventoryMovement


@transaction.atomic
def apply_movement(*, inventory_item: InventoryItem, movement_type: str, quantity_delta,
                    reference: str = "", notes: str = "", organization, created_by=None) -> InventoryMovement:
    inventory_item = InventoryItem.objects.select_for_update().get(pk=inventory_item.pk)
    inventory_item.quantity_on_hand = inventory_item.quantity_on_hand + quantity_delta
    inventory_item.save(update_fields=["quantity_on_hand", "updated_at"])

    return InventoryMovement.objects.create(
        organization=organization,
        created_by=created_by,
        inventory_item=inventory_item,
        movement_type=movement_type,
        quantity_delta=quantity_delta,
        reference=reference,
        notes=notes,
    )


def get_or_create_inventory_item(*, organization, warehouse, material=None, finished_product=None) -> InventoryItem:
    assert bool(material) != bool(finished_product), "exactly one of material/finished_product is required"
    item, _ = InventoryItem.objects.get_or_create(
        organization=organization,
        warehouse=warehouse,
        material=material,
        finished_product=finished_product,
    )
    return item


@transaction.atomic
def adjust_reserved(*, inventory_item: InventoryItem, quantity_delta) -> InventoryItem:
    """
    Increases (or decreases, with a negative delta) quantity_reserved without
    touching quantity_on_hand — used when a sales order is placed (reserve)
    and later shipped (release the reservation + apply_movement decreases on_hand).
    """
    item = InventoryItem.objects.select_for_update().get(pk=inventory_item.pk)
    item.quantity_reserved = item.quantity_reserved + quantity_delta
    item.save(update_fields=["quantity_reserved", "updated_at"])
    return item


@transaction.atomic
def transfer_stock(*, organization, user, from_warehouse, to_warehouse, material=None, finished_product=None, quantity, notes=""):
    """
    Transfers stock between two warehouses by moving out of the source and into the destination.
    """
    if not material and not finished_product:
        raise ValueError("Must specify either material or finished_product to transfer.")
    if material and finished_product:
        raise ValueError("Cannot transfer both material and finished_product at the same time.")
    if from_warehouse == to_warehouse:
        raise ValueError("Source and destination warehouse cannot be the same.")
        
    source_item = get_or_create_inventory_item(
        organization=organization,
        warehouse=from_warehouse,
        material=material,
        finished_product=finished_product,
    )
    
    if source_item.quantity_on_hand < quantity:
        raise ValueError("Insufficient stock in source warehouse for transfer.")
        
    dest_item = get_or_create_inventory_item(
        organization=organization,
        warehouse=to_warehouse,
        material=material,
        finished_product=finished_product,
    )
    
    # Deduct from source
    apply_movement(
        inventory_item=source_item,
        movement_type="transfer_out",
        quantity_delta=-quantity,
        reference=f"To {to_warehouse.name}",
        notes=notes,
        organization=organization,
        created_by=user,
    )
    
    # Add to destination
    apply_movement(
        inventory_item=dest_item,
        movement_type="transfer_in",
        quantity_delta=quantity,
        reference=f"From {from_warehouse.name}",
        notes=notes,
        organization=organization,
        created_by=user,
    )
    
    return source_item, dest_item
