from rest_framework.routers import DefaultRouter

from .views import QualityInspectionViewSet

router = DefaultRouter()
router.register("", QualityInspectionViewSet, basename="quality-inspection")

urlpatterns = router.urls
