from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.viewsets import OrgScopedModelViewSet

from .models import SalesOrder
from .serializers import SalesOrderSerializer
from .services import update_order_status


class SalesOrderViewSet(OrgScopedModelViewSet):
    queryset = SalesOrder.objects.prefetch_related("lines__product").select_related("warehouse").all()
    serializer_class = SalesOrderSerializer
    filterset_fields = ["order_status", "warehouse"]
    search_fields = ["order_number", "customer_name", "customer_email"]

    @action(detail=True, methods=["post"], url_path="update-status")
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if not new_status:
            return Response({"status": "This field is required."}, status=400)
            
        try:
            order = update_order_status(order, new_status)
            return Response(SalesOrderSerializer(order).data)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
