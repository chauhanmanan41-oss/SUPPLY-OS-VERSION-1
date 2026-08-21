from django.conf import settings
from django.db import models

from apps.common.models import OrgOwnedModel

NOTIFICATION_TYPE = [
    ("low_stock", "Low Stock"),
    ("rfq_response", "RFQ Response"),
    ("po_approved", "Purchase Order Approved"),
    ("shipment_delayed", "Shipment Delayed"),
    ("production_completed", "Production Completed"),
    ("quality_failure", "Quality Failure"),
]


class Notification(OrgOwnedModel):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="notifications", on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE)
    message = models.CharField(max_length=500)
    link = models.CharField(max_length=255, blank=True)  # frontend route to deep-link to, e.g. "/inventory"
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
