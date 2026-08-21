from rest_framework import serializers

from .models import Product, ProductLifecycleStep, ProductMilestone, ProductTask


class ProductLifecycleStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLifecycleStep
        fields = ["id", "label", "order", "is_done"]
        read_only_fields = ["id"]


class ProductMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMilestone
        fields = ["id", "title", "due_date", "is_complete"]
        read_only_fields = ["id"]


class ProductTaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source="assignee.full_name", read_only=True)

    class Meta:
        model = ProductTask
        fields = ["id", "title", "column", "assignee", "assignee_name", "due_date"]
        read_only_fields = ["id"]


def serialize_partner_for_ws(p, category_key="suppliers"):
    if not p:
        return None
    return {
        "id": str(p.id),
        "name": p.name,
        "category": category_key,
        "logo": getattr(p, "logo", "🏭") or "🏭",
        "location": f"{getattr(p, 'city', '')}, {getattr(p, 'country', 'India')}".strip(", ") or getattr(p, 'country', "India"),
        "rating": float(getattr(p, "rating", 4.8)),
        "ai_match_pct": getattr(p, "ai_score", 95) or 95,
        "ai_score": getattr(p, "ai_score", 95) or 95,
        "lead_time_days": getattr(p, "lead_time_days", 14) or 14,
        "moq": getattr(p, "moq_display", "500 units") or f"{getattr(p, 'moq_number', 500) or 500} units",
        "certifications": p.certifications if hasattr(p, "certifications") and isinstance(p.certifications, list) else [],
        "description": getattr(p, "description", "") or "",
        "approved": True,
        "verified": getattr(p, "verified_status", True),
        "price_tier": p.get_price_tier_display() if hasattr(p, "get_price_tier_display") else "$$",
    }


class ProductSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    supply_chain = serializers.SerializerMethodField()
    approved_partners = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "project", "project_name", "name", "emoji", "stage",
            "progress_pct", "health_score", "risk_level", "budget_total",
            "budget_used_pct", "estimated_launch", "current_milestone",
            "category", "subcategory", "brand", "sku", "version", "product_type",
            "description", "target_industry", "country", "target_market", "priority",
            "creation_method", "commercial_data", "manufacturing_data", "raw_materials_data",
            "packaging_data", "warehouse_data", "logistics_data", "quality_data",
            "inventory_data", "documents_data", "team_data", "marketplace_recommendations",
            "approved_partners", "supply_chain", "ai_insights",
            "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_supply_chain(self, obj):
        def get_partner(rel_name, attr, cat):
            rels = getattr(obj, rel_name, None)
            if rels is not None:
                active = [r for r in rels.all() if getattr(r, "status", "active") == "active" and not getattr(r, "is_deleted", False)]
                if active and getattr(active[0], attr, None):
                    return serialize_partner_for_ws(getattr(active[0], attr), cat)
            return None

        return {
            "supplier": get_partner("workspace_suppliers", "supplier_partner", "raw_materials"),
            "manufacturer": get_partner("workspace_manufacturers", "manufacturer_partner", "manufacturers"),
            "warehouse": get_partner("workspace_warehouses", "warehouse_partner", "warehouses"),
            "packaging": get_partner("workspace_packaging", "packaging_partner", "packaging"),
            "transport": get_partner("workspace_transports", "transport_partner", "logistics"),
            "quality": get_partner("workspace_quality_labs", "quality_partner", "quality_labs"),
            "certification": get_partner("workspace_certifications", "certification_partner", "certifications"),
            "consultant": get_partner("workspace_consultants", "consultant_partner", "consultants"),
            "machinery": get_partner("workspace_machinery", "machinery_partner", "machinery"),
        }

    def get_approved_partners(self, obj):
        sc = self.get_supply_chain(obj)
        res = [p for p in sc.values() if p is not None]
        existing_ids = {str(p["id"]) for p in res}
        if isinstance(obj.approved_partners, list):
            for item in obj.approved_partners:
                if isinstance(item, dict) and str(item.get("id", "")) not in existing_ids:
                    res.append(item)
                    if item.get("id"):
                        existing_ids.add(str(item.get("id")))
        return res

    def to_representation(self, instance):
        if not getattr(instance, "_intelligence_hydrated", False):
            try:
                ai_meta = instance.ai_insights or {}
                needs_update = False
                if not ai_meta.get("executive_summary") or not instance.documents_data or len(instance.documents_data) < 13:
                    from apps.ai.dynamic_engine import ProductClassifier, WorkspaceSchemaGenerator, ExecutiveIntelligenceEngine, DocumentEngine
                    from apps.ai.recommendation_engine import RecommendationService
                    
                    classification = ProductClassifier.classify(instance.name, instance.category, instance.description)
                    schema = WorkspaceSchemaGenerator.get_schema(classification["key"], instance)
                    
                    if not instance.marketplace_recommendations:
                        try:
                            recs = RecommendationService.get_recommendations_for_workspace(instance, instance.organization)
                            instance.marketplace_recommendations = recs
                            needs_update = True
                        except Exception:
                            recs = {}
                    else:
                        recs = instance.marketplace_recommendations
                        
                    exec_summary = ExecutiveIntelligenceEngine.generate_summary(instance, classification, recs)
                    docs = DocumentEngine.generate_all_documents(instance, classification, schema, exec_summary)
                    
                    ai_meta["classification"] = classification
                    ai_meta["executive_summary"] = exec_summary
                    ai_meta["dynamic_modules"] = schema.get("modules", [])
                    instance.ai_insights = ai_meta
                    instance.documents_data = docs
                    needs_update = True
                    
                if needs_update:
                    instance.save(update_fields=["ai_insights", "documents_data", "marketplace_recommendations", "updated_at"])
                instance._intelligence_hydrated = True
            except Exception:
                pass
        return super().to_representation(instance)


class ProductWorkspaceSerializer(ProductSerializer):
    """Full workspace payload — everything the ProductWorkspace page tabs need in one call."""
    lifecycle_steps = ProductLifecycleStepSerializer(many=True, read_only=True)
    milestones = ProductMilestoneSerializer(many=True, read_only=True)
    tasks = ProductTaskSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ["lifecycle_steps", "milestones", "tasks"]


class CreateProductWizardSerializer(serializers.Serializer):
    """
    Validates wizard data sent from both Manual 12-Step and AI Assisted workflows.
    Allows dynamic structured dictionaries and array fields through to_internal_value.
    """
    productName = serializers.CharField(max_length=255, required=False, allow_blank=True, default="New Product")
    product_name = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    brandName = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    category = serializers.CharField(max_length=120, required=False, allow_blank=True, default="")
    industry = serializers.CharField(max_length=120, required=False, allow_blank=True, default="")
    description = serializers.CharField(required=False, allow_blank=True, default="")

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        # Pass through all extended 12-step specification dicts and AI extraction fields cleanly
        for k, v in data.items():
            if k not in ret:
                ret[k] = v
        return ret


