from rest_framework import serializers

from .models import ProductSupplier, Supplier, SupplierContact, SupplierDocument


class SupplierContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierContact
        fields = ["id", "name", "email", "phone", "designation", "is_primary"]


class SupplierDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierDocument
        fields = ["id", "title", "document_type", "file", "uploaded_at"]


class SupplierSerializer(serializers.ModelSerializer):
    contacts = SupplierContactSerializer(many=True, read_only=True)
    documents = SupplierDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Supplier
        fields = [
            "id", "name", "website", "gst_number", "address_line_1", "address_line_2", 
            "city", "state", "postal_code", "country", "industry", "materials_supplied",
            "certifications", "preferred_supplier", "logo", "description",
            "moq", "lead_time_days", "quality_score", "rating", "performance_score",
            "contact_email", "contact_phone", "notes", "status", "created_at",
            "contacts", "documents"
        ]
        read_only_fields = ["id", "created_at"]


class ProductSupplierSerializer(serializers.ModelSerializer):
    supplier_detail = SupplierSerializer(source="supplier", read_only=True)
    material_name = serializers.CharField(source="material.name", read_only=True)

    class Meta:
        model = ProductSupplier
        fields = [
            "id", "product", "supplier", "supplier_detail", "material",
            "material_name", "is_selected", "notes",
        ]
        read_only_fields = ["id"]
