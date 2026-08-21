import uuid

from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    """Adds created_at / updated_at to any model that inherits it."""
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditModel(TimeStampedModel):
    """
    Adds created_by / updated_by on top of the timestamps.
    Every business entity in SupplyOS should inherit this (directly or via
    OrgOwnedModel below) so we always know who touched a record and when.
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        related_name="%(app_label)s_%(class)s_created",
        on_delete=models.SET_NULL,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        related_name="%(app_label)s_%(class)s_updated",
        on_delete=models.SET_NULL,
    )

    class Meta:
        abstract = True


class SoftDeleteQuerySet(models.QuerySet):
    def alive(self):
        return self.filter(is_deleted=False)

    def dead(self):
        return self.filter(is_deleted=True)


class SoftDeleteManager(models.Manager):
    """Default manager hides soft-deleted rows. Use `all_objects` to see everything."""
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at"])


STATUS_ACTIVE = "active"
STATUS_INACTIVE = "inactive"
STATUS_ARCHIVED = "archived"
STATUS_CHOICES = [
    (STATUS_ACTIVE, "Active"),
    (STATUS_INACTIVE, "Inactive"),
    (STATUS_ARCHIVED, "Archived"),
]


class OrgOwnedModel(AuditModel, SoftDeleteModel):
    """
    The base class for almost every business entity in SupplyOS.

    `organization` is what makes multi-tenancy possible: every queryset that
    touches an OrgOwnedModel subclass MUST be filtered by the requesting
    user's organization (see common.permissions.IsOrgMember and
    common.viewsets.OrgScopedModelViewSet, which do this automatically).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        "organizations.Organization",
        related_name="%(app_label)s_%(class)s_set",
        on_delete=models.CASCADE,
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)

    class Meta:
        abstract = True
