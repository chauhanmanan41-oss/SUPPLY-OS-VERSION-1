from django.db.models import Avg, Count, Sum
from django.utils.dateparse import parse_date
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsOrgMember
from apps.inventory.models import InventoryItem
from apps.manufacturers.models import Manufacturer
from apps.orders.models import SalesOrder
from apps.production.models import ProductionBatch
from apps.suppliers.models import Supplier


class BaseReportView(APIView):
    permission_classes = [IsOrgMember]

    def _date_range(self, request):
        start = parse_date(request.query_params.get("start", "") or "")
        end = parse_date(request.query_params.get("end", "") or "")
        return start, end


class SalesReportView(BaseReportView):
    """GET /api/v1/analytics/sales/?start=&end=&product=&warehouse="""
    def get(self, request):
        start, end = self._date_range(request)
        qs = SalesOrder.objects.filter(organization=request.organization)
        if start:
            qs = qs.filter(created_at__date__gte=start)
        if end:
            qs = qs.filter(created_at__date__lte=end)
        if request.query_params.get("product"):
            qs = qs.filter(product_id=request.query_params["product"])
        if request.query_params.get("warehouse"):
            qs = qs.filter(warehouse_id=request.query_params["warehouse"])

        totals = qs.aggregate(total_revenue=Sum("total_amount"), total_orders=Count("id"))
        by_status = list(qs.values("order_status").annotate(count=Count("id")))
        return Response({"totals": totals, "by_status": by_status})


class InventoryReportView(BaseReportView):
    """GET /api/v1/analytics/inventory/?warehouse="""
    def get(self, request):
        qs = InventoryItem.objects.filter(organization=request.organization)
        if request.query_params.get("warehouse"):
            qs = qs.filter(warehouse_id=request.query_params["warehouse"])

        items = list(qs.select_related("material", "finished_product", "warehouse"))
        low_stock_count = sum(1 for i in items if i.is_low_stock)
        return Response({
            "total_items": len(items),
            "low_stock_count": low_stock_count,
            "total_on_hand": sum(float(i.quantity_on_hand) for i in items),
        })


class ProductionEfficiencyReportView(BaseReportView):
    def get(self, request):
        qs = ProductionBatch.objects.filter(organization=request.organization)
        totals = qs.aggregate(
            planned=Sum("quantity_planned"), produced=Sum("quantity_produced"), batches=Count("id")
        )
        efficiency = (
            (float(totals["produced"] or 0) / float(totals["planned"])) * 100
            if totals["planned"] else 0
        )
        return Response({**totals, "efficiency_pct": round(efficiency, 1)})


class SupplierPerformanceReportView(BaseReportView):
    def get(self, request):
        qs = Supplier.objects.filter(organization=request.organization)
        data = qs.annotate(po_count=Count("purchase_orders")).values(
            "id", "name", "rating", "quality_score", "performance_score", "po_count"
        ).order_by("-performance_score")
        return Response(list(data))


class ManufacturerPerformanceReportView(BaseReportView):
    def get(self, request):
        qs = Manufacturer.objects.filter(organization=request.organization)
        data = qs.values("id", "name", "rating", "quality_score", "lead_time_days").order_by("-rating")
        return Response(list(data))


class DemandForecastReportView(BaseReportView):
    """GET /api/v1/analytics/demand-forecast/?product=<uuid> — real historical sales fed into the AI service."""
    def get(self, request):
        from apps.ai.services import get_ai_service

        product_id = request.query_params.get("product")
        qs = SalesOrder.objects.filter(organization=request.organization)
        if product_id:
            qs = qs.filter(product_id=product_id)

        historical = list(qs.order_by("created_at").values_list("quantity", flat=True))
        result = get_ai_service().forecast_demand(historical)
        return Response(result)


class ProfitAnalysisReportView(BaseReportView):
    """
    Rough profit view: sales revenue minus purchase order spend, per product.
    Real cost accounting (COGS with production overhead) is a natural
    follow-up once production cost tracking is fleshed out further.
    """
    def get(self, request):
        from apps.procurement.models import PurchaseOrder
        org = request.organization

        revenue_by_product = {
            row["product"]: row["total"]
            for row in SalesOrder.objects.filter(organization=org)
            .values("product").annotate(total=Sum("total_amount"))
        }
        spend_by_product = {
            row["product"]: row["total"]
            for row in PurchaseOrder.objects.filter(organization=org)
            .values("product").annotate(total=Sum("total_amount"))
        }
        product_ids = set(revenue_by_product) | set(spend_by_product)
        result = [
            {
                "product": str(pid),
                "revenue": float(revenue_by_product.get(pid, 0)),
                "spend": float(spend_by_product.get(pid, 0)),
                "profit": float(revenue_by_product.get(pid, 0)) - float(spend_by_product.get(pid, 0)),
            }
            for pid in product_ids
        ]
        return Response(result)
