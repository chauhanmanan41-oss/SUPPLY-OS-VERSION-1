"""
Product creation service layer.

The Product Creation Wizard and AI Assisted flow are the heart of SupplyOS. Creating a product
touches multiple models across multiple apps (Project -> Product -> LifecycleSteps -> Milestones
-> BillOfMaterial -> InventoryItem -> Auto Marketplace Matching). This service orchestrates that creation
atomically so the view layer stays thin, and so the same logic can be reused by API views,
management commands, or future imports.
"""
import random
import uuid
from decimal import Decimal, InvalidOperation
from django.db import transaction

from apps.projects.models import Project
from .models import Product, ProductLifecycleStep, ProductMilestone


# Default lifecycle steps seeded into every new product workspace as requested by user.
DEFAULT_LIFECYCLE_STEPS = [
    "Planning",
    "Idea",
    "Supplier",
    "Manufacturer",
    "Packaging",
    "Production",
    "QA",
    "Warehouse",
    "Transport",
    "Completed",
]

# Default milestones seeded into every new product workspace.
DEFAULT_MILESTONES = [
    "Define product specifications",
    "Approve AI marketplace partners",
    "Finalize Bill of Materials (BOM)",
    "Contract manufacturing setup",
    "First quality inspection pass",
    "Warehouse stocking & logistics SLA",
    "Launch readiness review",
]


