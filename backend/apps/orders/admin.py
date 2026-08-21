from django.contrib import admin
from .models import SalesOrder

@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    pass

