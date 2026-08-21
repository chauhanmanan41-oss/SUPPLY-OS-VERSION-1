import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager


class User(AbstractUser):
    """
    Email-based user. `username` from AbstractUser is kept (nullable, unused)
    only because some third-party packages assume it exists — auth is always
    via email in SupplyOS.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    avatar_url = models.URLField(blank=True)

    # A user's "active" organization for the current session — the frontend
    # sends this via the X-Organization-Id header on every request (see
    # apps.organizations.middleware.OrganizationMiddleware); this field is
    # just a convenience default (e.g. right after login).
    default_organization = models.ForeignKey(
        "organizations.Organization",
        null=True, blank=True,
        related_name="default_for_users",
        on_delete=models.SET_NULL,
    )

    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email
