from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.viewsets import OrgScopedModelViewSet

from .models import (
    Product, ProductMilestone, ProductTask,
    WorkspaceSupplier, WorkspaceManufacturer, WorkspaceWarehouse,
    WorkspacePackaging, WorkspaceTransport, WorkspaceQualityLab,
    WorkspaceCertificationAgency, WorkspaceConsultant, WorkspaceMachinery,
)
from .serializers import (
    ProductMilestoneSerializer,
    ProductSerializer,
    ProductTaskSerializer,
    ProductWorkspaceSerializer,
    CreateProductWizardSerializer,
    serialize_partner_for_ws,
)
from .services import create_product_with_workspace


class ProductViewSet(OrgScopedModelViewSet):
    queryset = Product.objects.select_related("project").prefetch_related(
        "lifecycle_steps", "milestones", "tasks",
        "workspace_suppliers__supplier_partner",
        "workspace_manufacturers__manufacturer_partner",
        "workspace_warehouses__warehouse_partner",
        "workspace_packaging__packaging_partner",
        "workspace_transports__transport_partner",
        "workspace_quality_labs__quality_partner",
        "workspace_certifications__certification_partner",
        "workspace_consultants__consultant_partner",
        "workspace_machinery__machinery_partner",
    ).all()
    serializer_class = ProductSerializer
    filterset_fields = ["stage", "risk_level", "status"]
    search_fields = ["name"]
    ordering_fields = ["created_at", "progress_pct", "health_score"]

    def get_serializer_class(self):
        if self.action == "workspace":
            return ProductWorkspaceSerializer
        return super().get_serializer_class()

    def _ensure_context_aware_recommendations(self, product):
        recs = product.marketplace_recommendations or {}
        needs_recalc = False
        if not recs or not isinstance(recs, dict):
            needs_recalc = True
        else:
            for cat, items in recs.items():
                if isinstance(items, list) and len(items) > 0:
                    if "overall_score" not in items[0] or "tradeoffs" not in items[0]:
                        needs_recalc = True
                        break
        if needs_recalc:
            try:
                from apps.ai.recommendation_engine import RecommendationService
                product.marketplace_recommendations = RecommendationService.get_recommendations_for_workspace(product, product.organization)
                product.save(update_fields=["marketplace_recommendations", "updated_at"])
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"Failed to auto-update recommendations: {e}")

    def retrieve(self, request, *args, **kwargs):
        product = self.get_object()
        self._ensure_context_aware_recommendations(product)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def workspace(self, request, pk=None):
        """GET /api/v1/products/{id}/workspace/ — everything the workspace page needs in one call."""
        product = self.get_object()
        self._ensure_context_aware_recommendations(product)
        # Dynamically calculate progress percentage based on completed lifecycle steps
        total_steps = product.lifecycle_steps.count()
        if total_steps > 0:
            done_steps = product.lifecycle_steps.filter(is_done=True).count()
            calc_progress = int((done_steps / total_steps) * 100)
            if calc_progress != product.progress_pct:
                product.progress_pct = calc_progress
                product.save(update_fields=["progress_pct", "updated_at"])
        return Response(ProductWorkspaceSerializer(product).data)

    @action(detail=True, methods=["get", "post"])
    def tasks(self, request, pk=None):
        product = self.get_object()
        if request.method == "POST":
            serializer = ProductTaskSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(product=product, organization=request.organization, created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(ProductTaskSerializer(product.tasks.all(), many=True).data)

    @action(detail=True, methods=["get", "post"])
    def milestones(self, request, pk=None):
        product = self.get_object()
        if request.method == "POST":
            serializer = ProductMilestoneSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(product=product, organization=request.organization, created_by=request.user)
            return Response(serializer.data, status=201)
        return Response(ProductMilestoneSerializer(product.milestones.all(), many=True).data)

    @action(detail=False, methods=["post"], url_path="create-from-wizard")
    def create_from_wizard(self, request):
        """
        POST /api/v1/products/create-from-wizard/
        Called by the Product Creation Wizard after Step 3. Creates the full
        workspace (Project + Product + LifecycleSteps + Milestones) in one
        atomic transaction via the service layer.
        """
        serializer = CreateProductWizardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = create_product_with_workspace(
            organization=request.organization,
            user=request.user,
            wizard_data=serializer.validated_data,
        )
        return Response(ProductWorkspaceSerializer(product).data, status=201)

    def _handle_assign_partner(self, request, pk, role_name):
        product = self.get_object()
        partner_id = request.data.get("partner_id") or request.data.get("id")
        if not partner_id:
            return Response({"error": "partner_id is required"}, status=400)

        from apps.marketplace.models import MarketplacePartner
        partner = MarketplacePartner.objects.filter(organization=request.organization, id=partner_id).first() or MarketplacePartner.objects.filter(id=partner_id).first()
        if not partner:
            return Response({"error": "Marketplace partner not found in directory"}, status=404)

        model_map = {
            "supplier": (WorkspaceSupplier, "supplier_partner", "raw_materials", "workspace_suppliers"),
            "manufacturer": (WorkspaceManufacturer, "manufacturer_partner", "manufacturers", "workspace_manufacturers"),
            "warehouse": (WorkspaceWarehouse, "warehouse_partner", "warehouses", "workspace_warehouses"),
            "transport": (WorkspaceTransport, "transport_partner", "logistics", "workspace_transports"),
            "packaging": (WorkspacePackaging, "packaging_partner", "packaging", "workspace_packaging"),
            "quality": (WorkspaceQualityLab, "quality_partner", "quality_labs", "workspace_quality_labs"),
            "certification": (WorkspaceCertificationAgency, "certification_partner", "certifications", "workspace_certifications"),
            "consultant": (WorkspaceConsultant, "consultant_partner", "consultants", "workspace_consultants"),
            "machinery": (WorkspaceMachinery, "machinery_partner", "machinery", "workspace_machinery"),
        }
        if role_name not in model_map:
            return Response({"error": "Invalid role"}, status=400)

        model_cls, attr_name, cat_key, rel_name = model_map[role_name]

        # No duplicate assignments: Delete any existing mapping for this workspace & role
        model_cls.objects.filter(workspace=product).delete()

        kwargs = {
            "organization": request.organization,
            "created_by": request.user,
            "workspace": product,
            attr_name: partner,
            "status": "active",
        }
        model_cls.objects.create(**kwargs)

        recs = product.marketplace_recommendations or {}
        cat_list = recs.get(cat_key, [])
        for item in cat_list:
            if str(item.get("id")) == str(partner.id):
                item["approved"] = True

        product.marketplace_recommendations = recs
        product.save(update_fields=["marketplace_recommendations", "updated_at"])

        # Refresh product instance to reflect new relational links in serializers
        product = self.get_queryset().filter(id=product.id).first()
        ws_data = ProductWorkspaceSerializer(product).data

        return Response({
            "success": True,
            "role": role_name,
            "assigned_partner": serialize_partner_for_ws(partner, cat_key),
            "approved_partners": ws_data.get("approved_partners", []),
            "marketplace_recommendations": ws_data.get("marketplace_recommendations", {}),
            "workspace": ws_data
        }, status=200)

    def _handle_remove_partner(self, request, pk, role_name):
        product = self.get_object()
        model_map = {
            "supplier": WorkspaceSupplier,
            "manufacturer": WorkspaceManufacturer,
            "warehouse": WorkspaceWarehouse,
            "transport": WorkspaceTransport,
            "packaging": WorkspacePackaging,
            "quality": WorkspaceQualityLab,
            "certification": WorkspaceCertificationAgency,
            "consultant": WorkspaceConsultant,
            "machinery": WorkspaceMachinery,
        }
        if role_name not in model_map:
            return Response({"error": "Invalid role"}, status=400)

        model_cls = model_map[role_name]
        partner_id = request.data.get("partner_id") or request.query_params.get("partner_id")
        qs = model_cls.objects.filter(workspace=product)
        if partner_id:
            attr_map = {
                "supplier": "supplier_partner_id", "manufacturer": "manufacturer_partner_id",
                "warehouse": "warehouse_partner_id", "transport": "transport_partner_id",
                "packaging": "packaging_partner_id", "quality": "quality_partner_id",
                "certification": "certification_partner_id", "consultant": "consultant_partner_id",
                "machinery": "machinery_partner_id"
            }
            qs = qs.filter(**{attr_map[role_name]: partner_id})

        qs.delete()

        product = self.get_queryset().filter(id=product.id).first()
        ws_data = ProductWorkspaceSerializer(product).data

        return Response({
            "success": True,
            "role": role_name,
            "removed": True,
            "workspace": ws_data
        }, status=200)

    @action(detail=True, methods=["get"], url_path="supply-chain")
    def supply_chain(self, request, pk=None):
        product = self.get_object()
        serializer = ProductWorkspaceSerializer(product)
        return Response(serializer.get_supply_chain(product))

    @action(detail=True, methods=["post", "delete"], url_path="supplier")
    def supplier(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "supplier")
        else: return self._handle_remove_partner(request, pk, "supplier")

    @action(detail=True, methods=["post", "delete"], url_path="manufacturer")
    def manufacturer(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "manufacturer")
        else: return self._handle_remove_partner(request, pk, "manufacturer")

    @action(detail=True, methods=["post", "delete"], url_path="warehouse")
    def warehouse(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "warehouse")
        else: return self._handle_remove_partner(request, pk, "warehouse")

    @action(detail=True, methods=["post", "delete"], url_path="transport")
    def transport(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "transport")
        else: return self._handle_remove_partner(request, pk, "transport")

    @action(detail=True, methods=["post", "delete"], url_path="packaging")
    def packaging(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "packaging")
        else: return self._handle_remove_partner(request, pk, "packaging")

    @action(detail=True, methods=["post", "delete"], url_path="quality")
    def quality(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "quality")
        else: return self._handle_remove_partner(request, pk, "quality")

    @action(detail=True, methods=["post", "delete"], url_path="certification")
    def certification(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "certification")
        else: return self._handle_remove_partner(request, pk, "certification")

    @action(detail=True, methods=["post", "delete"], url_path="consultant")
    def consultant(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "consultant")
        else: return self._handle_remove_partner(request, pk, "consultant")

    @action(detail=True, methods=["post", "delete"], url_path="machinery")
    def machinery(self, request, pk=None):
        if request.method == "POST": return self._handle_assign_partner(request, pk, "machinery")
        else: return self._handle_remove_partner(request, pk, "machinery")

    @action(detail=True, methods=["post"], url_path="approve-partner")
    def approve_partner(self, request, pk=None):
        """POST /api/v1/products/{id}/approve-partner/ — approves a recommended marketplace partner."""
        category = request.data.get("category", "suppliers")
        cat_to_role = {
            "suppliers": "supplier", "supplier": "supplier", "raw_materials": "supplier",
            "manufacturers": "manufacturer", "manufacturer": "manufacturer",
            "warehouse": "warehouse", "warehouses": "warehouse",
            "transport": "transport", "logistics": "transport",
            "packaging": "packaging",
            "quality_labs": "quality", "quality": "quality",
            "certifications": "certification", "certification": "certification",
            "consultants": "consultant", "consultant": "consultant",
            "machinery": "machinery"
        }
        role_name = cat_to_role.get(str(category).lower() if category else "suppliers", "supplier")
        return self._handle_assign_partner(request, pk, role_name)

    @action(detail=True, methods=["post"], url_path="run-ai-action")
    def run_ai_action(self, request, pk=None):
        """Run a workspace-aware AI analysis or generate a document from live workspace data."""
        product = self.get_object()
        action_type = request.data.get("action", "generate_strategy")
        workspace = ProductWorkspaceSerializer(product).data
        from apps.ai.services import SupplyOSCopilot
        copilot = SupplyOSCopilot()

        questions = {
            "generate_strategy": f"Generate a practical supply-chain and launch strategy for workspace {product.name}. Use only this workspace's selected partners, budget, timeline, risks, and marketplace context.",
            "explain_risks": f"Assess operational risks for workspace {product.name}. Use only this workspace's selected partners, lifecycle, inventory, production and quality context. Give mitigations.",
        }
        if action_type in questions:
            response = copilot.execute(
                org=request.organization,
                question=questions[action_type],
                context={"workspace": workspace, "workspace_id": str(product.id)},
                user=request.user,
                module="copilot",
            )
            insights = product.ai_insights or {}
            key = "strategy" if action_type == "generate_strategy" else "risk_explanation"
            insights[key] = response["answer"]
            product.ai_insights = insights
            product.save(update_fields=["ai_insights", "updated_at"])
            return Response({"success": True, "result": response["answer"], "ai_insights": insights, "model_version": response.get("model_version")})

        if action_type == "generate_document":
            doc_type = request.data.get("doc_type", "spec_sheet").lower().replace(" ", "_")
            generated = copilot.generate_document_service(
                request.organization, doc_type, product.name,
                context={"workspace": workspace}, user=request.user,
            )
            documents = product.documents_data or []
            document = {
                "name": f"{doc_type.replace('_', ' ').title()} - {product.name}.md",
                "type": doc_type,
                "content": generated["content"],
                "generated_by": generated["model_version"],
            }
            documents.append(document)
            product.documents_data = documents
            product.save(update_fields=["documents_data", "updated_at"])
            return Response({"success": True, "document": document, "documents_data": documents, "model_version": generated["model_version"]})

        return Response({"error": "Unsupported AI action."}, status=400)
