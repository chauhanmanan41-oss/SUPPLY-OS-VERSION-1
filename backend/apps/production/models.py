from django.db import models

from apps.common.models import OrgOwnedModel

PLAN_STATUS = [("draft", "Draft"), ("scheduled", "Scheduled"), ("in_progress", "In Progress"), ("completed", "Completed")]
BATCH_STATUS = [
    ("scheduled", "Scheduled"), ("in_progress", "In Progress"),
    ("quality_check", "Quality Check"), ("completed", "Completed"), ("failed", "Failed"),
]


class ProductionPlan(OrgOwnedModel):
    product = models.ForeignKey("products.Product", related_name="production_plans", on_delete=models.CASCADE)
    planned_quantity = models.DecimalField(max_digits=14, decimal_places=2)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    plan_status = models.CharField(max_length=20, choices=PLAN_STATUS, default="draft")
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]


class ProductionBatch(OrgOwnedModel):
    production_plan = models.ForeignKey(ProductionPlan, related_name="batches", on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=40, unique=True)
    quantity_planned = models.DecimalField(max_digits=14, decimal_places=2)
    quantity_produced = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    machine = models.CharField(max_length=120, blank=True)
    warehouse = models.ForeignKey(
        "warehouses.Warehouse", null=True, blank=True, related_name="production_batches", on_delete=models.SET_NULL
    )
    batch_status = models.CharField(max_length=20, choices=BATCH_STATUS, default="scheduled")
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.batch_number:
            import uuid
            self.batch_number = f"BATCH-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class BillOfMaterial(OrgOwnedModel):
    product = models.OneToOneField("products.Product", related_name="bom", on_delete=models.CASCADE)
    version = models.CharField(max_length=20, default="v1.0")
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]


class BillOfMaterialLine(OrgOwnedModel):
    bom = models.ForeignKey(BillOfMaterial, related_name="lines", on_delete=models.CASCADE)
    material = models.ForeignKey("materials.Material", related_name="bom_lines", on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=14, decimal_places=4)
    scrap_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    instructions = models.TextField(blank=True)

    class Meta:
        ordering = ["id"]
        unique_together = ("bom", "material")

