from rest_framework import serializers

from .models import (
    PurchaseRequest, PurchaseRequestLine,
    RFQ, RFQLine,
    Quotation, QuotationLine,
    PurchaseOrder, PurchaseOrderLine
)

# ----------------- Purchase Request -----------------

class PurchaseRequestLineSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = PurchaseRequestLine
        fields = ["id", "product", "product_name", "material", "material_name", "quantity"]
        read_only_fields = ["id"]

class PurchaseRequestSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(source="requested_by.full_name", read_only=True)
    lines = PurchaseRequestLineSerializer(many=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            "id", "needed_by", "pr_status", "requested_by", "requested_by_name", "notes", "created_at", "lines"
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        pr = PurchaseRequest.objects.create(**validated_data)
        for line_data in lines_data:
            PurchaseRequestLine.objects.create(
                purchase_request=pr, 
                organization=pr.organization, 
                created_by=pr.created_by, 
                **line_data
            )
        return pr

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if lines_data is not None:
            instance.lines.all().delete()
            for line_data in lines_data:
                PurchaseRequestLine.objects.create(
                    purchase_request=instance, 
                    organization=instance.organization, 
                    created_by=instance.created_by, 
                    **line_data
                )
        return instance

# ----------------- RFQ -----------------

class RFQLineSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)

    class Meta:
        model = RFQLine
        fields = ["id", "material", "material_name", "quantity"]
        read_only_fields = ["id"]

class RFQSerializer(serializers.ModelSerializer):
    supplier_names = serializers.SerializerMethodField()
    lines = RFQLineSerializer(many=True)

    class Meta:
        model = RFQ
        fields = [
            "id", "purchase_request", "suppliers", "supplier_names", 
            "due_date", "rfq_status", "notes", "created_at", "lines"
        ]
        read_only_fields = ["id", "created_at"]

    def get_supplier_names(self, obj):
        return list(obj.suppliers.values_list("name", flat=True))

    def create(self, validated_data):
        suppliers_data = validated_data.pop('suppliers', [])
        lines_data = validated_data.pop('lines', [])
        rfq = RFQ.objects.create(**validated_data)
        rfq.suppliers.set(suppliers_data)
        for line_data in lines_data:
            RFQLine.objects.create(
                rfq=rfq, 
                organization=rfq.organization, 
                created_by=rfq.created_by, 
                **line_data
            )
        return rfq

    def update(self, instance, validated_data):
        suppliers_data = validated_data.pop('suppliers', None)
        lines_data = validated_data.pop('lines', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if suppliers_data is not None:
            instance.suppliers.set(suppliers_data)

        if lines_data is not None:
            instance.lines.all().delete()
            for line_data in lines_data:
                RFQLine.objects.create(
                    rfq=instance, 
                    organization=instance.organization, 
                    created_by=instance.created_by, 
                    **line_data
                )
        return instance

# ----------------- Quotation -----------------

class QuotationLineSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)

    class Meta:
        model = QuotationLine
        fields = ["id", "material", "material_name", "quantity", "unit_price"]
        read_only_fields = ["id"]

class QuotationSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)
    lines = QuotationLineSerializer(many=True)

    class Meta:
        model = Quotation
        fields = [
            "id", "rfq", "supplier", "supplier_name", "delivery_days",
            "quote_status", "notes", "total_amount", "ai_recommended", 
            "ai_recommendation_reason", "created_at", "lines"
        ]
        read_only_fields = ["id", "ai_recommended", "ai_recommendation_reason", "created_at", "total_amount"]

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        quotation = Quotation.objects.create(**validated_data)
        total = 0
        for line_data in lines_data:
            QuotationLine.objects.create(
                quotation=quotation, 
                organization=quotation.organization, 
                created_by=quotation.created_by, 
                **line_data
            )
            total += (line_data['quantity'] * line_data['unit_price'])
        quotation.total_amount = total
        quotation.save(update_fields=['total_amount'])
        return quotation

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if lines_data is not None:
            instance.lines.all().delete()
            total = 0
            for line_data in lines_data:
                QuotationLine.objects.create(
                    quotation=instance, 
                    organization=instance.organization, 
                    created_by=instance.created_by, 
                    **line_data
                )
                total += (line_data['quantity'] * line_data['unit_price'])
            instance.total_amount = total
        
        instance.save()
        return instance

# ----------------- Purchase Order -----------------

class PurchaseOrderLineSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)

    class Meta:
        model = PurchaseOrderLine
        fields = ["id", "material", "material_name", "quantity", "unit_price", "received_quantity"]
        read_only_fields = ["id", "received_quantity"]

class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)
    lines = PurchaseOrderLineSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = [
            "id", "po_number", "supplier", "supplier_name",
            "warehouse", "quotation", "total_amount", "po_status",
            "expected_delivery", "actual_delivery", "created_at", "lines"
        ]
        read_only_fields = ["id", "po_number", "created_at", "total_amount"]

    def create(self, validated_data):
        lines_data = validated_data.pop('lines', [])
        po = PurchaseOrder.objects.create(**validated_data)
        total = 0
        for line_data in lines_data:
            PurchaseOrderLine.objects.create(
                purchase_order=po, 
                organization=po.organization, 
                created_by=po.created_by, 
                **line_data
            )
            total += (line_data['quantity'] * line_data['unit_price'])
        po.total_amount = total
        po.save(update_fields=['total_amount'])
        return po

    def update(self, instance, validated_data):
        lines_data = validated_data.pop('lines', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if lines_data is not None:
            instance.lines.all().delete()
            total = 0
            for line_data in lines_data:
                PurchaseOrderLine.objects.create(
                    purchase_order=instance, 
                    organization=instance.organization, 
                    created_by=instance.created_by, 
                    **line_data
                )
                total += (line_data['quantity'] * line_data['unit_price'])
            instance.total_amount = total

        instance.save()
        return instance


class CreatePOFromQuotationSerializer(serializers.Serializer):
    quotation = serializers.UUIDField()
    expected_delivery = serializers.DateField(required=False, allow_null=True)
