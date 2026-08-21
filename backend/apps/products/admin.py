from django.contrib import admin
from .models import Product, ProductLifecycleStep, ProductMilestone, ProductTask

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    pass

@admin.register(ProductLifecycleStep)
class ProductLifecycleStepAdmin(admin.ModelAdmin):
    pass

@admin.register(ProductMilestone)
class ProductMilestoneAdmin(admin.ModelAdmin):
    pass

@admin.register(ProductTask)
class ProductTaskAdmin(admin.ModelAdmin):
    pass

