from django.db.models import Avg, Sum
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsOrgMember
from apps.inventory.models import InventoryItem
from apps.orders.models import SalesOrder
from apps.procurement.models import PurchaseOrder
from apps.production.models import ProductionBatch
from apps.products.models import Product
from apps.suppliers.models import Supplier


class DashboardOverviewView(APIView):
    """
    GET /api/v1/dashboard/overview/
    The dashboard "does not store data itself... collects information from
    every module" (per the project brief) — this view is exactly that
    collector, in one call so the frontend doesn't need 8 separate requests.
    """
    permission_classes = [IsOrgMember]

    def get(self, request):
        org = request.organization

        products = Product.objects.filter(organization=org)
        purchase_orders = PurchaseOrder.objects.filter(organization=org)
        sales_orders = SalesOrder.objects.filter(organization=org)
        production_batches = ProductionBatch.objects.filter(organization=org)
        suppliers = Supplier.objects.filter(organization=org)

        revenue = sales_orders.filter(order_status__in=["delivered", "shipped"]).aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        inventory_value = 0
        for item in InventoryItem.objects.filter(organization=org).select_related("material"):
            price = item.material.last_purchase_price if item.material_id and item.material.last_purchase_price else 0
            inventory_value += float(price) * float(item.quantity_on_hand)

        kpis = {
            "revenue": float(revenue),
            "active_products": products.exclude(stage__in=["launched", "discontinued"]).count(),
            "inventory_value": round(inventory_value, 2),
            "open_purchase_orders": purchase_orders.exclude(po_status__in=["received", "cancelled"]).count(),
            "pending_shipments": purchase_orders.filter(po_status="shipped").count()
                                 + sales_orders.filter(order_status="shipped").count(),
            "production_in_progress": production_batches.filter(batch_status="in_progress").count(),
            "average_supplier_rating": float(
                suppliers.aggregate(avg=Avg("rating"))["avg"] or 0
            ),
        }

        products_summary = [
            {
                "id": str(p.id), "name": p.name, "emoji": p.emoji, "stage": p.stage,
                "progress_pct": p.progress_pct, "health_score": p.health_score,
                "risk_level": p.risk_level, "current_milestone": p.current_milestone,
                "target_industry": p.target_industry or p.category or "General Industrial",
                "budget_total": float(p.budget_total or 0),
            }
            for p in products.order_by("-updated_at")[:10]
        ]

        recent_purchase_orders = [
            {
                "id": str(po.id), "po_number": po.po_number, "supplier": po.supplier.name,
                "total_amount": float(po.total_amount), "status": po.po_status,
            }
            for po in purchase_orders.select_related("supplier").order_by("-created_at")[:10]
        ]

        intelligence_data = {}
        try:
            from apps.ai.dynamic_engine import DashboardIntelligenceEngine
            intelligence_data = DashboardIntelligenceEngine.get_organization_metrics(org)
        except Exception as e:
            print(f"Error generating dashboard intelligence: {e}")

        return Response({
            "kpis": kpis,
            "products": products_summary,
            "recent_purchase_orders": recent_purchase_orders,
            "intelligence": intelligence_data,
        })
