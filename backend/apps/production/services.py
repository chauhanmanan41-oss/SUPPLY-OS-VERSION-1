from datetime import date
from django.db import transaction

from .models import ProductionBatch


@transaction.atomic
def start_production_batch(batch: ProductionBatch) -> ProductionBatch:
    """
    Marks a production batch as in-progress.
    Consumes raw materials based on the active BOM.
    """
    if batch.batch_status != "planned":
        raise ValueError("Only planned batches can be started.")
        
    from apps.inventory.services import apply_movement, get_or_create_inventory_item
    from apps.inventory.models import InventoryItem
    from .models import BillOfMaterial

    bom = BillOfMaterial.objects.filter(product=batch.production_plan.product, is_active=True).first()
    if bom:
        for line in bom.lines.all():
            multiplier = 1 + (line.scrap_percentage / 100)
            qty_needed = int(batch.quantity_planned * line.quantity * multiplier)
            
            item = InventoryItem.objects.filter(
                organization=batch.organization, warehouse=batch.warehouse, material=line.material
            ).first()
            
            if not item or item.quantity_available < qty_needed:
                raise ValueError(f"Insufficient stock for material: {line.material.name}. Needed: {qty_needed}, Available: {item.quantity_available if item else 0}")
                
            apply_movement(
                inventory_item=item,
                movement_type="production_consumption",
                quantity_delta=-qty_needed,
                reference=batch.batch_number,
                notes=f"Consumed for batch {batch.batch_number}",
                organization=batch.organization,
                created_by=batch.updated_by or batch.created_by,
            )

    batch.batch_status = "in_progress"
    batch.start_date = date.today()
    batch.save(update_fields=["batch_status", "start_date"])
    return batch


@transaction.atomic
def complete_production_batch(batch: ProductionBatch) -> ProductionBatch:
    """
    Marks a production batch as completed.
    apps.inventory listens for this transition (see apps/production/signals.py) 
    and automatically increases finished goods stock.
    """
    if batch.batch_status != "in_progress":
        raise ValueError("Only in-progress batches can be completed.")
        
    batch.batch_status = "completed"
    batch.end_date = date.today()
    batch.save(update_fields=["batch_status", "end_date"])
    return batch
