from rest_framework import serializers

from .models import SalesOrder, SalesOrderLine

class SalesOrderLineSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = SalesOrderLine
        fields = ["id", "product", "product_name", "quantity", "unit_price"]
        read_only_fields = ["id"]


class SalesOrderSerializer(serializers.ModelSerializer):
    lines = SalesOrderLineSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = [
            "id", "order_number", "customer_name", "customer_email", 
            "total_amount", "order_status", "warehouse", "created_at", "lines"
        ]
        read_only_fields = ["id", "order_number", "created_at", "total_amount"]

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        order = SalesOrder.objects.create(**validated_data)
        total = 0
        for line_data in lines_data:
            SalesOrderLine.objects.create(
                sales_order=order, 
                organization=order.organization, 
                created_by=order.created_by, 
                **line_data
            )
            total += (line_data['quantity'] * line_data['unit_price'])
        order.total_amount = total
        order.save(update_fields=['total_amount'])
        return order

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if lines_data is not None:
            instance.lines.all().delete()
            total = 0
            for line_data in lines_data:
                SalesOrderLine.objects.create(
                    sales_order=instance, 
                    organization=instance.organization, 
                    created_by=instance.created_by, 
                    **line_data
                )
                total += (line_data['quantity'] * line_data['unit_price'])
            instance.total_amount = total

        instance.save()
        return instance
