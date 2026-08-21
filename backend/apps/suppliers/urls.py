from rest_framework.routers import DefaultRouter

from .views import (
    ProductSupplierViewSet, SupplierViewSet, 
    SupplierContactViewSet, SupplierDocumentViewSet
)

router = DefaultRouter()
router.register("contacts", SupplierContactViewSet, basename="supplier-contact")
router.register("documents", SupplierDocumentViewSet, basename="supplier-document")
router.register("links", ProductSupplierViewSet, basename="product-supplier")
router.register("", SupplierViewSet, basename="supplier")

urlpatterns = router.urls
