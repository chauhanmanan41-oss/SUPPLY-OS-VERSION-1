from django.contrib import admin
from .models import Manufacturer, ProductManufacturer, ManufacturerContact, ManufacturerDocument

class ManufacturerContactInline(admin.TabularInline):
    model = ManufacturerContact
    extra = 1

class ManufacturerDocumentInline(admin.TabularInline):
    model = ManufacturerDocument
    extra = 1

@admin.register(Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "country", "rating", "status"]
    list_filter = ["status", "country", "price_tier"]
    search_fields = ["name", "city", "country"]
    inlines = [ManufacturerContactInline, ManufacturerDocumentInline]

@admin.register(ProductManufacturer)
class ProductManufacturerAdmin(admin.ModelAdmin):
    list_display = ["product", "manufacturer", "is_selected"]
    list_filter = ["is_selected"]
