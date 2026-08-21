from django.urls import path
from .views import (
    AskAIView,
    ForecastDemandView,
    MarketplaceAssistantView,
    CopilotView,
    ProductBuilderView,
    ProductValidatorView,
    ProcurementPlannerView,
    DocumentGeneratorView,
    AIArchitectStartView,
    AIArchitectMessageView,
    AIArchitectCreateWorkspaceView,
    AIArchitectSessionView,
)

urlpatterns = [
    path("ask/", AskAIView.as_view(), name="ai-ask"),
    path("forecast-demand/", ForecastDemandView.as_view(), name="ai-forecast-demand"),
    path("marketplace-assistant/", MarketplaceAssistantView.as_view(), name="ai-marketplace-assistant"),
    path("copilot/", CopilotView.as_view(), name="ai-copilot"),
    path("product-builder/", ProductBuilderView.as_view(), name="ai-product-builder"),
    path("product-validator/", ProductValidatorView.as_view(), name="ai-product-validator"),
    path("procurement-planner/", ProcurementPlannerView.as_view(), name="ai-procurement-planner"),
    path("generate-document/", DocumentGeneratorView.as_view(), name="ai-generate-document"),
    # AI Product Architect — conversational interview flow
    path("architect/start/", AIArchitectStartView.as_view(), name="ai-architect-start"),
    path("architect/message/", AIArchitectMessageView.as_view(), name="ai-architect-message"),
    path("architect/create-workspace/", AIArchitectCreateWorkspaceView.as_view(), name="ai-architect-create-workspace"),
    path("architect/session/<uuid:session_id>/", AIArchitectSessionView.as_view(), name="ai-architect-session"),
]

