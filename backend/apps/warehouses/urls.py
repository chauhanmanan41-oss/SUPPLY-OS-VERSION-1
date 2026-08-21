from rest_framework.routers import DefaultRouter

from .views import WarehouseViewSet, WarehouseZoneViewSet, WarehouseBinViewSet

router = DefaultRouter()
router.register("zones", WarehouseZoneViewSet, basename="warehouse-zone")
router.register("bins", WarehouseBinViewSet, basename="warehouse-bin")
router.register("", WarehouseViewSet, basename="warehouse")

urlpatterns = router.urls
