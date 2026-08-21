from rest_framework import mixins, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.services import get_ai_service
from apps.common.permissions import IsOrgMember
from apps.products.models import Product

from .models import Blueprint
from .serializers import BlueprintSerializer, GenerateBlueprintRequestSerializer


class BlueprintViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Read-only — blueprints are created exclusively via GenerateBlueprintView (AI-generated)."""
    queryset = Blueprint.objects.select_related("product").all()
    serializer_class = BlueprintSerializer
    permission_classes = [IsOrgMember]
    filterset_fields = ["product", "is_current", "generation_status"]

    def get_queryset(self):
        org = getattr(self.request, "organization", None)
        if org is None:
            return Blueprint.objects.none()
        return self.queryset.filter(organization=org)


class GenerateBlueprintView(APIView):
    """
    POST /api/v1/blueprints/generate/
    This is the "no manual Generate button, AI runs automatically after
    Step 3" endpoint the wizard calls. Synchronous for now (the rule-based
    provider is instant); swap to a Celery task + polling/websocket once a
    real LLM provider with meaningful latency is wired in — the AIService
    interface doesn't need to change either way.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = GenerateBlueprintRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        product = Product.objects.filter(
            id=data["product"], organization=request.organization
        ).first()
        if product is None:
            return Response({"product": "Not found in your organization."}, status=404)

        # Mark any previous blueprint for this product as no longer current
        Blueprint.objects.filter(product=product, is_current=True).update(is_current=False)

        # Convert UUID to string so wizard_inputs JSONField can serialize it
        json_safe_inputs = {k: str(v) if hasattr(v, 'hex') else v for k, v in data.items()}

        blueprint = Blueprint.objects.create(
            organization=request.organization,
            created_by=request.user,
            product=product,
            is_current=True,
            generation_status="generating",
            wizard_inputs=json_safe_inputs,
        )

        ai_result = get_ai_service().generate_blueprint(data)

        blueprint.manufacturing_process = ai_result["manufacturing_process"]
        blueprint.raw_materials = ai_result["raw_materials"]
        blueprint.machinery_required = ai_result["machinery_required"]
        blueprint.packaging_notes = ai_result["packaging_notes"]
        blueprint.estimated_cost = ai_result["estimated_cost"]
        blueprint.certifications_needed = ai_result["certifications_needed"]
        blueprint.complexity = ai_result["complexity"]
        blueprint.production_timeline_days = ai_result["production_timeline_days"]
        blueprint.suggested_manufacturer_tags = ai_result.get("suggested_manufacturer_tags", [])
        blueprint.suggested_supplier_tags = ai_result.get("suggested_supplier_tags", [])
        blueprint.ai_raw_response = ai_result.get("raw")
        blueprint.ai_provider = ai_result.get("raw", {}).get("provider", "")
        blueprint.generation_status = "completed"
        blueprint.save()

        return Response(BlueprintSerializer(blueprint).data, status=201)
