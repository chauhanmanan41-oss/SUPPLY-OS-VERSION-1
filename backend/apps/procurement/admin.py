from django.contrib import admin
from .models import PurchaseRequest, RFQ, Quotation, PurchaseOrder

@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    pass

@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    pass

@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    pass

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    pass

