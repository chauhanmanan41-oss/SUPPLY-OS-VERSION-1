from rest_framework.routers import DefaultRouter

from .views import SalesOrderViewSet

router = DefaultRouter()
router.register("", SalesOrderViewSet, basename="sales-order")

urlpatterns = router.urls
