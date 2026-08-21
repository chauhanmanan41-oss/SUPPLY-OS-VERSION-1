from apps.organizations.models import Membership, Organization
from rest_framework_simplejwt.authentication import JWTAuthentication

class OrganizationMiddleware:
    """
    Runs after DRF/JWT authentication has set request.user. Resolves which
    Organization the current request applies to and attaches it (plus the
    user's Membership within it) to the request object, so every downstream
    permission class and viewset can rely on `request.organization` /
    `request.membership` existing.

    The frontend sends the active org via the `X-Organization-Id` header
    (set when the user picks/switches organizations in the UI). If the
    header is absent, we fall back to the user's default_organization.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.organization = None
        request.membership = None

        user = getattr(request, "user", None)
        

        if user is not None and getattr(user, "is_authenticated", False):
            org_id = request.headers.get("X-Organization-Id")
            from apps.organizations.utils import resolve_user_organization
            organization, membership = resolve_user_organization(user, org_id)

            if organization is not None and membership is not None:
                request.organization = organization
                request.membership = membership

        return self.get_response(request)
