from apps.common.viewsets import OrgScopedModelViewSet

from .models import Shipment
from .serializers import ShipmentSerializer


class ShipmentViewSet(OrgScopedModelViewSet):
    queryset = Shipment.objects.select_related("purchase_order", "sales_order").all()
    serializer_class = ShipmentSerializer
    filterset_fields = ["shipment_type", "shipment_status"]
    search_fields = ["tracking_number", "courier"]
