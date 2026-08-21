from django.contrib import admin
from .models import Shipment

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    pass

