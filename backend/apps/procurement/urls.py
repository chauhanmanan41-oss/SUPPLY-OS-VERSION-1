from rest_framework.routers import DefaultRouter

from .views import PurchaseOrderViewSet, PurchaseRequestViewSet, QuotationViewSet, RFQViewSet

router = DefaultRouter()
router.register("purchase-requests", PurchaseRequestViewSet, basename="purchase-request")
router.register("rfqs", RFQViewSet, basename="rfq")
router.register("quotations", QuotationViewSet, basename="quotation")
router.register("purchase-orders", PurchaseOrderViewSet, basename="purchase-order")

urlpatterns = router.urls
