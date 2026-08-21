from rest_framework.parsers import FormParser, MultiPartParser

from apps.common.viewsets import OrgScopedModelViewSet

from .models import Document
from .serializers import DocumentSerializer


class DocumentViewSet(OrgScopedModelViewSet):
    queryset = Document.objects.select_related("content_type").all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ["category", "content_type", "object_id"]
