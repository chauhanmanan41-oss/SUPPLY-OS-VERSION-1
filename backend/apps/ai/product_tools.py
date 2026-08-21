"""
AI Product Builder & Validator tools for SupplyOS Copilot V2.
Generates product specifications from natural language descriptions and validates product completeness.
All operations are organization-scoped.
"""
from apps.marketplace.models import MarketplacePartner
from . import tools


def ai_generate_product(org, description: str) -> dict:
    """
    Generate a complete product specification from a natural language description.
    Returns structured product data that can populate the Create Product wizard.
    This data is passed to Gemini for AI-enhanced generation.
    """
    # Gather context from the organization's marketplace database
    supplier_count = MarketplacePartner.objects.filter(organization=org, status="active", categories__category_code="raw_materials").distinct().count()
    mfg_count = MarketplacePartner.objects.filter(organization=org, status="active", categories__category_code="manufacturers").distinct().count()
    pkg_count = MarketplacePartner.objects.filter(organization=org, status="active", categories__category_code="packaging").distinct().count()
    wh_count = MarketplacePartner.objects.filter(organization=org, status="active", categories__category_code="warehouses").distinct().count()
    lab_count = MarketplacePartner.objects.filter(organization=org, status="active", categories__category_code="quality_labs").distinct().count()

    return {
        "tool_name": "ai_generate_product",
        "parameters": {"description": description},
        "results": [{
            "description": description,
            "org_name": org.name,
            "marketplace_context": {
                "available_suppliers": supplier_count,
                "available_manufacturers": mfg_count,
                "available_packaging": pkg_count,
                "available_warehouses": wh_count,
                "available_labs": lab_count,
            }
        }],
        "total_matches": 1,
    }


def ai_validate_product(org, product_data: dict) -> dict:
    """
    Validate product completeness and suggest improvements.
    Checks for missing required fields, certifications, testing, etc.
    """
    issues = []
    suggestions = []

    # Check required fields
    required_checks = [
        ("productName", "Product Name", "A product name is required for identification."),
        ("category", "Product Category", "Select a category to enable AI supply chain matching."),
        ("description", "Product Description", "A detailed description improves AI accuracy by 40%."),
        ("businessModel", "Business Model", "Define whether this is Own Manufacturing, Private Label, Contract, or Third Party."),
    ]

    for field, label, tip in required_checks:
        if not product_data.get(field):
            issues.append({"field": field, "label": label, "severity": "error", "message": f"Missing: {label}", "tip": tip})

    # Check important fields
    important_checks = [
        ("budget", "Budget", "Setting a budget helps AI recommend cost-effective partners."),
        ("launchTimeline", "Launch Timeline", "A timeline helps prioritize supplier selection."),
        ("certifications", "Certifications", "Specify required certifications (e.g., FSSAI, ISO, GMP) to filter compliant partners."),
        ("rawMaterials", "Raw Materials", "List key raw materials for accurate supplier matching."),
        ("packagingType", "Packaging Type", "Define packaging to match with packaging companies."),
        ("warehouseCity", "Warehouse Location", "Specify warehouse city for logistics optimization."),
        ("monthlyProduction", "Monthly Production Volume", "Production volume determines manufacturer eligibility and pricing."),
    ]

    for field, label, tip in important_checks:
        val = product_data.get(field)
        if not val or (isinstance(val, list) and len(val) == 0):
            issues.append({"field": field, "label": label, "severity": "warning", "message": f"Missing: {label}", "tip": tip})

    # Supply chain readiness suggestions
    category = (product_data.get("category") or "").lower()
    if "nutrition" in category or "supplement" in category or "food" in category or "pharma" in category:
        suggestions.append("FSSAI certification is likely required for this product category in India.")
        suggestions.append("Consider stability testing and shelf life analysis before launch.")
        suggestions.append("CoA (Certificate of Analysis) will be needed for each production batch.")

    if product_data.get("coldChain"):
        suggestions.append("Cold chain logistics adds ~15% to distribution costs. Factor this into pricing.")

    if product_data.get("importExport"):
        suggestions.append("Import/export requires IEC (Import Export Code) from DGFT and customs documentation.")

    # Score
    total_fields = len(required_checks) + len(important_checks)
    filled = total_fields - len(issues)
    completeness_pct = round((filled / total_fields) * 100) if total_fields > 0 else 0

    return {
        "tool_name": "ai_validate_product",
        "parameters": {"product_data": {k: v for k, v in product_data.items() if k in ["productName", "category", "businessModel"]}},
        "results": [{
            "completeness_pct": completeness_pct,
            "total_fields_checked": total_fields,
            "issues_count": len(issues),
            "issues": issues,
            "suggestions": suggestions,
        }],
        "total_matches": 1,
        "issues": issues,
        "suggestions": suggestions,
        "completeness_pct": completeness_pct,
    }


def ai_recommend_partners_for_product(org, product_data: dict) -> dict:
    """
    Recommend marketplace partners across all categories for a product.
    Returns top suppliers, manufacturers, packaging, warehouses, logistics, labs, certifiers.
    """
    category = product_data.get("category", "")
    raw_mats = product_data.get("rawMaterials", "")
    packaging = product_data.get("packagingType", "")
    location = product_data.get("warehouseCity", "")

    recommendations = {}

    # Suppliers
    sup_res = tools.find_suppliers(org, material=raw_mats or category, location=location, limit=3)
    recommendations["suppliers"] = sup_res["results"]

    # Manufacturers
    mfg_res = tools.find_manufacturers(org, capability=category, location=location, limit=3)
    recommendations["manufacturers"] = mfg_res["results"]

    # Packaging
    pkg_res = tools.find_packaging(org, query=packaging or category, location=location, limit=3)
    recommendations["packaging"] = pkg_res["results"]

    # Warehouses
    wh_res = tools.find_warehouses(org, location=location, limit=3)
    recommendations["warehouses"] = wh_res["results"]

    # Logistics
    log_res = tools.find_logistics(org, location=location, limit=3)
    recommendations["logistics"] = log_res["results"]

    # Testing Labs
    lab_res = tools.find_testing_labs(org, location=location, limit=3)
    recommendations["testing_labs"] = lab_res["results"]

    # Certification Agencies
    cert_res = tools.find_certification_agencies(org, limit=3)
    recommendations["certification_agencies"] = cert_res["results"]

    # Total partners found
    total = sum(len(v) for v in recommendations.values())

    return {
        "tool_name": "ai_recommend_partners_for_product",
        "parameters": {"category": category, "location": location},
        "results": [recommendations],
        "total_matches": total,
        "recommendations": recommendations,
    }
