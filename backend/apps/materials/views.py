from apps.common.viewsets import OrgScopedModelViewSet

from .models import Material
from .serializers import MaterialSerializer


class MaterialViewSet(OrgScopedModelViewSet):
    queryset = Material.objects.select_related("default_supplier").all()
    serializer_class = MaterialSerializer
    filterset_fields = ["category", "status"]
    search_fields = ["name", "category"]
