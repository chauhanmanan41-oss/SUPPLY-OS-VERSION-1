from apps.common.viewsets import OrgScopedModelViewSet

from .models import QualityInspection
from .serializers import QualityInspectionSerializer


class QualityInspectionViewSet(OrgScopedModelViewSet):
    queryset = QualityInspection.objects.select_related("production_batch", "inspected_by").all()
    serializer_class = QualityInspectionSerializer
    filterset_fields = ["production_batch", "result"]
