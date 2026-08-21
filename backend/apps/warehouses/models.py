from django.db import models
from django.conf import settings

from apps.common.models import OrgOwnedModel


class Warehouse(OrgOwnedModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, blank=True)
    warehouse_type = models.CharField(max_length=50, blank=True, choices=[
        ("internal", "Internal"), ("3pl", "3PL"), ("distributor", "Distributor"), ("retail", "Retail")
    ])
    description = models.TextField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=120, blank=True)
    capacity_units = models.PositiveIntegerField(null=True, blank=True)
    manager_name = models.CharField(max_length=255, blank=True)
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="managed_warehouses")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class WarehouseZone(OrgOwnedModel):
    warehouse = models.ForeignKey(Warehouse, related_name="zones", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=50, blank=True)
    zone_type = models.CharField(max_length=50, blank=True)  # e.g., Cold Storage, Receiving, Finished Goods

    class Meta:
        ordering = ["name"]
        unique_together = ("warehouse", "code")

    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"


class WarehouseBin(OrgOwnedModel):
    zone = models.ForeignKey(WarehouseZone, related_name="bins", on_delete=models.CASCADE)
    code = models.CharField(max_length=50)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    current_usage = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["code"]
        unique_together = ("zone", "code")

    def __str__(self):
        return f"{self.zone.code} - {self.code}"
