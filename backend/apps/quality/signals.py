from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import QualityInspection


@receiver(post_save, sender=QualityInspection)
def handle_failed_inspection(sender, instance: QualityInspection, created, **kwargs):
    """
    If a Quality Inspection is logged as 'fail' or 'rework', 
    the associated Production Batch is marked as failed/on_hold respectively.
    """
    if not created:
        return
        
    batch = instance.production_batch
    if not batch:
        return
        
    if instance.result == "fail":
        batch.batch_status = "failed"
        batch.save(update_fields=["batch_status"])
    elif instance.result == "rework":
        batch.batch_status = "on_hold"
        batch.save(update_fields=["batch_status"])
