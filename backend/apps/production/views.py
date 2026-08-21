from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.viewsets import OrgScopedModelViewSet

from .models import ProductionBatch, ProductionPlan, BillOfMaterial, BillOfMaterialLine
from .serializers import (
    ProductionBatchSerializer,
    ProductionPlanSerializer,
    BillOfMaterialSerializer,
    BillOfMaterialLineSerializer,
)
from .services import start_production_batch, complete_production_batch


class BillOfMaterialViewSet(OrgScopedModelViewSet):
    queryset = BillOfMaterial.objects.select_related("product").prefetch_related("lines__material").all()
    serializer_class = BillOfMaterialSerializer
    filterset_fields = ["product", "is_active"]



class ProductionPlanViewSet(OrgScopedModelViewSet):
    queryset = ProductionPlan.objects.select_related("product").prefetch_related("batches").all()
    serializer_class = ProductionPlanSerializer
    filterset_fields = ["product", "plan_status"]


class ProductionBatchViewSet(OrgScopedModelViewSet):
    queryset = ProductionBatch.objects.select_related("production_plan", "warehouse").all()
    serializer_class = ProductionBatchSerializer
    filterset_fields = ["production_plan", "batch_status", "warehouse"]

    @action(detail=True, methods=["post"], url_path="start")
    def start(self, request, pk=None):
        batch = self.get_object()
        try:
            batch = start_production_batch(batch)
            return Response(ProductionBatchSerializer(batch).data)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)

    @action(detail=True, methods=["post"], url_path="complete")
    def complete(self, request, pk=None):
        batch = self.get_object()
        try:
            batch = complete_production_batch(batch)
            return Response(ProductionBatchSerializer(batch).data)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
