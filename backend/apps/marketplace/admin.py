from django.contrib import admin
from .models import MarketplaceCategory, MarketplaceSearchLog

@admin.register(MarketplaceCategory)
class MarketplaceCategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(MarketplaceSearchLog)
class MarketplaceSearchLogAdmin(admin.ModelAdmin):
    pass

