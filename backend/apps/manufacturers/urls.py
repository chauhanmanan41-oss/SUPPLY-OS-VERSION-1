from rest_framework.routers import DefaultRouter

from .views import (
    ManufacturerViewSet, ProductManufacturerViewSet,
    ManufacturerContactViewSet, ManufacturerDocumentViewSet
)

router = DefaultRouter()
router.register("contacts", ManufacturerContactViewSet, basename="manufacturer-contact")
router.register("documents", ManufacturerDocumentViewSet, basename="manufacturer-document")
router.register("links", ProductManufacturerViewSet, basename="product-manufacturer")
router.register("", ManufacturerViewSet, basename="manufacturer")

urlpatterns = router.urls
