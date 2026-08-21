from rest_framework import serializers

from .models import InventoryItem, InventoryMovement


class InventoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMovement
        fields = ["id", "movement_type", "quantity_delta", "reference", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class InventoryItemSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)
    product_name = serializers.CharField(source="finished_product.name", read_only=True)
    warehouse_name = serializers.CharField(source="warehouse.name", read_only=True)
    quantity_available = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            "id", "material", "material_name", "finished_product", "product_name",
            "warehouse", "warehouse_name", "quantity_on_hand", "quantity_reserved",
            "quantity_damaged", "quantity_available", "reorder_threshold",
            "is_low_stock", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "quantity_on_hand", "created_at", "updated_at"]


class InventoryAdjustmentSerializer(serializers.Serializer):
    """Manual stock correction — the only writable path to quantity_on_hand besides automated movements."""
    quantity_delta = serializers.DecimalField(max_digits=14, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True)