@transaction.atomic
def create_product_with_workspace(*, organization, user, wizard_data: dict) -> Product:
    """
    Atomically creates the full product workspace:
      Project -> Product -> default LifecycleSteps -> default Milestones
      -> relational Bill of Material & Inventory -> Auto Marketplace Matching
    """
    product_name = wizard_data.get("productName") or wizard_data.get("product_name") or "New Product"
    category = wizard_data.get("category") or wizard_data.get("productCategory") or "General"
    subcategory = wizard_data.get("subCategory", "")
    brand = wizard_data.get("brandName") or wizard_data.get("brand", "")
    sku = wizard_data.get("sku", f"SKU-{uuid.uuid4().hex[:6].upper()}")
    version = wizard_data.get("version", "v1.0")
    product_type = wizard_data.get("productType", "Finished Product")
    description = wizard_data.get("description", "")
    industry = wizard_data.get("industry") or wizard_data.get("targetIndustry", "")
    country = wizard_data.get("targetCountry") or wizard_data.get("country", "India")
    priority = wizard_data.get("priority", "medium")
    creation_method = wizard_data.get("creationMethod") or wizard_data.get("creation_method", "manual")

    # Extract commercial variables
    comm = wizard_data.get("commercialData", {})
    if not comm and "budget" in wizard_data:
        comm = {
            "budget": wizard_data.get("budget", ""),
            "timeline": wizard_data.get("launchTimeline", ""),
            "moq": wizard_data.get("moq", ""),
            "capacity": wizard_data.get("monthlyProduction", ""),
        }
    budget = comm.get("budget") or wizard_data.get("budget", "")
    launch_timeline = comm.get("timeline") or wizard_data.get("launchTimeline", "TBD")

    # 1. Create the Project
    project = Project.objects.create(
        organization=organization,
        created_by=user,
        name=product_name,
        description=description,
        category=category or industry,
        priority=priority if priority in ["low", "medium", "high"] else "medium",
        owner=user,
    )

    # 2. Create the Product (linked 1:1 to the Project with all 12 steps of specifications)
    product = Product.objects.create(
        organization=organization,
        created_by=user,
        project=project,
        name=product_name,
        emoji=_pick_emoji(category or product_name),
        stage="Planning",
        budget_total=_parse_budget(budget),
        estimated_launch=str(launch_timeline),
        current_milestone=DEFAULT_MILESTONES[0] if DEFAULT_MILESTONES else "",
        # Identity attributes
        category=category,
        subcategory=subcategory,
        brand=brand,
        sku=sku,
        version=version,
        product_type=product_type,
        description=description,
        target_industry=industry,
        country=country,
        target_market=wizard_data.get("targetMarket", []),
        priority=priority if priority in ["low", "medium", "high"] else "medium",
        creation_method=creation_method,
        # 12-Step structured JSON data
        commercial_data=comm,
        manufacturing_data=wizard_data.get("manufacturingData", {}),
        raw_materials_data=wizard_data.get("rawMaterialsData", []),
        packaging_data=wizard_data.get("packagingData", {}),
        warehouse_data=wizard_data.get("warehouseData", {}),
        logistics_data=wizard_data.get("logisticsData", {}),
        quality_data=wizard_data.get("qualityData", {}),
        inventory_data=wizard_data.get("inventoryData", {}),
        documents_data=wizard_data.get("documentsData", []),
        team_data=wizard_data.get("teamData", {}),
        ai_insights=wizard_data.get("ai_product_details") or wizard_data.get("aiInsights", {}),
    )

    # 3. Seed default lifecycle steps
    ProductLifecycleStep.objects.bulk_create([
        ProductLifecycleStep(
            organization=organization,
            created_by=user,
            product=product,
            label=label,
            order=idx,
            is_done=(idx <= 1),  # "Planning" and "Idea" marked complete/active
        )
        for idx, label in enumerate(DEFAULT_LIFECYCLE_STEPS)
    ])

    # 4. Seed default milestones
    ProductMilestone.objects.bulk_create([
        ProductMilestone(
            organization=organization,
            created_by=user,
            product=product,
            title=title,
        )
        for title in DEFAULT_MILESTONES
    ])

    # 4.5 Execute Dynamic Enterprise Classification and Schema Generation
    try:
        from apps.ai.dynamic_engine import ProductClassifier, WorkspaceSchemaGenerator, ExecutiveIntelligenceEngine, DocumentEngine
        classification = ProductClassifier.classify(product.name, product.category, product.description)
        schema = WorkspaceSchemaGenerator.get_schema(classification["key"], product, wizard_data)
        
        if not product.target_industry or product.target_industry == "General":
            product.target_industry = classification["industry"]
        if not product.category or product.category == "General":
            product.category = classification["category"]
        if not product.subcategory:
            product.subcategory = classification["sub_industry"]
        if not product.emoji or product.emoji == "📦":
            product.emoji = classification["emoji"]

        if not product.raw_materials_data or len(product.raw_materials_data) == 0:
            product.raw_materials_data = schema.get("bom", [])
            wizard_data["rawMaterialsData"] = schema.get("bom", [])
            
        if not product.packaging_data or not isinstance(product.packaging_data, dict) or len(product.packaging_data) == 0:
            product.packaging_data = schema.get("packaging", {})
            
        if not product.quality_data or not isinstance(product.quality_data, dict) or len(product.quality_data) == 0:
            product.quality_data = {"tests": schema.get("quality_tests", []), "certifications": classification.get("regulatory_bodies", [])}
            
        if not product.warehouse_data or not isinstance(product.warehouse_data, dict) or len(product.warehouse_data) == 0:
            product.warehouse_data = {"storage_conditions": classification.get("storage_specification", ""), "type": "Bonded Industrial Storage"}
            
        if not product.logistics_data or not isinstance(product.logistics_data, dict) or len(product.logistics_data) == 0:
            product.logistics_data = {"transit_spec": classification.get("logistics_specification", ""), "needTransport": True}

        product.save(update_fields=[
            "target_industry", "category", "subcategory", "emoji",
            "raw_materials_data", "packaging_data", "quality_data",
            "warehouse_data", "logistics_data", "updated_at"
        ])
    except Exception as e:
        print(f"Error executing dynamic classification: {e}")

    # 5. Automatically seed real relational ERP models (Bill of Materials & Inventory)
    _seed_relational_erp_records(organization, user, product, wizard_data)

    # 6. Execute Auto Marketplace Matching Engine & generate Executive Intelligence & Documents
    recommendations = _auto_match_marketplace(organization, product)
    product.marketplace_recommendations = recommendations
    
    try:
        from apps.ai.dynamic_engine import ProductClassifier, WorkspaceSchemaGenerator, ExecutiveIntelligenceEngine, DocumentEngine
        classification = ProductClassifier.classify(product.name, product.category, product.description)
        schema = WorkspaceSchemaGenerator.get_schema(classification["key"], product, wizard_data)
        exec_summary = ExecutiveIntelligenceEngine.generate_summary(product, classification, recommendations)
        documents = DocumentEngine.generate_all_documents(product, classification, schema, exec_summary)
        
        ai_meta = product.ai_insights or {}
        ai_meta["classification"] = classification
        ai_meta["executive_summary"] = exec_summary
        ai_meta["dynamic_modules"] = schema.get("modules", [])
        product.ai_insights = ai_meta
        product.documents_data = documents
    except Exception as e:
        print(f"Error generating executive summary and dynamic documents: {e}")

    product.save(update_fields=["marketplace_recommendations", "ai_insights", "documents_data", "updated_at"])

    return product


