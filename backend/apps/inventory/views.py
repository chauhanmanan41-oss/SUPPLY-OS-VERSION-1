from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.viewsets import OrgScopedModelViewSet

from .models import InventoryItem
from .serializers import InventoryAdjustmentSerializer, InventoryItemSerializer, InventoryMovementSerializer
from .services import apply_movement


class InventoryItemViewSet(OrgScopedModelViewSet):
    queryset = InventoryItem.objects.select_related("material", "finished_product", "warehouse").all()
    serializer_class = InventoryItemSerializer
    filterset_fields = ["warehouse", "material", "finished_product"]
    search_fields = ["material__name", "finished_product__name"]
    ordering_fields = ["quantity_on_hand", "updated_at"]

    @action(detail=False, methods=["get"], url_path="low-stock")
    def low_stock(self, request):
        items = [i for i in self.get_queryset() if i.is_low_stock]
        return Response(InventoryItemSerializer(items, many=True).data)

    @action(detail=True, methods=["get"], url_path="movements")
    def movements(self, request, pk=None):
        item = self.get_object()
        return Response(InventoryMovementSerializer(item.movements.all(), many=True).data)

    @action(detail=True, methods=["post"], url_path="adjust")
    def adjust(self, request, pk=None):
        """Manual correction, e.g. a physical stock count discrepancy or damage write-off."""
        item = self.get_object()
        serializer = InventoryAdjustmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        apply_movement(
            inventory_item=item,
            movement_type="adjustment",
            quantity_delta=serializer.validated_data["quantity_delta"],
            notes=serializer.validated_data.get("notes", ""),
            organization=request.organization,
            created_by=request.user,
        )
        item.refresh_from_db()
        return Response(InventoryItemSerializer(item).data)

    @action(detail=False, methods=["post"], url_path="transfer")
    def transfer(self, request):
        """
        POST /api/v1/inventory/transfer/
        Transfers stock between two warehouses.
        Payload: { from_warehouse, to_warehouse, material (or finished_product), quantity, notes }
        """
        from apps.warehouses.models import Warehouse
        from apps.materials.models import Material
        from apps.products.models import Product
        from .services import transfer_stock

        data = request.data
        try:
            from_wh = Warehouse.objects.get(id=data["from_warehouse"], organization=request.organization)
            to_wh = Warehouse.objects.get(id=data["to_warehouse"], organization=request.organization)
            
            material_id = data.get("material")
            product_id = data.get("finished_product")
            material = Material.objects.get(id=material_id, organization=request.organization) if material_id else None
            product = Product.objects.get(id=product_id, organization=request.organization) if product_id else None

            quantity = float(data["quantity"])
            
            _, dest_item = transfer_stock(
                organization=request.organization,
                user=request.user,
                from_warehouse=from_wh,
                to_warehouse=to_wh,
                material=material,
                finished_product=product,
                quantity=quantity,
                notes=data.get("notes", "")
            )
            return Response(InventoryItemSerializer(dest_item).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=400)

