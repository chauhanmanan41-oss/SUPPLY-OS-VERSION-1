from rest_framework.decorators import action
from rest_framework.response import Response

from apps.ai.services import get_ai_service
from apps.common.viewsets import OrgScopedModelViewSet
from apps.suppliers.models import Supplier

from .models import PurchaseOrder, PurchaseRequest, Quotation, RFQ
from .serializers import (
    CreatePOFromQuotationSerializer,
    PurchaseOrderSerializer,
    PurchaseRequestSerializer,
    QuotationSerializer,
    RFQSerializer,
)
from .services import create_po_from_quotation, mark_po_received


class PurchaseRequestViewSet(OrgScopedModelViewSet):
    queryset = PurchaseRequest.objects.select_related("requested_by").prefetch_related("lines__material", "lines__product").all()
    serializer_class = PurchaseRequestSerializer
    filterset_fields = ["pr_status"]


class RFQViewSet(OrgScopedModelViewSet):
    queryset = RFQ.objects.select_related("purchase_request").prefetch_related(
        "suppliers", "quotations__lines", "lines__material"
    ).all()
    serializer_class = RFQSerializer
    filterset_fields = ["rfq_status"]

    @action(detail=True, methods=["post"], url_path="send")
    def send(self, request, pk=None):
        """Marks the RFQ as sent to its selected suppliers."""
        rfq = self.get_object()
        rfq.rfq_status = "sent"
        rfq.save(update_fields=["rfq_status"])
        return Response(RFQSerializer(rfq).data)

    @action(detail=True, methods=["get"], url_path="compare")
    def compare(self, request, pk=None):
        """
        GET .../compare/ — runs the AI comparison across all quotations
        received for this RFQ and flags the recommended one.
        """
        rfq = self.get_object()
        quotations = list(rfq.quotations.select_related("supplier").prefetch_related("lines").all())
        if not quotations:
            return Response({"quotations": [], "recommendation": None})

        # Reset previous recommendation flags
        Quotation.objects.filter(rfq=rfq).update(ai_recommended=False, ai_recommendation_reason="")

        # Simple scoring: lowest total price + fastest delivery win
        best = min(quotations, key=lambda q: (float(q.total_amount), q.delivery_days or 999))
        best.ai_recommended = True
        best.ai_recommendation_reason = (
            f"Best combination of total price (${best.total_amount}) and delivery time ({best.delivery_days} days) "
            f"among {len(quotations)} quotes received."
        )
        best.save(update_fields=["ai_recommended", "ai_recommendation_reason"])

        return Response({
            "quotations": QuotationSerializer(quotations, many=True).data,
            "recommendation": QuotationSerializer(best).data,
        })


class QuotationViewSet(OrgScopedModelViewSet):
    queryset = Quotation.objects.select_related("rfq", "supplier").prefetch_related("lines__material").all()
    serializer_class = QuotationSerializer
    filterset_fields = ["rfq", "supplier", "quote_status"]

    @action(detail=True, methods=["post"], url_path="accept")
    def accept(self, request, pk=None):
        quotation = self.get_object()
        Quotation.objects.filter(rfq=quotation.rfq).exclude(pk=quotation.pk).update(quote_status="rejected")
        quotation.quote_status = "accepted"
        quotation.save(update_fields=["quote_status"])
        quotation.rfq.rfq_status = "closed"
        quotation.rfq.save(update_fields=["rfq_status"])
        return Response(QuotationSerializer(quotation).data)


class PurchaseOrderViewSet(OrgScopedModelViewSet):
    queryset = PurchaseOrder.objects.select_related("supplier", "quotation").prefetch_related("lines__material").all()
    serializer_class = PurchaseOrderSerializer
    filterset_fields = ["supplier", "po_status"]

    def get_serializer_class(self):
        if self.action == "create_from_quotation":
            return CreatePOFromQuotationSerializer
        return super().get_serializer_class()

    @action(detail=False, methods=["post"], url_path="create-from-quotation")
    def create_from_quotation(self, request):
        """POST an accepted quotation's id -> creates the PurchaseOrder."""
        serializer = CreatePOFromQuotationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            po = create_po_from_quotation(
                organization=request.organization,
                user=request.user,
                quotation_id=data["quotation"],
                expected_delivery=data.get("expected_delivery"),
            )
            return Response(PurchaseOrderSerializer(po).data, status=201)
        except ValueError as e:
            return Response({"quotation": str(e)}, status=404)

    @action(detail=True, methods=["post"], url_path="mark-received")
    def mark_received(self, request, pk=None):
        po = self.get_object()
        po = mark_po_received(po)
        return Response(PurchaseOrderSerializer(po).data)
