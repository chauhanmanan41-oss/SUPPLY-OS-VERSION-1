from rest_framework import serializers

from .models import Shipment


class ShipmentSerializer(serializers.ModelSerializer):
    po_number = serializers.CharField(source="purchase_order.po_number", read_only=True)
    order_number = serializers.CharField(source="sales_order.order_number", read_only=True)

    class Meta:
        model = Shipment
        fields = [
            "id", "shipment_type", "purchase_order", "po_number", "sales_order", "order_number",
            "courier", "vehicle", "tracking_number", "shipment_status", "eta",
            "delivered_at", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
