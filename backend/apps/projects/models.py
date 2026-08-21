from django.conf import settings
from django.db import models

from apps.common.models import OrgOwnedModel

PRIORITY_CHOICES = [("low", "Low"), ("medium", "Medium"), ("high", "High")]


class Project(OrgOwnedModel):
    """
    A Project represents one product idea (e.g. "Protein Powder"). In the
    current frontend, Projects and Products are shown together on one page —
    a Project is created and immediately gets its Product record (see
    apps.products.models.Product, which has a OneToOne back to Project)
    once the creation wizard finishes.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=120, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        related_name="owned_projects", on_delete=models.SET_NULL,
    )
    target_launch_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
