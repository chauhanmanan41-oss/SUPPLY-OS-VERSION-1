"""
AI Procurement Planner tools for SupplyOS Copilot V2.
Builds complete supply chain plans from natural language descriptions using real marketplace data.
All operations are organization-scoped — never accesses data from other organizations.
"""
from apps.marketplace.models import MarketplacePartner
from . import tools


def ai_build_procurement_plan(org, description: str) -> dict:
    """
    Build a complete procurement plan from a product description.
    Recommends partners from every category and builds timeline/risk estimates.
    Uses ONLY real marketplace database records.
    """
    # Find best partners in each category
    plan = {}

    # Raw Material Suppliers
    sup_res = tools.find_suppliers(org, material=description, limit=3)
    plan["raw_material_suppliers"] = sup_res["results"]

    # Manufacturers
    mfg_res = tools.find_manufacturers(org, capability=description, limit=3)
    plan["manufacturers"] = mfg_res["results"]

    # Packaging Companies
    pkg_res = tools.find_packaging(org, query=description, limit=3)
    plan["packaging_companies"] = pkg_res["results"]

    # Warehouses
    wh_res = tools.find_warehouses(org, limit=3)
    plan["warehouses"] = wh_res["results"]

    # Logistics
    log_res = tools.find_logistics(org, limit=3)
    plan["logistics_providers"] = log_res["results"]

    # Testing Labs
    lab_res = tools.find_testing_labs(org, limit=3)
    plan["testing_labs"] = lab_res["results"]

    # Certification Agencies
    cert_res = tools.find_certification_agencies(org, limit=3)
    plan["certification_agencies"] = cert_res["results"]

    # Consultants
    con_res = tools.find_consultants(org, limit=2)
    plan["consultants"] = con_res["results"]

    # Machinery
    mac_res = tools.find_machinery(org, limit=2)
    plan["machinery_suppliers"] = mac_res["results"]

    # Import/Export
    ie_res = tools.find_import_export(org, limit=2)
    plan["import_export_partners"] = ie_res["results"]

    # Build timeline estimate based on partner lead times
    timeline = _estimate_timeline(plan)

    # Identify risks
    risks = _identify_risks(plan)

    # Count totals
    total_partners = sum(len(v) for v in plan.values())

    return {
        "tool_name": "ai_build_procurement_plan",
        "parameters": {"description": description},
        "results": [{
            "plan": plan,
            "timeline": timeline,
            "risks": risks,
            "total_partners_available": total_partners,
            "org_name": org.name,
        }],
        "total_matches": total_partners,
        "plan": plan,
        "timeline": timeline,
        "risks": risks,
    }


def _estimate_timeline(plan):
    """Estimate procurement and manufacturing timeline from partner lead times."""
    phases = []

    # Supplier selection: 2 weeks
    phases.append({"phase": "Supplier Selection & RFQ", "weeks": 2, "status": "planning"})

    # Raw material procurement
    sup_leads = [p.get("lead_time_days", 14) for p in plan.get("raw_material_suppliers", [])]
    avg_sup_lead = round(sum(sup_leads) / len(sup_leads)) if sup_leads else 14
    phases.append({"phase": "Raw Material Procurement", "weeks": max(2, round(avg_sup_lead / 7)), "status": "planning"})

    # Manufacturing
    mfg_leads = [p.get("lead_time_days", 21) for p in plan.get("manufacturers", [])]
    avg_mfg_lead = round(sum(mfg_leads) / len(mfg_leads)) if mfg_leads else 21
    phases.append({"phase": "Manufacturing & Production", "weeks": max(3, round(avg_mfg_lead / 7)), "status": "planning"})

    # Packaging
    pkg_leads = [p.get("lead_time_days", 10) for p in plan.get("packaging_companies", [])]
    avg_pkg_lead = round(sum(pkg_leads) / len(pkg_leads)) if pkg_leads else 10
    phases.append({"phase": "Packaging", "weeks": max(1, round(avg_pkg_lead / 7)), "status": "planning"})

    # Quality & Testing
    phases.append({"phase": "Quality Testing & CoA", "weeks": 2, "status": "planning"})

    # Logistics
    phases.append({"phase": "Logistics & Distribution", "weeks": 1, "status": "planning"})

    total_weeks = sum(p["weeks"] for p in phases)
    phases.append({"phase": "TOTAL ESTIMATED", "weeks": total_weeks, "status": "estimate"})

    return phases


def _identify_risks(plan):
    """Identify business risks and critical dependencies from the procurement plan."""
    risks = []

    # Check for category gaps
    category_labels = {
        "raw_material_suppliers": "Raw Material Suppliers",
        "manufacturers": "Manufacturers",
        "packaging_companies": "Packaging Companies",
        "warehouses": "Warehouses",
        "logistics_providers": "Logistics Providers",
        "testing_labs": "Quality Testing Labs",
        "certification_agencies": "Certification Agencies",
    }

    for key, label in category_labels.items():
        partners = plan.get(key, [])
        if len(partners) == 0:
            risks.append({
                "risk": f"No {label} found in organization directory",
                "severity": "high",
                "mitigation": f"Add {label.lower()} to your Marketplace directory before proceeding."
            })
        elif len(partners) == 1:
            risks.append({
                "risk": f"Single-source dependency for {label}",
                "severity": "medium",
                "mitigation": f"Consider adding backup {label.lower()} to reduce supply disruption risk."
            })

    # Check for long lead times
    all_partners = []
    for v in plan.values():
        all_partners.extend(v)

    long_leads = [p for p in all_partners if p.get("lead_time_days", 0) > 30]
    if long_leads:
        names = ", ".join(p["name"] for p in long_leads[:3])
        risks.append({
            "risk": f"Extended lead times ({', '.join(str(p['lead_time_days']) for p in long_leads[:3])} days) from: {names}",
            "severity": "medium",
            "mitigation": "Initiate procurement early or negotiate expedited delivery terms."
        })

    # General risks
    risks.append({
        "risk": "Raw material price volatility",
        "severity": "low",
        "mitigation": "Lock in 3-6 month supply contracts with price escalation clauses."
    })

    return risks


def ai_generate_document(org, doc_type: str, description: str = "", context: dict = None) -> dict:
    """
    Generate business documents using organization data.
    Supported doc_types: bom, spec_sheet, quality_checklist, coa_draft,
    packaging_instructions, production_instructions, procurement_checklist, product_summary
    """
    # Gather relevant marketplace data for context
    context_data = {
        "org_name": org.name,
        "doc_type": doc_type,
        "description": description,
    }

    # Add relevant partners if available
    if doc_type in ["bom", "spec_sheet", "product_summary"]:
        sup_res = tools.find_suppliers(org, material=description, limit=3)
        context_data["suppliers"] = sup_res["results"]

    if doc_type in ["quality_checklist", "coa_draft"]:
        lab_res = tools.find_testing_labs(org, limit=3)
        context_data["testing_labs"] = lab_res["results"]

    if doc_type == "packaging_instructions":
        pkg_res = tools.find_packaging(org, query=description, limit=3)
        context_data["packaging_companies"] = pkg_res["results"]

    if doc_type == "production_instructions":
        mfg_res = tools.find_manufacturers(org, capability=description, limit=3)
        context_data["manufacturers"] = mfg_res["results"]

    return {
        "tool_name": "ai_generate_document",
        "parameters": {"doc_type": doc_type, "description": description},
        "results": [context_data],
        "total_matches": 1,
    }
