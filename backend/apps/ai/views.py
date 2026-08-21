from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsOrgMember
from .services import get_ai_service, GeminiMarketplaceAssistant, SupplyOSCopilot
from .serializers import (
    MarketplaceAIQuerySerializer,
    CopilotQuerySerializer,
    AIProductGenerateSerializer,
    AIProductValidateSerializer,
    AIProcurementPlanSerializer,
    AIDocumentGenerateSerializer,
)


class AskAIView(APIView):
    """
    POST /api/v1/ai/ask/  { "question": str, "context": {...} }
    Powers the global "Ask AI" modal.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        question = request.data.get("question", "").strip()
        context = request.data.get("context", {}) or {}
        if not question:
            return Response({"question": "This field is required."}, status=400)

        answer = get_ai_service().ask(question, context)
        return Response({"answer": answer})


class ForecastDemandView(APIView):
    permission_classes = [IsOrgMember]

    def post(self, request):
        historical_data = request.data.get("historical_data", [])
        result = get_ai_service().forecast_demand(historical_data)
        return Response(result)


class MarketplaceAssistantView(APIView):
    """
    POST /api/v1/ai/marketplace-assistant/
    Production-ready AI Marketplace Assistant v1 powered by Google Gemini and database tools.
    Strictly organization scoped.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = MarketplaceAIQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        assistant = GeminiMarketplaceAssistant()
        
        result = assistant.execute(
            org=request.organization,
            question=data["question"],
            context=data.get("context", {}),
            user=request.user
        )
        return Response(result, status=200)


class CopilotView(APIView):
    """
    POST /api/v1/ai/copilot/
    Unified enterprise AI Copilot V2 handling marketplace, products, procurement, and operations.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = CopilotQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        copilot = SupplyOSCopilot()
        result = copilot.execute(
            org=request.organization,
            question=data["question"],
            context=data.get("context", {}),
            user=request.user,
            module=data.get("module", "copilot")
        )
        return Response(result, status=200)


class ProductBuilderView(APIView):
    """
    POST /api/v1/ai/product-builder/
    Converts natural language product description into complete technical parameters and formulation specs.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = AIProductGenerateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        copilot = SupplyOSCopilot()
        result = copilot.build_product(
            org=request.organization,
            description=data["description"],
            user=request.user
        )
        return Response(result, status=200)


class ProductValidatorView(APIView):
    """
    POST /api/v1/ai/product-validator/
    Audits product specifications for missing compliance standards, testing gaps, and regulatory needs.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = AIProductValidateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        copilot = SupplyOSCopilot()
        result = copilot.validate_product(
            org=request.organization,
            product_data=data["product_data"],
            user=request.user
        )
        return Response(result, status=200)


class ProcurementPlannerView(APIView):
    """
    POST /api/v1/ai/procurement-planner/
    Builds end-to-end multi-category supply chain plans from organization master data.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = AIProcurementPlanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        copilot = SupplyOSCopilot()
        result = copilot.build_procurement_plan_service(
            org=request.organization,
            description=data["description"],
            user=request.user
        )
        return Response(result, status=200)


class DocumentGeneratorView(APIView):
    """
    POST /api/v1/ai/generate-document/
    Synthesizes professional industrial documents (BOM, TPS, QC Checklists, CoA Templates).
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        serializer = AIDocumentGenerateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        data = serializer.validated_data
        copilot = SupplyOSCopilot()
        result = copilot.generate_document_service(
            org=request.organization,
            doc_type=data["doc_type"],
            description=data.get("description", ""),
            context=data.get("context", {}),
            user=request.user
        )
        return Response(result, status=200)


# ─── AI Product Architect Views ───────────────────────────────────────────────

class AIArchitectStartView(APIView):
    """
    POST /api/v1/ai/architect/start/
    Start a new AI Product Architect interview session.
    Returns the greeting and session ID.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        from .architect import AIProductArchitect
        architect = AIProductArchitect()
        result = architect.start_session(
            organization=request.organization,
            user=request.user,
        )
        return Response(result, status=201)


class AIArchitectMessageView(APIView):
    """
    POST /api/v1/ai/architect/message/
    Send a message to an active interview session.
    Returns the AI's response with extracted data and phase info.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        from .serializers import InterviewMessageSerializer
        serializer = InterviewMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        from .architect import AIProductArchitect
        architect = AIProductArchitect()
        result = architect.send_message(
            session_id=data['session_id'],
            user_message=data['message'],
            organization=request.organization,
        )

        if 'error' in result:
            return Response({'error': result['error']}, status=result.get('status', 400))

        return Response(result, status=200)


class AIArchitectCreateWorkspaceView(APIView):
    """
    POST /api/v1/ai/architect/create-workspace/
    Create a full ERP workspace from the collected interview specifications.
    Uses the existing create_product_with_workspace service.
    """
    permission_classes = [IsOrgMember]

    def post(self, request):
        from .serializers import InterviewCreateWorkspaceSerializer
        serializer = InterviewCreateWorkspaceSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        from .architect import AIProductArchitect
        architect = AIProductArchitect()
        result = architect.create_workspace(
            session_id=data['session_id'],
            organization=request.organization,
            user=request.user,
        )

        if 'error' in result:
            return Response({'error': result['error']}, status=result.get('status', 500))

        return Response(result, status=201)


class AIArchitectSessionView(APIView):
    """
    GET /api/v1/ai/architect/session/<session_id>/
    Get the current state of an interview session.
    """
    permission_classes = [IsOrgMember]

    def get(self, request, session_id):
        from .architect import AIProductArchitect
        architect = AIProductArchitect()
        result = architect.get_session(
            session_id=session_id,
            organization=request.organization,
        )

        if 'error' in result:
            return Response({'error': result['error']}, status=result.get('status', 404))

        return Response(result, status=200)
