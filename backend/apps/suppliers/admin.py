from django.contrib import admin
from .models import Supplier, ProductSupplier, SupplierContact, SupplierDocument

class SupplierContactInline(admin.TabularInline):
    model = SupplierContact
    extra = 1

class SupplierDocumentInline(admin.TabularInline):
    model = SupplierDocument
    extra = 1

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "country", "rating", "status"]
    list_filter = ["status", "country", "preferred_supplier"]
    search_fields = ["name", "city", "country"]
    inlines = [SupplierContactInline, SupplierDocumentInline]

@admin.register(ProductSupplier)
class ProductSupplierAdmin(admin.ModelAdmin):
    list_display = ["product", "supplier", "material", "is_selected"]
    list_filter = ["is_selected"]
