from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets

from apps.common.permissions import IsAuthenticatedAndActive
from apps.common.pagination import StandardResultsPagination

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Notifications are per-USER, not just per-org (a notification is addressed
    to one recipient), so this doesn't use OrgScopedModelViewSet — it filters
    by request.user directly, still scoped to the active organization.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticatedAndActive]
    pagination_class = StandardResultsPagination
    filterset_fields = ["notification_type", "is_read"]

    def get_queryset(self):
        org = getattr(self.request, "organization", None)
        qs = Notification.objects.filter(recipient=self.request.user)
        return qs.filter(organization=org) if org else qs.none()

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"detail": "All notifications marked as read."})
