from django.contrib import admin
from .models import QualityInspection

@admin.register(QualityInspection)
class QualityInspectionAdmin(admin.ModelAdmin):
    pass

