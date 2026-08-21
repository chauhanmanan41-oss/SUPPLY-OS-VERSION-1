import uuid

from django.conf import settings
from django.db import models

ROLE_CHOICES = [
    ("super_admin", "Super Admin"),
    ("org_admin", "Organization Admin"),
    ("product_manager", "Product Manager"),
    ("procurement_manager", "Procurement Manager"),
    ("inventory_manager", "Inventory Manager"),
    ("production_manager", "Production Manager"),
    ("warehouse_manager", "Warehouse Manager"),
    ("sales_manager", "Sales Manager"),
    ("logistics_manager", "Logistics Manager"),
    ("quality_manager", "Quality Manager"),
    ("employee", "Employee"),
    ("viewer", "Viewer"),
]


class Organization(models.Model):
    """
    A tenant. Every business record in the system ultimately belongs to one
    Organization, and no query should ever cross organization boundaries
    (enforced by apps.common.viewsets.OrgScopedModelViewSet +
    apps.common.permissions.IsOrgMember).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    industry = models.CharField(max_length=120, blank=True)
    logo_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    plan = models.CharField(max_length=50, default="trial")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through="Membership", related_name="organizations", through_fields=("organization", "user")
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Membership(models.Model):
    """The join table between User and Organization, carrying the user's role."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="memberships", on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, related_name="memberships", on_delete=models.CASCADE)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default="employee")
    is_active = models.BooleanField(default=True)
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        related_name="memberships_invited", on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "organization")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user_id} @ {self.organization_id} ({self.role})"
