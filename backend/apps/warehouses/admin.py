from django.contrib import admin
from .models import Warehouse, WarehouseZone, WarehouseBin

class WarehouseBinInline(admin.TabularInline):
    model = WarehouseBin
    extra = 1

@admin.register(WarehouseZone)
class WarehouseZoneAdmin(admin.ModelAdmin):
    list_display = ["warehouse", "name", "code", "zone_type"]
    inlines = [WarehouseBinInline]

class WarehouseZoneInline(admin.TabularInline):
    model = WarehouseZone
    extra = 1
    show_change_link = True

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "warehouse_type", "city", "country", "status", "is_active"]
    list_filter = ["status", "is_active", "warehouse_type"]
    search_fields = ["name", "code", "city"]
    inlines = [WarehouseZoneInline]

