from .models import Notification


def notify(*, organization, recipient, notification_type, message, link=""):
    """
    Every module that needs to raise a notification (low stock in inventory,
    RFQ response in procurement, shipment delay in logistics, quality failure
    in quality, production completed in production) should call this rather
    than creating Notification objects directly, so the shape/behavior stays
    consistent (and so this is the one place to later add push/email/websocket
    delivery without touching every calling app).
    """
    return Notification.objects.create(
        organization=organization,
        recipient=recipient,
        notification_type=notification_type,
        message=message,
        link=link,
    )


def notify_all_org_members(*, organization, notification_type, message, link="", roles=None):
    """Broadcasts to every active member of the org (optionally filtered to specific roles)."""
    from apps.organizations.models import Membership

    memberships = Membership.objects.filter(organization=organization, is_active=True).select_related("user")
    if roles:
        memberships = memberships.filter(role__in=roles)

    return [
        notify(organization=organization, recipient=m.user, notification_type=notification_type,
               message=message, link=link)
        for m in memberships
    ]
