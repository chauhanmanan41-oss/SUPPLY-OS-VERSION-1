from django.contrib import admin
from .models import Blueprint

@admin.register(Blueprint)
class BlueprintAdmin(admin.ModelAdmin):
    pass

