from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.text import slugify
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import HasRole, IsAuthenticatedAndActive, ORG_ADMIN

from .models import Membership, Organization
from .serializers import InviteMemberSerializer, MembershipSerializer, OrganizationSerializer

User = get_user_model()


class MyOrganizationsView(generics.ListAPIView):
    """Every organization the logged-in user belongs to (for the org switcher)."""
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticatedAndActive]

    def get_queryset(self):
        return Organization.objects.filter(
            memberships__user=self.request.user, memberships__is_active=True
        ).distinct()


class CreateOrganizationView(APIView):
    """
    Creates a brand-new organization and makes the requesting user its
    Org Admin. Used during onboarding ("create your company").
    """
    permission_classes = [IsAuthenticatedAndActive]

    def post(self, request):
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"name": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)

        base_slug = slugify(name)
        slug = base_slug
        n = 1
        while Organization.objects.filter(slug=slug).exists():
            n += 1
            slug = f"{base_slug}-{n}"

        with transaction.atomic():
            org = Organization.objects.create(name=name, slug=slug, industry=request.data.get("industry", ""))
            Membership.objects.create(user=request.user, organization=org, role="org_admin")
            if not request.user.default_organization_id:
                request.user.default_organization = org
                request.user.save(update_fields=["default_organization"])

        return Response(OrganizationSerializer(org).data, status=status.HTTP_201_CREATED)


class MembershipViewSet(viewsets.ModelViewSet):
    """
    Manage members of the CURRENT organization (request.organization, set by
    OrganizationMiddleware). Only Org Admins can invite/change roles/remove;
    everyone in the org can list members.
    """
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticatedAndActive]

    def get_queryset(self):
        org = getattr(self.request, "organization", None)
        if org is None:
            return Membership.objects.none()
        return Membership.objects.filter(organization=org).select_related("user", "organization")

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [HasRole(ORG_ADMIN)]
        return [IsAuthenticatedAndActive()]

    def create(self, request, *args, **kwargs):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        role = serializer.validated_data["role"]

        user, created = User.objects.get_or_create(
            email=email, defaults={"is_active": True}
        )
        if created:
            user.set_unusable_password()
            user.save()
            # TODO(ai-integration follow-up): send invite email with password-set link

        membership, _ = Membership.objects.update_or_create(
            user=user, organization=request.organization,
            defaults={"role": role, "is_active": True, "invited_by": request.user},
        )
        return Response(MembershipSerializer(membership).data, status=status.HTTP_201_CREATED)
