from rest_framework.routers import DefaultRouter

from .views import ProductionBatchViewSet, ProductionPlanViewSet, BillOfMaterialViewSet

router = DefaultRouter()
router.register("boms", BillOfMaterialViewSet, basename="production-bom")
router.register("batches", ProductionBatchViewSet, basename="production-batch")
router.register("plans", ProductionPlanViewSet, basename="production-plan")

urlpatterns = router.urls
