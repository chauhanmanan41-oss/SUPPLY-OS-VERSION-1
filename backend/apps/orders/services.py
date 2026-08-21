from .models import SalesOrder


def update_order_status(order: SalesOrder, new_status: str) -> SalesOrder:
    """
    Validates and updates a sales order's status.
    Prevents invalid transitions like cancelled -> shipped.
    apps.inventory listens for "shipped" (see apps/orders/signals.py) to deduct stock.
    """
    valid_transitions = {
        "draft": ["confirmed", "cancelled"],
        "confirmed": ["processing", "cancelled"],
        "processing": ["shipped", "cancelled"],
        "shipped": ["delivered", "returned"],
        "delivered": ["returned"],
        "returned": [],
        "cancelled": [],
    }

    if order.order_status == new_status:
        return order

    allowed = valid_transitions.get(order.order_status, [])
    if new_status not in allowed:
        raise ValueError(f"Cannot transition order from '{order.order_status}' to '{new_status}'")

    order.order_status = new_status
    order.save(update_fields=["order_status"])
    return order
