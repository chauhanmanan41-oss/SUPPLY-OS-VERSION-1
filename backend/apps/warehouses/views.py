from apps.common.viewsets import OrgScopedModelViewSet

from .models import Warehouse, WarehouseZone, WarehouseBin
from .serializers import WarehouseSerializer, WarehouseZoneSerializer, WarehouseBinSerializer


class WarehouseViewSet(OrgScopedModelViewSet):
    queryset = Warehouse.objects.prefetch_related("zones__bins").all()
    serializer_class = WarehouseSerializer
    filterset_fields = ["city", "country", "status", "warehouse_type"]
    search_fields = ["name", "code", "city"]


class WarehouseZoneViewSet(OrgScopedModelViewSet):
    queryset = WarehouseZone.objects.prefetch_related("bins").all()
    serializer_class = WarehouseZoneSerializer
    filterset_fields = ["warehouse", "zone_type"]
    search_fields = ["name", "code"]


class WarehouseBinViewSet(OrgScopedModelViewSet):
    queryset = WarehouseBin.objects.all()
    serializer_class = WarehouseBinSerializer
    filterset_fields = ["zone"]
    search_fields = ["code"]
