from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import BlueprintViewSet, GenerateBlueprintView

router = DefaultRouter()
router.register("", BlueprintViewSet, basename="blueprint")

urlpatterns = [
    path("generate/", GenerateBlueprintView.as_view(), name="blueprint-generate"),
] + router.urls
