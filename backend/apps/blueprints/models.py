from django.db import models

from apps.common.models import OrgOwnedModel

COMPLEXITY_CHOICES = [("low", "Low"), ("medium", "Medium"), ("high", "High")]

GENERATION_STATUS_CHOICES = [
    ("pending", "Pending"),
    ("generating", "Generating"),
    ("completed", "Completed"),
    ("failed", "Failed"),
]


class Blueprint(OrgOwnedModel):
    """
    The output of the AI Product Wizard (see apps.ai.services.blueprint_service).
    One product can regenerate its blueprint over time, so this is a FK (not
    OneToOne) — `is_current` marks which one the workspace currently shows.
    """
    product = models.ForeignKey("products.Product", related_name="blueprints", on_delete=models.CASCADE)
    is_current = models.BooleanField(default=True)
    generation_status = models.CharField(max_length=20, choices=GENERATION_STATUS_CHOICES, default="pending")

    # Wizard inputs that produced this blueprint (kept for regeneration / audit)
    wizard_inputs = models.JSONField(default=dict, blank=True)

    # AI outputs
    manufacturing_process = models.TextField(blank=True)
    raw_materials = models.JSONField(default=list, blank=True)     # [{name, quantity, unit, est_cost}, ...]
    machinery_required = models.JSONField(default=list, blank=True)  # [str, ...]
    packaging_notes = models.TextField(blank=True)
    estimated_cost = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    certifications_needed = models.JSONField(default=list, blank=True)  # [str, ...]
    complexity = models.CharField(max_length=10, choices=COMPLEXITY_CHOICES, default="medium")
    production_timeline_days = models.PositiveIntegerField(null=True, blank=True)
    suggested_manufacturer_tags = models.JSONField(default=list, blank=True)  # search hints, not FKs
    suggested_supplier_tags = models.JSONField(default=list, blank=True)

    ai_provider = models.CharField(max_length=50, blank=True)  # which AI provider generated this (see apps.ai)
    ai_raw_response = models.JSONField(null=True, blank=True)  # full provider payload, for debugging/audit

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Blueprint for {self.product_id} ({self.generation_status})"
