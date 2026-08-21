from rest_framework import serializers

from .models import ProductionBatch, ProductionPlan, BillOfMaterial, BillOfMaterialLine


class ProductionBatchSerializer(serializers.ModelSerializer):
    warehouse_name = serializers.CharField(source="warehouse.name", read_only=True)

    class Meta:
        model = ProductionBatch
        fields = [
            "id", "production_plan", "batch_number", "quantity_planned", "quantity_produced",
            "machine", "warehouse", "warehouse_name", "batch_status", "started_at", "completed_at",
        ]
        read_only_fields = ["id", "batch_number"]


class ProductionPlanSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    batches = ProductionBatchSerializer(many=True, read_only=True)

    class Meta:
        model = ProductionPlan
        fields = [
            "id", "product", "product_name", "planned_quantity", "start_date",
            "end_date", "plan_status", "notes", "batches", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class BillOfMaterialLineSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)

    class Meta:
        model = BillOfMaterialLine
        fields = ["id", "bom", "material", "material_name", "quantity", "scrap_percentage", "instructions"]
        read_only_fields = ["id"]


class BillOfMaterialSerializer(serializers.ModelSerializer):
    lines = BillOfMaterialLineSerializer(many=True, read_only=True)

    class Meta:
        model = BillOfMaterial
        fields = ["id", "product", "version", "is_active", "notes", "lines"]
        read_only_fields = ["id"]
