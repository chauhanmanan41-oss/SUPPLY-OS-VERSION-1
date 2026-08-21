from rest_framework import serializers

from .models import Material


class MaterialSerializer(serializers.ModelSerializer):
    default_supplier_name = serializers.CharField(source="default_supplier.name", read_only=True)

    class Meta:
        model = Material
        fields = [
            "id", "name", "sku", "description", "category", "unit", "specifications",
            "safety_stock", "minimum_stock", "maximum_stock", "lead_time_days",
            "weight", "weight_unit", "image", "default_supplier", "default_supplier_name",
            "last_purchase_price", "reorder_threshold", "notes", "status", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
