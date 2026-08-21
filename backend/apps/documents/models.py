import uuid

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.common.models import OrgOwnedModel

DOCUMENT_CATEGORY = [
    ("invoice", "Invoice"), ("contract", "Contract"), ("certificate", "Certificate"),
    ("blueprint", "Blueprint PDF"), ("image", "Image"), ("purchase_order", "Purchase Order"),
    ("shipping", "Shipping Document"), ("quality_report", "Quality Report"), ("other", "Other"),
]


def document_upload_path(instance, filename):
    return f"documents/{instance.organization_id}/{instance.category}/{uuid.uuid4().hex}_{filename}"


class Document(OrgOwnedModel):
    """
    Attaches to ANY other model via Django's generic-relations (Product,
    PurchaseOrder, ProductionBatch, Shipment, etc.) — "Documents remain
    attached to the Product Workspace" from the brief, but genericized so any
    module can attach files without a dedicated FK per relation.
    """
    file = models.FileField(upload_to=document_upload_path)
    original_filename = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=DOCUMENT_CATEGORY, default="other")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    linked_object = GenericForeignKey("content_type", "object_id")
    size_bytes = models.PositiveIntegerField(default=0)
    mime_type = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["content_type", "object_id"])]
