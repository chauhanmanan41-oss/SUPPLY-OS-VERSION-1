from django.db import models

from apps.common.models import OrgOwnedModel

STAGE_CHOICES = [
    ("Planning", "Planning"),
    ("Idea", "Idea"),
    ("Supplier", "Supplier Selection"),
    ("Manufacturer", "Manufacturing"),
    ("Packaging", "Packaging"),
    ("Production", "Production"),
    ("QA", "Quality Assurance"),
    ("Warehouse", "Warehouse"),
    ("Transport", "Transport & Logistics"),
    ("Completed", "Completed"),
    ("delayed", "Delayed"),
    # Keep legacy lowercase keys for backwards compatibility
    ("planning", "Planning"),
    ("supplier_selection", "Supplier Selection"),
    ("manufacturing", "Manufacturing"),
    ("logistics", "Logistics"),
    ("completed", "Completed"),
]

RISK_CHOICES = [("low", "Low"), ("medium", "Medium"), ("high", "High")]


class Product(OrgOwnedModel):
    """
    The Product Workspace. Every module in SupplyOS (manufacturers,
    suppliers, procurement, inventory, production, orders, documents...)
    ultimately links back to a Product — this is "the ERP inside the ERP"
    described in the project brief.
    """
    project = models.OneToOneField(
        "projects.Project", related_name="product", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    emoji = models.CharField(max_length=8, blank=True)
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default="Planning")
    progress_pct = models.PositiveSmallIntegerField(default=0)
    health_score = models.PositiveSmallIntegerField(default=100)
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, default="low")
    budget_total = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    budget_used_pct = models.PositiveSmallIntegerField(default=0)
    estimated_launch = models.CharField(max_length=100, blank=True)
    current_milestone = models.CharField(max_length=255, blank=True)

    # Core identity & metadata from 12-Step Wizard / AI extraction
    category = models.CharField(max_length=120, blank=True, db_index=True)
    subcategory = models.CharField(max_length=120, blank=True)
    brand = models.CharField(max_length=120, blank=True)
    sku = models.CharField(max_length=100, blank=True, db_index=True)
    version = models.CharField(max_length=50, blank=True, default="v1.0")
    product_type = models.CharField(max_length=50, blank=True, default="Finished Product")
    description = models.TextField(blank=True)
    target_industry = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=120, blank=True, default="India")
    target_market = models.JSONField(default=list, blank=True)
    priority = models.CharField(max_length=30, default="medium", blank=True)
    creation_method = models.CharField(max_length=30, default="manual", blank=True)

    # Rich structured JSON specification fields for the 12-step ERP configuration
    commercial_data = models.JSONField(default=dict, blank=True)
    manufacturing_data = models.JSONField(default=dict, blank=True)
    raw_materials_data = models.JSONField(default=list, blank=True)
    packaging_data = models.JSONField(default=dict, blank=True)
    warehouse_data = models.JSONField(default=dict, blank=True)
    logistics_data = models.JSONField(default=dict, blank=True)
    quality_data = models.JSONField(default=dict, blank=True)
    inventory_data = models.JSONField(default=dict, blank=True)
    documents_data = models.JSONField(default=list, blank=True)
    team_data = models.JSONField(default=dict, blank=True)

    # Auto Marketplace Matching & AI Intelligence state
    marketplace_recommendations = models.JSONField(default=dict, blank=True)
    approved_partners = models.JSONField(default=list, blank=True)
    ai_insights = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class ProductLifecycleStep(OrgOwnedModel):
    """Ordered checklist shown on the workspace overview tab (Idea → Planning → ... → Launch)."""
    product = models.ForeignKey(Product, related_name="lifecycle_steps", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    order = models.PositiveSmallIntegerField(default=0)
    is_done = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]


class ProductMilestone(OrgOwnedModel):
    product = models.ForeignKey(Product, related_name="milestones", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    due_date = models.DateField(null=True, blank=True)
    is_complete = models.BooleanField(default=False)


class ProductTask(OrgOwnedModel):
    """Kanban card on the workspace's task board."""
    COLUMN_CHOICES = [("todo", "To Do"), ("in_progress", "In Progress"), ("review", "Review"), ("done", "Done")]

    product = models.ForeignKey(Product, related_name="tasks", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    column = models.CharField(max_length=20, choices=COLUMN_CHOICES, default="todo")
    assignee = models.ForeignKey(
        "users.User", null=True, blank=True, related_name="assigned_tasks", on_delete=models.SET_NULL
    )
    due_date = models.DateField(null=True, blank=True)


class WorkspaceSupplier(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_suppliers", on_delete=models.CASCADE)
    supplier_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_supplier", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Supplier {self.supplier_partner.name} for {self.workspace.name}"


class WorkspaceManufacturer(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_manufacturers", on_delete=models.CASCADE)
    manufacturer_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_manufacturer", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Manufacturer {self.manufacturer_partner.name} for {self.workspace.name}"


class WorkspaceWarehouse(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_warehouses", on_delete=models.CASCADE)
    warehouse_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_warehouse", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspacePackaging(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_packaging", on_delete=models.CASCADE)
    packaging_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_packaging", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspaceTransport(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_transports", on_delete=models.CASCADE)
    transport_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_transport", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspaceQualityLab(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_quality_labs", on_delete=models.CASCADE)
    quality_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_quality_lab", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspaceCertificationAgency(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_certifications", on_delete=models.CASCADE)
    certification_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_certification", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspaceConsultant(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_consultants", on_delete=models.CASCADE)
    consultant_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_consultant", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class WorkspaceMachinery(OrgOwnedModel):
    workspace = models.ForeignKey(Product, related_name="workspace_machinery", on_delete=models.CASCADE)
    machinery_partner = models.ForeignKey("marketplace.MarketplacePartner", related_name="assigned_as_machinery", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]


class InterviewSession(OrgOwnedModel):
    """
    AI Product Architect interview session.
    Stores the full conversational history, AI reasoning, collected specifications,
    and links to the resulting Product workspace once created.
    The AI orchestration layer fills the existing ERP workspace — it never replaces it.
    """
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('WORKSPACE_CREATED', 'Workspace Created'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='interview_sessions')
    product = models.OneToOneField(
        Product, null=True, blank=True, related_name='interview_session', on_delete=models.SET_NULL,
        help_text="Linked after the AI creates the workspace from collected specs."
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')

    # Conversation state
    conversation_history = models.JSONField(
        default=list, blank=True,
        help_text='[{"role": "ai"|"user", "content": "...", "timestamp": "..."}]'
    )
    collected_specs = models.JSONField(
        default=dict, blank=True,
        help_text='Structured specs extracted from conversation: product_name, category, budget, etc.'
    )
    ai_reasoning = models.JSONField(
        default=list, blank=True,
        help_text='AI reasoning trace for each decision: [{step, reasoning, confidence}]'
    )
    marketplace_results = models.JSONField(
        default=dict, blank=True,
        help_text='Cached marketplace search results for recommendations.'
    )
    current_phase = models.CharField(
        max_length=30, default='greeting',
        help_text='Current interview phase: greeting, product_basics, specifications, requirements, marketplace_search, review, complete'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        name = (self.collected_specs or {}).get('product_name', f'Session {self.id}')
        return f"InterviewSession: {name} ({self.status})"
