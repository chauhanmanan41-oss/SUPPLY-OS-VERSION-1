from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    MarketplaceCategoryViewSet,
    MarketplacePartnerViewSet,
    MarketplaceSearchView,
    AIAdvisorView,
    TrendingSearchesView,
)

router = DefaultRouter()
router.register("categories", MarketplaceCategoryViewSet, basename="marketplace-category")
router.register("partners", MarketplacePartnerViewSet, basename="marketplace-partner")

urlpatterns = [
    path("search/", MarketplaceSearchView.as_view(), name="marketplace-search"),
    path("ai-advisor/", AIAdvisorView.as_view(), name="marketplace-ai-advisor"),
    path("trending-searches/", TrendingSearchesView.as_view(), name="marketplace-trending"),
] + router.urls
