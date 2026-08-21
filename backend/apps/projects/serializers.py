from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name", read_only=True)
    # Populated once the product workspace exists (see apps.products) —
    # lets the frontend jump straight into the workspace from the project card.
    product_id = serializers.SerializerMethodField()

    # Flattened Product workspace fields — the frontend's Projects page shows
    # project + product data together in one card, so rather than forcing two
    # round-trips (or a second nested serializer object), we surface the most
    # commonly displayed Product fields directly here. `null` until the
    # product workspace exists (i.e. right after project creation, before the
    # wizard finishes).
    stage = serializers.SerializerMethodField()
    progress_pct = serializers.SerializerMethodField()
    health_score = serializers.SerializerMethodField()
    risk_level = serializers.SerializerMethodField()
    budget_total = serializers.SerializerMethodField()
    budget_used_pct = serializers.SerializerMethodField()
    current_milestone = serializers.SerializerMethodField()
    estimated_launch = serializers.SerializerMethodField()
    emoji = serializers.SerializerMethodField()
    spent = serializers.SerializerMethodField()
    profit = serializers.SerializerMethodField()
    manufacturer = serializers.SerializerMethodField()
    warehouse = serializers.SerializerMethodField()
    transport = serializers.SerializerMethodField()
    suppliers = serializers.SerializerMethodField()
    ai_insight = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "name", "description", "category", "priority", "status",
            "owner", "owner_name", "target_launch_date", "product_id",
            "stage", "progress_pct", "health_score", "risk_level",
            "budget_total", "budget_used_pct", "current_milestone",
            "estimated_launch", "emoji", "spent", "profit", "manufacturer",
            "warehouse", "transport", "suppliers", "ai_insight",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def _product(self, obj):
        return getattr(obj, "product", None)

    def get_product_id(self, obj):
        product = self._product(obj)
        return str(product.id) if product else None

    def get_stage(self, obj):
        product = self._product(obj)
        return product.stage if product else None

    def get_progress_pct(self, obj):
        product = self._product(obj)
        return product.progress_pct if product else 0

    def get_health_score(self, obj):
        product = self._product(obj)
        return product.health_score if product else None

    def get_risk_level(self, obj):
        product = self._product(obj)
        return product.risk_level if product else None

    def get_budget_total(self, obj):
        product = self._product(obj)
        return float(product.budget_total) if product and product.budget_total is not None else None

    def get_budget_used_pct(self, obj):
        product = self._product(obj)
        return product.budget_used_pct if product else None

    def get_current_milestone(self, obj):
        product = self._product(obj)
        return product.current_milestone if product else ""

    def get_estimated_launch(self, obj):
        product = self._product(obj)
        return product.estimated_launch if product else ""

    def get_emoji(self, obj):
        product = self._product(obj)
        return product.emoji if product else ""

    def get_spent(self, obj):
        """budget_total * budget_used_pct/100 — both real fields, this is just the derived amount."""
        product = self._product(obj)
        if not product or product.budget_total is None:
            return None
        return round(float(product.budget_total) * (product.budget_used_pct / 100), 2)

    def get_profit(self, obj):
        """Real calculation: sum of this product's delivered/shipped sales revenue minus PO spend."""
        product = self._product(obj)
        if not product:
            return None
        from django.db.models import Sum
        from apps.orders.models import SalesOrder
        from apps.procurement.models import PurchaseOrder

        revenue = SalesOrder.objects.filter(
            product=product, order_status__in=["delivered", "shipped"]
        ).aggregate(total=Sum("total_amount"))["total"] or 0
        spend = PurchaseOrder.objects.filter(product=product).aggregate(
            total=Sum("total_amount")
        )["total"] or 0
        return float(revenue) - float(spend)

    def get_manufacturer(self, obj):
        """The manufacturer marked is_selected for this product, if one has been chosen yet."""
        product = self._product(obj)
        if not product:
            return ""
        link = product.manufacturers.through.objects.filter(product=product, is_selected=True).select_related(
            "manufacturer"
        ).first()
        return link.manufacturer.name if link else ""

    def get_warehouse(self, obj):
        # A product can touch multiple warehouses (inventory is per-warehouse) —
        # there's no single "the" warehouse for a project, so this is honestly
        # left blank rather than picking one arbitrarily. Surface warehouse
        # detail on the Inventory/Workspace pages instead, where it's scoped correctly.
        return ""

    def get_transport(self, obj):
        # Same reasoning as warehouse — transport is a per-shipment concept
        # (apps.logistics.Shipment), not a single project-level value.
        return ""

    def get_suppliers(self, obj):
        product = self._product(obj)
        if not product:
            return 0
        return product.suppliers.count()

    def get_ai_insight(self, obj):
        """
        A short, data-driven summary line — computed directly from this
        product's real fields, NOT a fabricated LLM narrative. Once
        apps.ai has a real provider configured, swap this for a genuine
        get_ai_service().ask() call scoped to this product.
        """
        product = self._product(obj)
        if not product:
            return ""
        parts = []
        if product.risk_level == "high":
            parts.append("Elevated risk — review blockers")
        elif product.risk_level == "medium":
            parts.append("Moderate risk")
        if product.budget_used_pct >= 90:
            parts.append("budget nearly exhausted")
        if product.progress_pct >= 80:
            parts.append("nearing completion")
        return "; ".join(parts).capitalize() if parts else "On track"
