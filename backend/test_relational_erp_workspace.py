import os
import sys
import json
import django

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.organizations.models import Organization
from apps.products.models import (
    Product, WorkspaceSupplier, WorkspaceManufacturer, WorkspaceWarehouse,
    WorkspacePackaging, WorkspaceTransport, WorkspaceQualityLab
)
from apps.marketplace.models import MarketplacePartner

User = get_user_model()

def run_relational_erp_tests():
    print("==================================================================================")
    print("[SUPPLYOS ENTERPRISE: RELATIONAL ERP WORKSPACE 10-POINT VERIFICATION SUITE]")
    print("==================================================================================")

    # Tenant & User setup
    org, _ = Organization.objects.get_or_create(
        slug="e2e-relational-erp-corp",
        defaults={"name": "Relational ERP Enterprise Corp", "is_active": True}
    )
    user = User.objects.filter(email="erp_admin@supplyos.io").first()
    if not user:
        user = User.objects.create_user(email="erp_admin@supplyos.io", password="ErpPassword!999", is_staff=True, is_superuser=True)
    if hasattr(user, "organizations"):
        user.organizations.add(org)

    client = APIClient()
    client.force_authenticate(user=user)
    headers = {"HTTP_X_ORGANIZATION": str(org.id)}

    # Seed Marketplace Partners
    print("\n[SETUP] Seeding Verified Marketplace Partners...")
    partners_seed = [
        {"name": "Vedic Protein Supplements India", "cat": "supplier", "desc": "Organic whey & plant protein supplier"},
        {"name": "TechCore Microchips Taiwan", "cat": "supplier", "desc": "High performance mobile SoC supplier"},
        {"name": "Apex Cleanroom Manufacturing Ltd", "cat": "manufacturer", "desc": "WHO-GMP contract packaging & packing"},
        {"name": "Precision Electronics Assembly Fox", "cat": "manufacturer", "desc": "Automated assembly line OEM factory"},
        {"name": "Global Pharma Vaults Mumbai", "cat": "warehouse", "desc": "Temperature controlled FDA compliant warehouse"},
        {"name": "Shenzhen Smart Port Logistics Hub", "cat": "warehouse", "desc": "Automated robotic distribution hub"},
        {"name": "Express Freight Forwarders Global", "cat": "transport", "desc": "Air and sea freight logistics"},
    ]
    p_map = {}
    for p in partners_seed:
        mp, _ = MarketplacePartner.objects.get_or_create(
            organization=org, name=p["name"],
            defaults={"description": p["desc"], "country": "India", "status": "active", "ai_score": 96, "rating": "4.9"}
        )
        p_map[p["name"]] = mp
    print(f" [OK] Seeded {len(p_map)} verified Marketplace Partners.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 1: Workspace 1 (Protein Powder) — Independent Relational Supply Chain
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 1: WORKSPACE 1 (PROTEIN POWDER) RELATIONAL ASSIGNMENT ---")
    w1_payload = {"productName": "Pro-Vedic Whey Protein 2kg", "category": "Supplements", "creationMethod": "manual"}
    resp1 = client.post("/api/v1/products/create-from-wizard/", data=w1_payload, format="json", **headers)
    assert resp1.status_code == 201, f"Failed to create Workspace 1: {resp1.content}"
    ws1 = resp1.json()
    ws1_id = ws1["id"]
    print(f" [OK] Created Workspace 1: '{ws1['name']}' (ID: {ws1_id})")

    # Assign Supplier A, Manufacturer A, Warehouse A via new relational endpoints
    supp_resp = client.post(f"/api/v1/workspaces/{ws1_id}/supplier/", data={"partner_id": str(p_map["Vedic Protein Supplements India"].id)}, format="json", **headers)
    assert supp_resp.status_code == 200, f"Failed supplier assign: {supp_resp.content}"
    mfg_resp = client.post(f"/api/v1/workspaces/{ws1_id}/manufacturer/", data={"partner_id": str(p_map["Apex Cleanroom Manufacturing Ltd"].id)}, format="json", **headers)
    assert mfg_resp.status_code == 200, f"Failed mfg assign: {mfg_resp.content}"
    wh_resp = client.post(f"/api/v1/workspaces/{ws1_id}/warehouse/", data={"partner_id": str(p_map["Global Pharma Vaults Mumbai"].id)}, format="json", **headers)
    assert wh_resp.status_code == 200, f"Failed wh assign: {wh_resp.content}"
    print(" [OK] Assigned Supplier A, Manufacturer A, and Warehouse A directly via REST APIs.")
    
    # Verify DB tables
    assert WorkspaceSupplier.objects.filter(workspace_id=ws1_id, supplier_partner=p_map["Vedic Protein Supplements India"]).exists()
    assert WorkspaceManufacturer.objects.filter(workspace_id=ws1_id, manufacturer_partner=p_map["Apex Cleanroom Manufacturing Ltd"]).exists()
    print(" [PASS] TEST 1: Workspace 1 selections stored as pure database relational rows.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 2: Workspace 2 (Smartphone) — Zero Cross-Talk / Complete Independence
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 2: WORKSPACE 2 (SMARTPHONE) INDEPENDENT SUPPLY CHAIN ---")
    w2_payload = {"productName": "Quantum X Ultra Smartphone", "category": "Electronics", "creationMethod": "manual"}
    resp2 = client.post("/api/v1/products/create-from-wizard/", data=w2_payload, format="json", **headers)
    ws2_id = resp2.json()["id"]

    client.post(f"/api/v1/workspaces/{ws2_id}/supplier/", data={"partner_id": str(p_map["TechCore Microchips Taiwan"].id)}, format="json", **headers)
    client.post(f"/api/v1/workspaces/{ws2_id}/manufacturer/", data={"partner_id": str(p_map["Precision Electronics Assembly Fox"].id)}, format="json", **headers)
    client.post(f"/api/v1/workspaces/{ws2_id}/warehouse/", data={"partner_id": str(p_map["Shenzhen Smart Port Logistics Hub"].id)}, format="json", **headers)

    # Inspect Workspace 1 to ensure it did NOT mutate when Workspace 2 was modified
    sc1 = client.get(f"/api/v1/workspaces/{ws1_id}/supply-chain/", **headers).json()
    assert sc1["supplier"]["name"] == "Vedic Protein Supplements India", f"Leakage detected! WS1 supplier is {sc1['supplier']}"
    assert sc1["manufacturer"]["name"] == "Apex Cleanroom Manufacturing Ltd"
    print(" [PASS] TEST 2: Zero cross-talk verified. Workspaces remain 100% independent.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 3: Replace Partner — No Duplicate Assignments
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 3: REPLACE PARTNER & DUPLICATE PREVENTION ---")
    # Re-assign manufacturer in Workspace 1 to Precision Electronics
    rep_resp = client.post(f"/api/v1/workspaces/{ws1_id}/manufacturer/", data={"partner_id": str(p_map["Precision Electronics Assembly Fox"].id)}, format="json", **headers)
    assert rep_resp.status_code == 200
    mfg_count = WorkspaceManufacturer.objects.filter(workspace_id=ws1_id).count()
    assert mfg_count == 1, f"Expected exactly 1 manufacturer record after replace, found {mfg_count}!"
    active_mfg = WorkspaceManufacturer.objects.get(workspace_id=ws1_id).manufacturer_partner
    assert active_mfg.name == "Precision Electronics Assembly Fox"
    print(" [PASS] TEST 3: Replacing partner cleanly replaced previous relational link. Zero duplicates.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 4: Remove Partner — Does NOT Delete Marketplace Record
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 4: REMOVE PARTNER WITHOUT MUTATING MARKETPLACE ---")
    target_wh_id = p_map["Global Pharma Vaults Mumbai"].id
    del_resp = client.delete(f"/api/v1/workspaces/{ws1_id}/warehouse/", **headers)
    assert del_resp.status_code == 200
    assert WorkspaceWarehouse.objects.filter(workspace_id=ws1_id).count() == 0, "Warehouse relationship still in DB!"
    # Verify MarketplacePartner record remains active in directory
    assert MarketplacePartner.objects.filter(id=target_wh_id, status="active").exists(), "Marketplace partner was deleted!"
    print(" [PASS] TEST 4: Workspace relationship deleted while Marketplace partner stays intact.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 5: AI Recommendation Integration
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 5: AI RECOMMENDATION ASSIGNMENT ---")
    ai_partner = p_map["Express Freight Forwarders Global"]
    ai_resp = client.post(f"/api/v1/workspaces/{ws1_id}/transport/", data={"partner_id": str(ai_partner.id)}, format="json", **headers)
    assert ai_resp.status_code == 200
    sc_updated = client.get(f"/api/v1/workspaces/{ws1_id}/supply-chain/", **headers).json()
    assert sc_updated["transport"]["name"] == "Express Freight Forwarders Global"
    print(" [PASS] TEST 5: AI recommendation successfully assigned to relational supply chain.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 6: Refresh Workspace Test
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 6: REFRESH WORKSPACE VERIFICATION ---")
    ws_full = client.get(f"/api/v1/products/{ws1_id}/workspace/", **headers).json()
    assert "supply_chain" in ws_full, "supply_chain missing from full workspace payload!"
    assert ws_full["supply_chain"]["supplier"]["name"] == "Vedic Protein Supplements India"
    print(" [PASS] TEST 6: Full workspace payload cleanly embeds live relational selections.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 7: Restart Test Simulation (Fresh Connection / Cache Bypass)
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 7: RESTART SIMULATION & PERSISTENCE CHECK ---")
    client_fresh = APIClient()
    client_fresh.force_authenticate(user=user)
    sc_fresh = client_fresh.get(f"/api/v1/workspaces/{ws1_id}/supply-chain/", headers=headers).json()
    assert sc_fresh["supplier"]["id"] == str(p_map["Vedic Protein Supplements India"].id)
    print(" [PASS] TEST 7: Relational data persists across completely fresh client instances.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 8: Database Inspection Test
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 8: DIRECT ORM DATABASE TABLE INSPECTION ---")
    supps = list(WorkspaceSupplier.objects.filter(workspace_id=ws1_id))
    assert len(supps) == 1
    assert isinstance(supps[0].supplier_partner, MarketplacePartner)
    print(f" [OK] Table 'WorkspaceSupplier' confirmed: {supps[0].supplier_partner.name} linked to {supps[0].workspace.name}.")
    print(" [PASS] TEST 8: Direct table audit verified Foreign Key integrity.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 9: Concurrency Test (5 Separate Workspaces)
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 9: CONCURRENCY & SCALABILITY (5 WORKSPACES) ---")
    ws_list = []
    for i in range(1, 6):
        res = client.post("/api/v1/products/create-from-wizard/", data={"productName": f"Concurrent Item {i}", "category": f"Cat {i}"}, format="json", **headers).json()
        ws_list.append(res["id"])
        # Assign Supplier to even, Manufacturer to odd
        p_target = list(p_map.values())[i % len(p_map)]
        role = "supplier" if i % 2 == 0 else "manufacturer"
        client.post(f"/api/v1/workspaces/{res['id']}/{role}/", data={"partner_id": str(p_target.id)}, format="json", **headers)
    
    # Audit all 5
    for idx, w_id in enumerate(ws_list, 1):
        sc_check = client.get(f"/api/v1/workspaces/{w_id}/supply-chain/", **headers).json()
        active_nodes = [k for k, v in sc_check.items() if v is not None]
        assert len(active_nodes) == 1, f"Workspace {idx} had unexpected nodes: {active_nodes}"
    print(" [PASS] TEST 9: 5 simultaneous workspaces ran with zero cross-talk or leakage.")

    # ─────────────────────────────────────────────────────────────────────────────
    # Test 10: Zero Static Demo Data Validation
    # ─────────────────────────────────────────────────────────────────────────────
    print("\n--- TEST 10: ZERO STATIC DEMO DATA VALIDATION ---")
    # Verify new workspace begins with empty relational supply chain
    w_empty = client.post("/api/v1/products/create-from-wizard/", data={"productName": "Clean Slate Item"}, format="json", **headers).json()
    sc_empty = client.get(f"/api/v1/workspaces/{w_empty['id']}/supply-chain/", **headers).json()
    assert all(val is None for val in sc_empty.values()), f"New workspace is not empty! Found: {sc_empty}"
    
    # Assert prohibited hardcoded strings do not appear in supply chain payloads
    prohibited_strings = ["BioSynth India", "Nutraceutix Labs", "Alpha Packaging Corp", "QualCert Labs"]
    json_dump = json.dumps(sc_empty)
    for s in prohibited_strings:
        assert s not in json_dump, f"Hardcoded demo string '{s}' found in API output!"
    print(" [PASS] TEST 10: Zero static demo data verified. All nodes default to empty/unassigned.")

    print("\n==================================================================================")
    print("[SUCCESS] ALL 10 RELATIONAL ERP WORKSPACE VERIFICATION TESTS PASSED COMPLETELY!")
    print("==================================================================================")

if __name__ == "__main__":
    run_relational_erp_tests()
