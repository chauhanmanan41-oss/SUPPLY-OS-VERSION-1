from apps.common.viewsets import OrgScopedModelViewSet

from .models import ProductSupplier, Supplier, SupplierContact, SupplierDocument
from .serializers import (
    ProductSupplierSerializer, SupplierSerializer, 
    SupplierContactSerializer, SupplierDocumentSerializer
)


class SupplierViewSet(OrgScopedModelViewSet):
    queryset = Supplier.objects.prefetch_related("contacts", "documents").all()
    serializer_class = SupplierSerializer
    filterset_fields = ["country", "status", "preferred_supplier"]
    search_fields = ["name", "country", "city"]
    ordering_fields = ["rating", "quality_score", "lead_time_days", "performance_score", "created_at"]


class SupplierContactViewSet(OrgScopedModelViewSet):
    queryset = SupplierContact.objects.all()
    serializer_class = SupplierContactSerializer
    filterset_fields = ["supplier", "is_primary"]
    search_fields = ["name", "email", "phone"]


class SupplierDocumentViewSet(OrgScopedModelViewSet):
    queryset = SupplierDocument.objects.all()
    serializer_class = SupplierDocumentSerializer
    filterset_fields = ["supplier", "document_type"]
    search_fields = ["title"]


class ProductSupplierViewSet(OrgScopedModelViewSet):
    queryset = ProductSupplier.objects.select_related("supplier", "product", "material").all()
    serializer_class = ProductSupplierSerializer
    filterset_fields = ["product", "supplier", "is_selected"]