def _seed_relational_erp_records(organization, user, product, wizard_data):
    """Seed real BillOfMaterial and InventoryItem records from wizard inputs."""
    try:
        from apps.production.models import BillOfMaterial, BillOfMaterialLine
        from apps.materials.models import Material
        from apps.warehouses.models import Warehouse
        from apps.inventory.models import InventoryItem

        # Seed BOM if raw materials exist
        raw_materials = wizard_data.get("rawMaterialsData") or []
        if not isinstance(raw_materials, list):
            if isinstance(raw_materials, str) and raw_materials.strip():
                raw_materials = [{"material": raw_materials.strip(), "quantity": 100, "unit": "kg"}]
            else:
                raw_materials = []

        if raw_materials:
            bom, _ = BillOfMaterial.objects.get_or_create(
                product=product,
                defaults={
                    "organization": organization,
                    "created_by": user,
                    "version": product.version or "v1.0",
                    "is_active": True,
                    "notes": f"Initial Bill of Materials for {product.name}",
                }
            )
            for item in raw_materials:
                mat_name = item.get("material") or item.get("name") or "Raw Material"
                qty = item.get("quantity") or 100
                unit = item.get("unit") or "kg"
                # Find or create Material master in org
                material, _ = Material.objects.get_or_create(
                    organization=organization,
                    name=mat_name,
                    defaults={
                        "created_by": user,
                        "unit": unit if unit in ["kg", "g", "l", "ml", "unit", "box", "m", "ton"] else "unit",
                        "category": product.category,
                    }
                )
                try:
                    num_qty = Decimal(str(qty).replace(",", "").strip())
                except (InvalidOperation, ValueError, TypeError):
                    num_qty = Decimal("100.0000")
                BillOfMaterialLine.objects.get_or_create(
                    bom=bom,
                    material=material,
                    defaults={
                        "organization": organization,
                        "created_by": user,
                        "quantity": num_qty,
                        "instructions": f"Specified supplier: {item.get('supplier', 'Any verified vendor')}",
                    }
                )

        # Seed Inventory Item
        inv_data = wizard_data.get("inventoryData", {})
        initial_stock = inv_data.get("initialStock", 0)
        reorder_point = inv_data.get("reorderPoint", 100)
        
        wh = Warehouse.objects.filter(organization=organization, is_active=True).first()
        if not wh:
            wh = Warehouse.objects.create(
                organization=organization,
                created_by=user,
                name=f"{organization.name} Primary Warehouse",
                warehouse_type="internal",
                is_active=True
            )

        try:
            num_stock = Decimal(str(initial_stock).replace(",", "").strip())
        except (InvalidOperation, ValueError, TypeError):
            num_stock = Decimal("0.00")
            
        try:
            num_reorder = Decimal(str(reorder_point).replace(",", "").strip())
        except (InvalidOperation, ValueError, TypeError):
            num_reorder = Decimal("100.00")

        InventoryItem.objects.get_or_create(
            finished_product=product,
            warehouse=wh,
            defaults={
                "organization": organization,
                "created_by": user,
                "quantity_on_hand": num_stock,
                "reorder_threshold": num_reorder,
            }
        )
    except Exception as e:
        # Prevent seeding failure from rolling back overall workspace creation
        print(f"Error seeding relational ERP records: {e}")


def _auto_match_marketplace(organization, product) -> dict:
    """
    Context-Aware AI Recommendation Matching Engine.
    Executes the comprehensive recommendation pipeline via RecommendationService to recommend
    high-scoring partners customized to the active workspace requirements, industry, budget, and location.
    """
    try:
        from apps.ai.recommendation_engine import RecommendationService
        return RecommendationService.get_recommendations_for_workspace(product, organization)
    except Exception as e:
        print(f"Error in context-aware matching engine: {e}")
        return {}


def _pick_emoji(category: str) -> str:
    """Pick a contextual emoji based on the product category or title."""
    category_lower = (category or "").lower()
    emoji_map = {
        "food": "🍽️",
        "beverage": "🥤",
        "drink": "🥤",
        "supplement": "💪",
        "protein": "🏋️‍♂️",
        "whey": "🏋️‍♂️",
        "health": "💊",
        "shampoo": "🧴",
        "beauty": "🧴",
        "cosmetic": "🧴",
        "smartphone": "📱",
        "phone": "📱",
        "electronics": "⚡",
        "cotton": "👕",
        "t-shirt": "👕",
        "shirt": "👕",
        "clothing": "👗",
        "textile": "🧶",
        "bicycle": "🚲",
        "bike": "🚲",
        "automotive": "🚗",
        "packaging": "📦",
        "chemical": "🧪",
        "agriculture": "🌾",
        "furniture": "🪑",
    }
    for keyword, emoji in emoji_map.items():
        if keyword in category_lower:
            return emoji
    return "📦"


def _parse_budget(budget) -> "Decimal | None":
    """Parse a free-text budget string like '₹50L' or '50000' into a Decimal."""
    if not budget:
        return None
    # Strip currency symbols and whitespace
    cleaned = str(budget).replace("₹", "").replace("$", "").replace(",", "").strip()
    # Handle Indian shorthand: L = Lakh (100K), Cr = Crore (10M)
    multiplier = 1
    upper = cleaned.upper()
    if upper.endswith("CR"):
        multiplier = 10_000_000
        cleaned = cleaned[:-2].strip()
    elif upper.endswith("L"):
        multiplier = 100_000
        cleaned = cleaned[:-1].strip()
    elif upper.endswith("K"):
        multiplier = 1_000
        cleaned = cleaned[:-1].strip()
    try:
        return Decimal(cleaned) * multiplier
    except (InvalidOperation, ValueError):
        return None
