from django.db import models

from apps.common.models import OrgOwnedModel

RESULT_CHOICES = [("pass", "Pass"), ("fail", "Fail"), ("pending", "Pending")]


class QualityInspection(OrgOwnedModel):
    """One inspection record per production batch (weight/size/color/packaging/standards checks)."""
    production_batch = models.ForeignKey(
        "production.ProductionBatch", related_name="quality_inspections", on_delete=models.CASCADE
    )
    checks = models.JSONField(default=dict, blank=True)  # {"weight": "pass", "packaging": "fail", ...}
    result = models.CharField(max_length=10, choices=RESULT_CHOICES, default="pending")
    inspected_by = models.ForeignKey("users.User", null=True, blank=True, on_delete=models.SET_NULL)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
