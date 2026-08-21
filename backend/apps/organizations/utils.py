from apps.organizations.models import Organization, Membership

def resolve_user_organization(user, org_id_header=None):
    """
    Robustly resolves the active Organization and Membership for an authenticated user.
    Guarantees against silent failures caused by stale localStorage headers or out-of-sync
    default_organization_id assignments.
    """
    if not user or not getattr(user, "is_authenticated", False):
        return None, None

    organization = None
    membership = None

    # 1. Try resolving via X-Organization-Id header if provided
    if org_id_header:
        organization = Organization.objects.filter(id=org_id_header, is_active=True).first()
        if organization:
            membership = Membership.objects.filter(
                user=user, organization=organization, is_active=True
            ).select_related("organization").first()
            if not membership:
                # Header contained an org ID the user is not a member of (e.g. stale localStorage)
                organization = None

    # 2. Try resolving via user.default_organization
    if organization is None and getattr(user, "default_organization_id", None):
        organization = user.default_organization
        if organization and organization.is_active:
            membership = Membership.objects.filter(
                user=user, organization=organization, is_active=True
            ).select_related("organization").first()
            if not membership:
                organization = None

    # 3. Fallback: Automatically assign to user's first valid active membership
    if organization is None or membership is None:
        membership = Membership.objects.filter(
            user=user, is_active=True
        ).select_related("organization").first()
        if membership:
            organization = membership.organization
            # Self-heal user default_organization if out of sync
            if getattr(user, "default_organization_id", None) != organization.id:
                user.default_organization = organization
                user.save(update_fields=["default_organization"])

    return organization, membership
