from rest_framework import serializers

from apps.manufacturers.serializers import ManufacturerSerializer
from apps.suppliers.serializers import SupplierSerializer

from .models import MarketplaceCategory, MarketplacePartner, PartnerReview, AIRecommendationLog, MarketplaceSearchLog


class MarketplaceCategorySerializer(serializers.ModelSerializer):
    companies_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = MarketplaceCategory
        fields = ["id", "name", "slug", "category_code", "description", "icon", "color_theme", "bg_theme", "companies_count"]
        read_only_fields = ["id", "companies_count"]


class PartnerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerReview
        fields = ["id", "reviewer_name", "reviewer_company", "rating", "title", "comment", "verified_buyer", "created_at"]
        read_only_fields = ["id", "created_at"]


class MarketplacePartnerSerializer(serializers.ModelSerializer):
    category_codes = serializers.SerializerMethodField()
    categories_info = serializers.SerializerMethodField()
    category_code = serializers.CharField(write_only=True, required=False)
    reviews = PartnerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = MarketplacePartner
        fields = [
            "id", "name", "slug", "category_code", "category_codes", "categories_info", "logo", "banner", "description",
            "established_year", "employees_range", "annual_turnover", "revenue_range", "website", "contact_email",
            "contact_phone", "address", "head_office", "city", "state", "country", "cities_served", "countries_served",
            "postal_code", "social_links", "price_tier", "status", "verified_status", "moq_number", "moq_display",
            "lead_time_days", "response_time_hours", "response_time_display", "quality_score", "performance_score",
            "ai_score", "rating", "reviews_count", "completed_projects_count", "availability_status",
            "specialization", "primary_industry", "secondary_industry", "sub_industry", "target_market", "export_markets",
            "services", "specializations", "keywords", "certifications", "industries_served", "delivery_regions",
            "materials_supplied", "products_offered", "private_label_support", "custom_manufacturing_support",
            "white_label_support", "export_ready", "installation_support", "maintenance_support", "training_support",
            "technical_documentation", "inventory_support", "quality_inspection", "packaging_types",
            "eco_friendly_options", "label_printing_available", "packaging_options", "capabilities", "machinery",
            "production_lines_count", "oem_available", "odm_available",
            "daily_capacity", "monthly_capacity_display", "monthly_capacity_number", "annual_capacity",
            "maximum_capacity", "current_utilization_pct", "storage_capacity_sqft",
            "warehouse_types", "pallet_capacity", "rack_system", "wms_supported",
            "has_cold_storage", "is_bonded_warehouse", "warehouse_locations", "fleet_size",
            "shipping_modes", "average_delivery_days", "has_cold_chain", "express_delivery", "last_mile_available",
            "accreditations", "testing_capabilities", "standards_certified", "certificates_issued",
            "audit_time_days", "approval_time_days", "consulting_areas", "consulting_specialities", "trade_services",
            "reviews", "created_at"
        ]
        read_only_fields = ["id", "created_at", "category_codes", "categories_info"]

    def create(self, validated_data):
        category_code = validated_data.pop("category_code", None)
        partner = super().create(validated_data)
        if category_code:
            from .models import MarketplaceCategory
            cats = MarketplaceCategory.objects.filter(category_code=category_code)
            if not cats.exists():
                cats = MarketplaceCategory.objects.filter(slug=category_code)
            if cats.exists():
                partner.categories.add(cats.first())
        return partner

    def get_category_codes(self, obj):
        return [c.category_code for c in obj.categories.all()]

    def get_categories_info(self, obj):
        return [{"name": c.name, "code": c.category_code, "icon": c.icon} for c in obj.categories.all()]


class MarketplaceSearchResultSerializer(serializers.Serializer):
    """Combined result envelope for a marketplace search across all partner types."""
    partners = MarketplacePartnerSerializer(many=True, required=False)
    manufacturers = ManufacturerSerializer(many=True, required=False)
    suppliers = SupplierSerializer(many=True, required=False)
    total_count = serializers.IntegerField()


class TrendingSearchSerializer(serializers.Serializer):
    query = serializers.CharField()
    count = serializers.IntegerField()
