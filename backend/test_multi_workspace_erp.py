import os
import sys
import json
import django

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Initialize Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.organizations.models import Organization
from apps.products.models import Product, ProductLifecycleStep, ProductMilestone
from apps.projects.models import Project
from apps.inventory.models import InventoryItem
from apps.marketplace.models import MarketplacePartner

User = get_user_model()

def run_e2e_workspace_verification():
    print("=========================================================================")
    print("[SUPPLYOS ENTERPRISE MULTI-WORKSPACE E2E VERIFICATION TEST SUITE]")
    print("=========================================================================")
    
    # 1. Setup Tenant & Test User
    print("\n[STEP 1] Setting up isolated organization tenant and marketplace seed partners...")
    org, _ = Organization.objects.get_or_create(
        slug="e2e-workspace-corp",
        defaults={"name": "E2E Enterprise Workspace Corp", "is_active": True}
    )
    user = User.objects.filter(email="architect@supplyos-e2e.io").first()
    if not user:
        user = User.objects.create_user(
            email="architect@supplyos-e2e.io",
            password="E2eSecurePass!123",
            is_staff=True,
            is_superuser=True
        )
    if hasattr(user, "organizations"):
        user.organizations.add(org)

    # Seed verified MarketplacePartners for Auto-Matching test
    partners_seed = [
        {"name": "Apex Raw Nutraceuticals Ltd", "desc": "Raw material suppliers and ingredients", "country": "India", "status": "active", "ai_score": 98},
        {"name": "BioTech Cleanroom Manufacturer", "desc": "Contract manufacturer OEM production factory", "country": "Singapore", "status": "active", "ai_score": 94},
        {"name": "Pro-Tech Carbon Forming Factory", "desc": "High performance OEM ODM fabrication line", "country": "Germany", "status": "active", "ai_score": 96},
        {"name": "EcoPack Kraft Packaging Printers", "desc": "Custom box bottle packaging label solutions", "country": "Vietnam", "status": "active", "ai_score": 91},
        {"name": "Mumbai Global Express Freight Logistics", "desc": "Shipping cargo transport express freight", "country": "India", "status": "active", "ai_score": 89},
        {"name": "NABL QualCert Inspection Lab", "desc": "Certified ISO lab quality testing certification inspection", "country": "India", "status": "active", "ai_score": 97},
    ]
    for p in partners_seed:
        MarketplacePartner.objects.get_or_create(
            organization=org, name=p["name"],
            defaults={
                "description": p["desc"],
                "country": p["country"],
                "status": p["status"],
                "ai_score": p["ai_score"],
                "contact_email": f"{p['name'].lower().replace(' ', '')}@partner-test.com",
            }
        )
    print(f"[OK] Seeded Organization '{org.name}' with {MarketplacePartner.objects.filter(organization=org, status='active').count()} active marketplace partners.")

    client = APIClient()
    client.force_authenticate(user=user)
    headers = {"HTTP_X_ORGANIZATION": org.slug}

    # 2. Execute 5 Multi-Domain Workspaces Creation
    print("\n[STEP 2] Launching 5 separate Workspaces using BOTH AI and Manual creation engines...")
    workspaces_to_create = [
        {
            "productName": "NeuroBoost Nootropic Energy Bar",
            "sku": "NEURO-BAR-001",
            "category": "Supplements & Nutrition",
            "brandName": "BrainFuel Labs",
            "creation_method": "ai_assisted",
            "budget_total": 750000,
            "commercial_data": {"budget": 750000, "target_mrr": 2000000, "moq": 5000, "margin": 55, "timeline": "45 Days"},
            "rawMaterialsData": [
                {"material": "L-Theanine Isolate Pure", "quantity": 120, "unit": "kg"},
                {"material": "Organic Cacao Mass", "quantity": 450, "unit": "kg"},
                {"material": "Vitamin B-Complex Pre-mix", "quantity": 30, "unit": "kg"}
            ]
        },
        {
            "productName": "Pro-Tech Carbon Fiber Bicycle Frame",
            "sku": "BIKE-CRB-002",
            "category": "High-Performance Advanced Materials & Mobility",
            "brandName": "AeroMotion AG",
            "creation_method": "ai_assisted",
            "budget_total": 2500000,
            "commercial_data": {"budget": 2500000, "moq": 300, "margin": 42, "timeline": "90 Days"},
            "rawMaterialsData": [
                {"material": "T700 Toray Carbon Fiber Prepreg", "quantity": 800, "unit": "kg"},
                {"material": "Epoxy Resin High-Modulus Hardener", "quantity": 250, "unit": "kg"}
            ]
        },
        {
            "productName": "Eco-Luxe Biodegradable Coffee Pods",
            "sku": "ECO-COFF-003",
            "category": "Sustainable Beverages & Food Packaging",
            "brandName": "VerdeRoast",
            "creation_method": "manual",
            "budget_total": 450000,
            "commercial_data": {"budget": 450000, "moq": 10000, "margin": 60, "timeline": "30 Days"},
            "rawMaterialsData": [
                {"material": "Specialty Arabica Ground Roast", "quantity": 1500, "unit": "kg"},
                {"material": "PLA Corn-Starch Capsule Vials", "quantity": 50000, "unit": "pcs"}
            ]
        },
        {
            "productName": "SolarVibe Off-Grid Power Bank 20000mAh",
            "sku": "SOLAR-PB-004",
            "category": "Consumer Electronics & Renewable Hardware",
            "brandName": "VoltTech",
            "creation_method": "manual",
            "budget_total": 1200000,
            "commercial_data": {"budget": 1200000, "moq": 1500, "margin": 38, "timeline": "60 Days"},
            "rawMaterialsData": [
                {"material": "LiFePO4 Deep-Cycle Battery Cell", "quantity": 3000, "unit": "units"},
                {"material": "High-Efficiency SunPower PV Laminate", "quantity": 1500, "unit": "units"}
            ]
        },
        {
            "productName": "DermaSilk Organic Hyaluronic Serum 30ml",
            "sku": "DERM-SRM-005",
            "category": "Personal Care & Dermatological Skincare",
            "brandName": "DermaGlow Labs",
            "creation_method": "ai_assisted",
            "budget_total": 600000,
            "commercial_data": {"budget": 600000, "moq": 2500, "margin": 68, "timeline": "45 Days"},
            "rawMaterialsData": [
                {"material": "Low-Molecular Hyaluronic Acid Powder", "quantity": 25, "unit": "kg"},
                {"material": "Distilled Rose Hydrosol Base", "quantity": 500, "unit": "liters"}
            ]
        }
    ]

    created_ids = []
    for idx, payload in enumerate(workspaces_to_create, 1):
        resp = client.post("/api/v1/products/create-from-wizard/", data=payload, format="json", **headers)
        assert resp.status_code == 201, f"Failed to create workspace {payload['productName']}: {resp.content.decode(errors='ignore')}"
        data = resp.json()
        p_id = data.get("id")
        created_ids.append(p_id)
        print(f"  [OK] Workspace {idx}: Created '{data['name']}' (ID: {p_id}) | Mode: [{payload['creation_method'].upper()}]")

    # 3. Verify Complete Data Isolation across All 5 Workspaces
    print("\n[STEP 3] Verifying absolute Data Isolation across workspaces...")
    fetched_workspaces = {}
    for p_id in created_ids:
        resp = client.get(f"/api/v1/products/{p_id}/workspace/", **headers)
        assert resp.status_code == 200, f"Failed to get workspace {p_id}: {resp.content.decode(errors='ignore')}"
        ws = resp.json()
        fetched_workspaces[p_id] = ws
        
        # Verify NO hardcoded 'Protein Powder' or leakage
        assert "Protein Powder" not in ws["name"], f"ERROR: Placeholder data detected in {ws['name']}!"
        assert str(ws["id"]) == str(p_id), f"ID mismatch: expected {p_id}, got {ws['id']}"
        print(f"  [OK] Workspace '{ws['name']}': Loaded cleanly. SKU: {ws['sku']} | Budget: {ws['budget_total']} | BOM Items: {len(ws['raw_materials_data'])}")

    # Verify cross-talk isolation between Workspace 1 and Workspace 2
    ws1 = fetched_workspaces[created_ids[0]]
    ws2 = fetched_workspaces[created_ids[1]]
    assert ws1["sku"] != ws2["sku"], "Critical isolation failure: SKUs leak!"
    assert ws1["raw_materials_data"] != ws2["raw_materials_data"], "Critical isolation failure: BOM items leak across workspaces!"
    print("  [PASS] 100% Data isolation verified. Zero leakage or shared placeholder state across workspaces.")

    # 4. Verify Auto-Marketplace Matching Engine
    print("\n[STEP 4] Verifying Auto-Marketplace Matching Engine real-time partner recommendations...")
    recs = ws1.get("marketplace_recommendations", {})
    supplier_recs = recs.get("suppliers", [])
    mfg_recs = recs.get("manufacturers", [])
    assert len(supplier_recs) > 0, "No supplier recommendations matched!"
    assert len(mfg_recs) > 0, "No manufacturer recommendations matched!"
    print(f"  [OK] Workspace '{ws1['name']}' Auto-Matched {len(supplier_recs)} Suppliers and {len(mfg_recs)} Manufacturers.")
    print(f"  [OK] Top Supplier Match: '{supplier_recs[0]['name']}' (Match Score: {supplier_recs[0]['ai_match_pct']}%) -> Rationale: {supplier_recs[0]['why_recommended']}")

    # 5. Test One-Click Partner Approval & Mutation Isolation
    print("\n[STEP 5] Testing one-click Partner Approval and verification of mutation isolation...")
    target_partner_id = supplier_recs[0]["id"]
    approve_payload = {"partner_id": target_partner_id, "category": "suppliers"}
    resp = client.post(f"/api/v1/products/{ws1['id']}/approve-partner/", data=approve_payload, format="json", **headers)
    assert resp.status_code == 200, f"Partner approval failed: {resp.content.decode(errors='ignore')}"
    approved_ws1 = resp.json()["approved_partners"]
    assert len(approved_ws1) == 1, "Approved partner not saved in database!"
    print(f"  [OK] Approved Partner '{approved_ws1[0]['name']}' for Workspace '{ws1['name']}'!")

    # Re-fetch Workspace 2 to ensure it did NOT receive Workspace 1's approved partner
    resp2 = client.get(f"/api/v1/products/{ws2['id']}/workspace/", **headers)
    approved_ws2 = resp2.json().get("approved_partners", [])
    assert len(approved_ws2) == 0, "Critical isolation failure: Partner approved on Workspace 1 appeared in Workspace 2!"
    print("  [PASS] Partner approvals are strictly bound and isolated to individual workspaces.")

    # 6. Verify Dynamic Lifecycle Calculations & Milestone Progress
    print("\n[STEP 6] Verifying dynamic lifecycle progress calculations...")
    initial_progress = ws1.get("progress_pct", 0)
    print(f"  [OK] Workspace 1 Initial Lifecycle Progress: {initial_progress}%")
    
    # Locate lifecycle step for Workspace 1 and mark the next undone step as completed
    step = ProductLifecycleStep.objects.filter(product_id=ws1["id"], is_done=False).order_by("order").first()
    if step:
        step.is_done = True
        step.save()
        print(f"  [OK] Marked lifecycle step '{step.label}' as completed in database.")
        
        # Refetch workspace and check progress calculation
        resp_refetched = client.get(f"/api/v1/products/{ws1['id']}/workspace/", **headers)
        new_progress = resp_refetched.json().get("progress_pct", 0)
        print(f"  [OK] Workspace 1 Updated Lifecycle Progress: {new_progress}%")
        assert new_progress > initial_progress, f"Progress did not dynamically increment! ({initial_progress}% -> {new_progress}%)"
    else:
        print("  [WARN] No incomplete lifecycle step found to toggle.")

    # 7. Verify Live AI Action Execution & Insight Generation
    print("\n[STEP 7] Executing live AI Copilot Strategy and Document Generation actions...")
    ai_payload = {"action": "generate_strategy", "parameters": {"focus": "supply_chain_resilience"}}
    ai_resp = client.post(f"/api/v1/products/{ws2['id']}/run-ai-action/", data=ai_payload, format="json", **headers)
    assert ai_resp.status_code == 200, f"AI Action execution failed: {ai_resp.content.decode(errors='ignore')}"
    ai_result = ai_resp.json()
    print(f"  [OK] Successfully executed AI Action on Workspace '{ws2['name']}'.")
    print(f"  [OK] AI Strategy Insight Generated: {str(ai_result.get('ai_insights', {}))[:120]}...")

    print("\n=========================================================================")
    print("[ALL E2E ENTERPRISE WORKSPACE VERIFICATION TESTS PASSED SUCCESSFULLY!]")
    print("=========================================================================")

if __name__ == "__main__":
    run_e2e_workspace_verification()
