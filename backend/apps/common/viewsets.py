from rest_framework import viewsets
from apps.common.pagination import StandardResultsPagination
from apps.common.permissions import IsOrgMember


class OrgScopedModelViewSet(viewsets.ModelViewSet):
    """
    Base viewset for every business-entity endpoint in SupplyOS.

    - Automatically filters querysets to request.organization (multi-tenancy).
    - Automatically stamps created_by / updated_by / organization on save.
    - Applies standard pagination.
    - Requires IsOrgMember by default; subclasses add HasRole(...) as needed.

    Subclasses just set `queryset` and `serializer_class` as normal — do NOT
    override get_queryset()/perform_create() without calling super(), or
    tenant isolation breaks.
    """
    permission_classes = [IsOrgMember]
    pagination_class = StandardResultsPagination
    filterset_fields = []
    search_fields = []
    ordering_fields = "__all__"

    def get_queryset(self):
        qs = super().get_queryset()
        org = getattr(self.request, "organization", None)
        if org is None:
            return qs.none()
        return qs.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save(
            organization=self.request.organization,
            created_by=self.request.user,
            updated_by=self.request.user,
        )

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
