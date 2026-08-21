from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.viewsets import OrgScopedModelViewSet

from .models import Manufacturer, ProductManufacturer, ManufacturerContact, ManufacturerDocument
from .serializers import (
    ManufacturerSerializer, ProductManufacturerSerializer,
    ManufacturerContactSerializer, ManufacturerDocumentSerializer
)


class ManufacturerViewSet(OrgScopedModelViewSet):
    queryset = Manufacturer.objects.prefetch_related("contacts", "documents").all()
    serializer_class = ManufacturerSerializer
    filterset_fields = ["country", "industry", "status", "price_tier"]
    search_fields = ["name", "country", "city", "industry"]
    ordering_fields = ["rating", "quality_score", "lead_time_days", "created_at"]

    @action(detail=True, methods=["post"], url_path="link-product")
    def link_product(self, request, pk=None):
        """POST { "product": "<uuid>" } — attaches this manufacturer to a product's comparison list."""
        manufacturer = self.get_object()
        link, _ = ProductManufacturer.objects.update_or_create(
            product_id=request.data.get("product"),
            manufacturer=manufacturer,
            defaults={"organization": request.organization, "created_by": request.user},
        )
        return Response(ProductManufacturerSerializer(link).data, status=201)


class ManufacturerContactViewSet(OrgScopedModelViewSet):
    queryset = ManufacturerContact.objects.all()
    serializer_class = ManufacturerContactSerializer
    filterset_fields = ["manufacturer", "is_primary"]
    search_fields = ["name", "email", "phone"]


class ManufacturerDocumentViewSet(OrgScopedModelViewSet):
    queryset = ManufacturerDocument.objects.all()
    serializer_class = ManufacturerDocumentSerializer
    filterset_fields = ["manufacturer", "document_type"]
    search_fields = ["title"]


class ProductManufacturerViewSet(OrgScopedModelViewSet):
    queryset = ProductManufacturer.objects.select_related("manufacturer", "product").all()
    serializer_class = ProductManufacturerSerializer
    filterset_fields = ["product", "manufacturer", "is_selected"]
