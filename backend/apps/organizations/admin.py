from django.contrib import admin
from .models import Organization, Membership

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    pass

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    pass

