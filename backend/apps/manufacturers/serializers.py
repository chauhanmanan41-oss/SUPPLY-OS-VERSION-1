from rest_framework import serializers

from .models import Manufacturer, ProductManufacturer, ManufacturerContact, ManufacturerDocument


class ManufacturerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManufacturerContact
        fields = ["id", "name", "email", "phone", "designation", "is_primary"]


class ManufacturerDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManufacturerDocument
        fields = ["id", "title", "document_type", "file", "uploaded_at"]


class ManufacturerSerializer(serializers.ModelSerializer):
    contacts = ManufacturerContactSerializer(many=True, read_only=True)
    documents = ManufacturerDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Manufacturer
        fields = [
            "id", "name", "website", "address_line_1", "city", "state", "postal_code",
            "country", "industry", "capabilities", "machinery",
            "certifications", "supported_materials", "monthly_capacity_units",
            "available_capacity_units", "specialization", "logo", "description",
            "moq", "lead_time_days", "rating", "quality_score", "price_tier",
            "contact_person", "contact_email", "contact_phone", "notes", "status", "created_at",
            "contacts", "documents"
        ]
        read_only_fields = ["id", "created_at"]


class ProductManufacturerSerializer(serializers.ModelSerializer):
    manufacturer_detail = ManufacturerSerializer(source="manufacturer", read_only=True)

    class Meta:
        model = ProductManufacturer
        fields = ["id", "product", "manufacturer", "manufacturer_detail", "is_selected", "notes"]
        read_only_fields = ["id"]
