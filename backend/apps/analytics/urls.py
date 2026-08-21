from django.urls import path

from .views import (
    DemandForecastReportView,
    InventoryReportView,
    ManufacturerPerformanceReportView,
    ProductionEfficiencyReportView,
    ProfitAnalysisReportView,
    SalesReportView,
    SupplierPerformanceReportView,
)

urlpatterns = [
    path("sales/", SalesReportView.as_view(), name="report-sales"),
    path("inventory/", InventoryReportView.as_view(), name="report-inventory"),
    path("production/", ProductionEfficiencyReportView.as_view(), name="report-production"),
    path("supplier-performance/", SupplierPerformanceReportView.as_view(), name="report-supplier-performance"),
    path("manufacturer-performance/", ManufacturerPerformanceReportView.as_view(), name="report-manufacturer-performance"),
    path("demand-forecast/", DemandForecastReportView.as_view(), name="report-demand-forecast"),
    path("profit/", ProfitAnalysisReportView.as_view(), name="report-profit"),
]
