from django.db import models
from django.conf import settings

from apps.common.models import OrgOwnedModel


class MarketplaceCategory(OrgOwnedModel):
    """Taxonomy shown in the Marketplace category explorer (Manufacturing, Logistics, Packaging, etc.)."""
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140)
    category_code = models.CharField(max_length=50, db_index=True, blank=True, default="")
    description = models.CharField(max_length=255, blank=True)
    icon = models.CharField(max_length=60, blank=True)  # emoji or lucide-react icon name
    color_theme = models.CharField(max_length=30, blank=True, default="#3b82f6")
    bg_theme = models.CharField(max_length=50, blank=True, default="rgba(59,130,246,0.08)")

    class Meta:
        ordering = ["name"]
        unique_together = ("organization", "slug")

    def __str__(self):
        return self.name

    @property
    def companies_count(self):
        return self.partners.count()


class MarketplacePartner(OrgOwnedModel):
    """
    Unified, multi-category business partner directory record for SupplyOS Marketplace.
    Supports all 10 enterprise categories: Raw Material Suppliers, Manufacturers, Packaging Companies,
    Warehouses, Logistics Providers, Quality Testing Labs, Certification Agencies, Machinery Suppliers,
    Import/Export Companies, and Business Consultants.
    """
    PRICE_CHOICES = [
        ("$", "$ - Economical"),
        ("$$", "$$ - Standard"),
        ("$$$", "$$$ - Premium"),
    ]
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("under_review", "Under Review"),
    ]

    # Core Business Information
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, blank=True)
    categories = models.ManyToManyField(MarketplaceCategory, related_name="partners")
    logo = models.CharField(max_length=500, default="🏭")  # Emoji or image URL
    banner = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    established_year = models.PositiveSmallIntegerField(default=2015)
    employees_range = models.CharField(max_length=50, default="50 - 100 Employees")
    annual_turnover = models.CharField(max_length=100, default="$5M - $10M")
    revenue_range = models.CharField(max_length=100, blank=True, default="$5M - $25M")
    
    # Contact & Location
    website = models.URLField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    head_office = models.CharField(max_length=255, blank=True, default="Ahmedabad, Gujarat")
    city = models.CharField(max_length=120, db_index=True, blank=True)
    state = models.CharField(max_length=120, db_index=True, blank=True)
    country = models.CharField(max_length=120, db_index=True, default="India")
    cities_served = models.JSONField(default=list, blank=True)
    countries_served = models.JSONField(default=list, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    social_links = models.JSONField(default=dict, blank=True)  # {"linkedin": "...", "twitter": "..."}
    price_tier = models.CharField(max_length=10, choices=PRICE_CHOICES, default="$$")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)

    # Performance, AI & Verification Metrics
    verified_status = models.BooleanField(default=True, db_index=True)
    moq_number = models.PositiveIntegerField(default=500, null=True, blank=True)  # Numeric for backend filtering
    moq_display = models.CharField(max_length=100, default="500 units", blank=True)
    lead_time_days = models.PositiveSmallIntegerField(default=14, null=True, blank=True, db_index=True)
    response_time_hours = models.PositiveSmallIntegerField(default=4)
    response_time_display = models.CharField(max_length=50, default="< 4 hrs", blank=True)
    quality_score = models.PositiveSmallIntegerField(default=92, db_index=True)  # 0 - 100
    performance_score = models.PositiveSmallIntegerField(default=90)  # 0 - 100
    ai_score = models.PositiveSmallIntegerField(default=94, db_index=True)  # 0 - 100 dynamic compatibility
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.80, db_index=True)
    reviews_count = models.PositiveIntegerField(default=45)
    completed_projects_count = models.PositiveIntegerField(default=120)
    availability_status = models.CharField(max_length=100, default="Available Now")
    
    # Common B2B Lists & Structured Industry Taxonomy
    specialization = models.CharField(max_length=255, db_index=True, blank=True, default="")  # Core specialization (heavily weighted by AI)
    primary_industry = models.CharField(max_length=150, db_index=True, blank=True, default="")
    secondary_industry = models.CharField(max_length=150, db_index=True, blank=True, default="")
    sub_industry = models.CharField(max_length=150, db_index=True, blank=True, default="")
    target_market = models.JSONField(default=list, blank=True)
    export_markets = models.JSONField(default=list, blank=True)
    services = models.JSONField(default=list, blank=True)
    specializations = models.JSONField(default=list, blank=True)
    keywords = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)  # e.g., ["GMP", "ISO 22000", "FSSAI", "Halal"]
    industries_served = models.JSONField(default=list, blank=True)  # e.g., ["Sports Nutrition", "Nutraceutical", "Food"]
    delivery_regions = models.JSONField(default=list, blank=True)  # e.g., ["Pan-India", "Global", "Europe", "North America"]

    # --- Category-Specific Domain Attributes ---
    # Raw Material Suppliers & Packaging Companies
    materials_supplied = models.JSONField(default=list, blank=True)
    products_offered = models.JSONField(default=list, blank=True)
    private_label_support = models.BooleanField(default=False, db_index=True)
    custom_manufacturing_support = models.BooleanField(default=False, db_index=True)
    white_label_support = models.BooleanField(default=False, db_index=True)
    export_ready = models.BooleanField(default=True, db_index=True)
    installation_support = models.BooleanField(default=False)
    maintenance_support = models.BooleanField(default=False)
    training_support = models.BooleanField(default=False)
    technical_documentation = models.BooleanField(default=True)
    inventory_support = models.BooleanField(default=True)
    quality_inspection = models.BooleanField(default=True)
    packaging_types = models.JSONField(default=list, blank=True)  # e.g., ["HDPE", "PET", "Glass", "Sachet", "Pouch", "Carton"]
    eco_friendly_options = models.BooleanField(default=False)
    label_printing_available = models.BooleanField(default=False)
    packaging_options = models.JSONField(default=list, blank=True)

    # Manufacturers & Machinery
    capabilities = models.JSONField(default=list, blank=True)  # e.g., ["Bulk Supply", "Export", "Technical Documentation"]
    machinery = models.JSONField(default=list, blank=True)  # e.g., ["Ribbon Blender", "Tablet Press", "Filling Machine", "CNC", "SMT"]
    production_lines_count = models.PositiveSmallIntegerField(default=5, null=True, blank=True)
    oem_available = models.BooleanField(default=False, db_index=True)
    odm_available = models.BooleanField(default=False, db_index=True)
    daily_capacity = models.CharField(max_length=100, default="5,000 units/day", blank=True)
    monthly_capacity_display = models.CharField(max_length=100, default="100,000 units/mo", blank=True)
    monthly_capacity_number = models.PositiveIntegerField(null=True, blank=True)
    annual_capacity = models.CharField(max_length=100, default="1.2M units/yr", blank=True)
    maximum_capacity = models.CharField(max_length=100, default="200,000 units/mo", blank=True)
    current_utilization_pct = models.PositiveSmallIntegerField(default=75, null=True, blank=True)

    # Warehouses
    warehouse_types = models.JSONField(default=list, blank=True)  # e.g., ["Ambient", "Cold Storage", "Frozen", "Hazardous", "Humidity Controlled"]
    pallet_capacity = models.PositiveIntegerField(null=True, blank=True)
    rack_system = models.CharField(max_length=150, blank=True, default="Multi-Tier Automated Pallet Racking")
    wms_supported = models.BooleanField(default=True, db_index=True)
    storage_capacity_sqft = models.PositiveIntegerField(null=True, blank=True)
    has_cold_storage = models.BooleanField(default=False, db_index=True)
    is_bonded_warehouse = models.BooleanField(default=False, db_index=True)
    warehouse_locations = models.JSONField(default=list, blank=True)

    # Logistics Providers
    fleet_size = models.PositiveIntegerField(null=True, blank=True)
    shipping_modes = models.JSONField(default=list, blank=True)  # e.g., ["Road", "Rail", "Air", "Sea", "Cold Chain"]
    average_delivery_days = models.PositiveSmallIntegerField(default=5, null=True, blank=True)
    has_cold_chain = models.BooleanField(default=False, db_index=True)
    express_delivery = models.BooleanField(default=True)
    last_mile_available = models.BooleanField(default=True)

    # Quality Testing Labs & Certification Agencies
    accreditations = models.JSONField(default=list, blank=True)  # e.g., ["NABL Accredited", "ISO/IEC 17025"]
    testing_capabilities = models.JSONField(default=list, blank=True)  # e.g., ["Protein", "Microbiology", "Heavy Metals", "Shelf Life", "Stability"]
    certificates_issued = models.JSONField(default=list, blank=True)  # e.g., ["FSSAI", "ISO", "HACCP", "WHO GMP", "FDA", "CE", "RoHS", "BIS"]
    standards_certified = models.JSONField(default=list, blank=True)
    audit_time_days = models.PositiveSmallIntegerField(default=14, null=True, blank=True)
    approval_time_days = models.PositiveSmallIntegerField(default=30, null=True, blank=True)

    # Business Consultants & Import/Export Services
    consulting_areas = models.JSONField(default=list, blank=True)  # e.g., ["Manufacturing", "Supply Chain", "Compliance", "Factory Setup", "ERP", "Lean Manufacturing"]
    consulting_specialities = models.JSONField(default=list, blank=True)
    trade_services = models.JSONField(default=list, blank=True)

    # ERP Backend Account Link (Optional)
    supplier_account = models.ForeignKey("suppliers.Supplier", null=True, blank=True, on_delete=models.SET_NULL, related_name="marketplace_partner")
    manufacturer_account = models.ForeignKey("manufacturers.Manufacturer", null=True, blank=True, on_delete=models.SET_NULL, related_name="marketplace_partner")

    class Meta:
        ordering = ["-rating", "-ai_score", "name"]
        unique_together = ("organization", "name")

    def __str__(self):
        return f"{self.name} ({self.city}, {self.country})"


class PartnerReview(OrgOwnedModel):
    """Reviews and ratings left by verified organizations for Marketplace Partners."""
    partner = models.ForeignKey(MarketplacePartner, related_name="reviews", on_delete=models.CASCADE)
    reviewer_name = models.CharField(max_length=150)
    reviewer_company = models.CharField(max_length=150, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)  # 1 to 5 stars
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    verified_buyer = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.rating}* Review by {self.reviewer_name} for {self.partner.name}"


class AIRecommendationLog(OrgOwnedModel):
    """Logs AI Advisor search intents and recommended outcomes for analytics and model feedback."""
    query = models.CharField(max_length=300, db_index=True, blank=True)
    extracted_intent = models.JSONField(default=dict, blank=True)
    top_partner_ids = models.JSONField(default=list, blank=True)
    user_context = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"AI Advised on query: '{self.query}' at {self.created_at}"


class MarketplaceSearchLog(OrgOwnedModel):
    """Every marketplace search is logged so we can surface real 'trending searches' per org."""
    query = models.CharField(max_length=255, db_index=True)
    result_count = models.PositiveIntegerField(default=0)
    searched_by = models.ForeignKey("users.User", null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        ordering = ["-created_at"]
