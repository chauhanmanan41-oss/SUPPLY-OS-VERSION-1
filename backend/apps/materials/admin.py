from django.contrib import admin
from .models import Material

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "category", "unit", "safety_stock", "status"]
    list_filter = ["status", "category", "unit"]
    search_fields = ["name", "sku", "description"]

