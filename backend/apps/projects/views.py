from apps.common.viewsets import OrgScopedModelViewSet

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(OrgScopedModelViewSet):
    queryset = Project.objects.select_related("owner", "product").all()
    serializer_class = ProjectSerializer
    filterset_fields = ["status", "priority", "category"]
    search_fields = ["name", "description", "category"]
    ordering_fields = ["created_at", "name", "priority", "target_launch_date"]
