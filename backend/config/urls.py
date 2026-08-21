from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path("admin/", admin.site.urls),

    # OpenAPI / Swagger docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # Auth (no /organizations/{id}/ prefix — auth happens before an org is picked)
    path("api/v1/auth/", include("apps.users.urls")),

    path("api/v1/organizations/", include("apps.organizations.urls")),
    path("api/v1/dashboard/", include("apps.dashboard.urls")),
    path("api/v1/projects/", include("apps.projects.urls")),
    path("api/v1/products/", include("apps.products.urls")),
    path("api/v1/workspaces/", include("apps.products.urls")),
    path("api/v1/blueprints/", include("apps.blueprints.urls")),
    path("api/v1/marketplace/", include("apps.marketplace.urls")),
    path("api/v1/manufacturers/", include("apps.manufacturers.urls")),
    path("api/v1/suppliers/", include("apps.suppliers.urls")),
    path("api/v1/materials/", include("apps.materials.urls")),
    path("api/v1/procurement/", include("apps.procurement.urls")),
    path("api/v1/inventory/", include("apps.inventory.urls")),
    path("api/v1/warehouses/", include("apps.warehouses.urls")),
    path("api/v1/production/", include("apps.production.urls")),
    path("api/v1/quality/", include("apps.quality.urls")),
    path("api/v1/orders/", include("apps.orders.urls")),
    path("api/v1/logistics/", include("apps.logistics.urls")),
    path("api/v1/documents/", include("apps.documents.urls")),
    path("api/v1/notifications/", include("apps.notifications.urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
    path("api/v1/ai/", include("apps.ai.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
