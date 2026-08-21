# SupplyOS Backend

Django + Django REST Framework backend for SupplyOS — an AI-powered
Manufacturing, Procurement, Inventory & Supply Chain ERP platform.

## Quick start

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # then edit .env with real values
export $(cat .env | xargs)         # or use python-decouple / direnv

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API docs (Swagger UI) once running: **http://localhost:8000/api/docs/**

## ⚠️ Before you run this for the first time

This backend was written carefully and verified statically (every file's
Python syntax parsed cleanly, every cross-app import resolves, every
string-based FK target checked) — but **it has not been executed**. There
was no Django install or network access available in the environment that
wrote it. Concretely, that means:

- **No migrations exist yet.** Run `makemigrations` yourself as the first
  real test — this is the step most likely to surface anything static
  analysis couldn't catch (field option conflicts, circular FK ordering, etc.).
- **No tests exist yet.** Add `pytest-django` tests as you go — the
  dependency is already in `requirements.txt`.
- The AI provider is currently `rule_based` (see `apps/ai/services.py`) —
  deterministic, dependency-free, good for development, **not a real LLM**.
  Swap in a real provider by implementing the `AIService` interface and
  changing `AI_PROVIDER` in `.env`.

## Architecture

```
config/            Django project: settings (base/dev/prod), root urls, wsgi/asgi
apps/
  common/           Base model classes, RBAC permissions, org-scoped viewset, exception handler
  users/            Custom email-based User model, JWT auth endpoints
  organizations/    Organization + Membership (multi-tenancy core), OrganizationMiddleware
  projects/         Project (product idea container)
  products/         Product = the "Product Workspace" — the central entity everything attaches to
  blueprints/       AI-generated manufacturing blueprints
  ai/               Provider-agnostic AI service layer (blueprint gen, recommendations, forecasting)
  manufacturers/    Manufacturer directory + product linking
  suppliers/        Supplier directory + product linking
  materials/        Raw material master data
  marketplace/      Cross-cutting search over manufacturers/suppliers, categories, trending searches
  procurement/      PurchaseRequest → RFQ → Quotation → PurchaseOrder workflow
  inventory/        Stock levels + movement ledger (the source of truth for all stock changes)
  warehouses/       Warehouse master data
  production/       Production plans & batches (auto-credits finished goods on completion)
  quality/          Quality inspections per production batch
  orders/           Customer sales orders (auto-reserves/ships stock)
  logistics/         Shipments (inbound PO / outbound order / warehouse transfer)
  documents/        Generic file attachments (via ContentType) for any module
  notifications/    Per-user notifications + the notify()/notify_all_org_members() helpers
  dashboard/        Aggregation-only endpoint pulling widgets from every module
  analytics/        Reporting endpoints (sales, inventory, production, supplier/manufacturer, profit, demand forecast)
```

### Multi-tenancy

Every business model inherits `apps.common.models.OrgOwnedModel`, which adds
an `organization` FK plus audit fields (`created_by`/`updated_by`/soft
delete). `OrganizationMiddleware` resolves the active organization from the
`X-Organization-Id` request header (falling back to the user's
`default_organization`) and attaches it as `request.organization` +
`request.membership`. `apps.common.viewsets.OrgScopedModelViewSet` — the base
class every viewset in the project uses — automatically filters every
queryset to that organization and stamps `created_by`/`updated_by` on save.
**No view should ever query an OrgOwnedModel subclass without going through
this base class or manually filtering by `request.organization`.**

### RBAC

Roles live on `Membership.role` (see `apps/organizations/models.py` for the
full list — Super Admin down to Viewer). `apps.common.permissions.HasRole(...)`
gates write actions to specific roles; `IsOrgMember` is the baseline read
check. Super Admin always passes any `HasRole` check.

### Automated stock movements

Rather than scattering inventory-mutation code across every app, all stock
changes funnel through `apps.inventory.services.apply_movement()`, which
writes an immutable `InventoryMovement` row and updates the cached
`quantity_on_hand`. Three Django signals wire the automatic rules from the
project brief:

- `apps/inventory/signals.py` — PO marked "received" → increases stock; any
  movement that drops an item below its reorder threshold → notifies
  Inventory Managers + Org Admins
- `apps/production/signals.py` — batch marked "completed" → credits finished
  goods
- `apps/orders/signals.py` — order created → reserves stock; order shipped →
  releases the reservation and decrements on-hand stock

## Testing

```bash
pytest
```

(No tests are written yet — `pytest-django` and `factory-boy` are already in
`requirements.txt` for when you add them.)

## Deployment notes

- `config/settings/prod.py` reads `DATABASE_URL` (Supabase-compatible) or
  falls back to discrete `DB_*` vars, enables HSTS/SSL redirect/secure
  cookies, and switches to S3-compatible storage if
  `AWS_STORAGE_BUCKET_NAME` is set (works with Supabase Storage's
  S3-compatible endpoint too).
- Run `python manage.py collectstatic` before deploying; `whitenoise` is
  already wired for serving static files from the Django process itself if
  you don't have a separate static host.
- Put `gunicorn config.wsgi:application` behind your reverse proxy of choice.
