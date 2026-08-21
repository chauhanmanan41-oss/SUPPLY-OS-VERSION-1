from rest_framework import serializers

from .models import Blueprint


class BlueprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blueprint
        fields = [
            "id", "product", "is_current", "generation_status", "wizard_inputs",
            "manufacturing_process", "raw_materials", "machinery_required",
            "packaging_notes", "estimated_cost", "certifications_needed",
            "complexity", "production_timeline_days",
            "suggested_manufacturer_tags", "suggested_supplier_tags",
            "ai_provider", "created_at",
        ]
        read_only_fields = [
            "id", "generation_status", "manufacturing_process", "raw_materials",
            "machinery_required", "packaging_notes", "estimated_cost",
            "certifications_needed", "complexity", "production_timeline_days",
            "suggested_manufacturer_tags", "suggested_supplier_tags",
            "ai_provider", "ai_raw_response", "created_at",
        ]


class GenerateBlueprintRequestSerializer(serializers.Serializer):
    """
    What the wizard's Step 3 → "Generate" transition sends. Mirrors the
    frontend's WizardData shape (see the SupplyOS_Backend_Ready
    constants/wizard.js WIZARD_DEFAULTS for the exact field list).
    """
    product = serializers.UUIDField()
    product_name = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    flavor_variant = serializers.CharField(required=False, allow_blank=True)
    business_model = serializers.CharField(required=False, allow_blank=True)
    target_market = serializers.CharField(required=False, allow_blank=True)
    priority = serializers.CharField(required=False, allow_blank=True)
    budget = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
