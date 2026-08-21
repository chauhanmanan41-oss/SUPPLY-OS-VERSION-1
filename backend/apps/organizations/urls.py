from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import CreateOrganizationView, MembershipViewSet, MyOrganizationsView

router = DefaultRouter()
router.register("members", MembershipViewSet, basename="membership")

urlpatterns = [
    path("mine/", MyOrganizationsView.as_view(), name="my-organizations"),
    path("create/", CreateOrganizationView.as_view(), name="create-organization"),
] + router.urls
