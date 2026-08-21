from django.contrib import admin
from .models import InventoryItem, InventoryMovement

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    pass

@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
    pass

