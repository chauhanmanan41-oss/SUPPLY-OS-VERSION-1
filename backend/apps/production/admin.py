from django.contrib import admin
from .models import ProductionPlan, ProductionBatch

@admin.register(ProductionPlan)
class ProductionPlanAdmin(admin.ModelAdmin):
    pass

@admin.register(ProductionBatch)
class ProductionBatchAdmin(admin.ModelAdmin):
    pass

