from rest_framework import serializers

from .models import Warehouse, WarehouseZone, WarehouseBin


class WarehouseBinSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseBin
        fields = ["id", "code", "capacity", "current_usage"]


class WarehouseZoneSerializer(serializers.ModelSerializer):
    bins = WarehouseBinSerializer(many=True, read_only=True)

    class Meta:
        model = WarehouseZone
        fields = ["id", "name", "code", "zone_type", "bins"]


class WarehouseSerializer(serializers.ModelSerializer):
    zones = WarehouseZoneSerializer(many=True, read_only=True)
    
    class Meta:
        model = Warehouse
        fields = [
            "id", "name", "code", "warehouse_type", "description", "address", 
            "city", "state", "postal_code", "country", "capacity_units", 
            "manager_name", "manager", "is_active", "status", "created_at",
            "zones"
        ]
        read_only_fields = ["id", "created_at"]
