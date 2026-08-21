from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.organizations.models import Organization, Membership

class SupplyOSJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that safely wraps SimpleJWT.
    After the token is successfully decoded and the user is resolved,
    this checks for the `X-Organization-Id` header to determine the active
    tenant/organization. It falls back to `default_organization_id`.
    If found and the user holds an active membership, it attaches:
    - request.organization
    - request.membership
    """
    def authenticate(self, request):
        auth_result = super().authenticate(request)
        if auth_result is None:
            return None

        user, token = auth_result
        
        org_id = request.headers.get("X-Organization-Id")
        from apps.organizations.utils import resolve_user_organization
        organization, membership = resolve_user_organization(user, org_id)

        if organization is not None and membership is not None:
            request.organization = organization
            request.membership = membership

        return user, token
