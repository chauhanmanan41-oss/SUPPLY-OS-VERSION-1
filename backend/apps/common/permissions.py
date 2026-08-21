from rest_framework.permissions import BasePermission, SAFE_METHODS


def _ensure_org_attached(request):
    if getattr(request, "organization", None) is None or getattr(request, "membership", None) is None:
        user = getattr(request, "user", None)
        if user and getattr(user, "is_authenticated", False):
            org_id = request.headers.get("X-Organization-Id") or request.META.get("HTTP_X_ORGANIZATION_ID")
            from apps.organizations.utils import resolve_user_organization
            org, membership = resolve_user_organization(user, org_id)
            if org and membership:
                request.organization = org
                request.membership = membership


class IsAuthenticatedAndActive(BasePermission):
    """Base check: user must be logged in and their account not disabled."""
    def has_permission(self, request, view):
        is_valid_user = bool(request.user and request.user.is_authenticated and request.user.is_active)
        if is_valid_user:
            _ensure_org_attached(request)
        return is_valid_user


class IsOrgMember(IsAuthenticatedAndActive):
    """
    Object-level check: the requesting user's active organization must match
    the object's organization. This is the core of multi-tenant isolation —
    every OrgOwnedModel viewset should include this permission class.
    """
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        return getattr(request, "organization", None) is not None

    def has_object_permission(self, request, view, obj):
        org = getattr(request, "organization", None)
        obj_org = getattr(obj, "organization", None)
        return org is not None and obj_org is not None and org.id == obj_org.id


class HasRole(IsAuthenticatedAndActive):
    """
    Factory-style permission: HasRole("org_admin", "product_manager") returns
    a permission class instance that only allows those roles through.
    Super Admin always passes (global override).
    """
    allowed_roles = ()

    def __init__(self, *roles):
        self.allowed_roles = roles

    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        membership = getattr(request, "membership", None)
        if membership is None:
            return False
        if membership.role == "super_admin":
            return True
        return membership.role in self.allowed_roles

    # Allow use both as a class (DRF instantiates permission classes with no
    # args) and as a pre-configured instance, e.g. permission_classes=[HasRole("org_admin")]
    def __call__(self):
        return self


class ReadOnlyOrHasRole(HasRole):
    """Anyone in the org can read (GET/HEAD/OPTIONS); only listed roles can write."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return IsOrgMember().has_permission(request, view)
        return super().has_permission(request, view)


# Role constants — mirrors apps.users.models.Role choices, duplicated here as
# plain strings so permission classes don't need to import the model.
SUPER_ADMIN = "super_admin"
ORG_ADMIN = "org_admin"
PRODUCT_MANAGER = "product_manager"
PROCUREMENT_MANAGER = "procurement_manager"
INVENTORY_MANAGER = "inventory_manager"
PRODUCTION_MANAGER = "production_manager"
WAREHOUSE_MANAGER = "warehouse_manager"
SALES_MANAGER = "sales_manager"
LOGISTICS_MANAGER = "logistics_manager"
QUALITY_MANAGER = "quality_manager"
EMPLOYEE = "employee"
VIEWER = "viewer"
