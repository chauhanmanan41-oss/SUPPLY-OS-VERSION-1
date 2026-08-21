import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from rest_framework.test import APIClient
from apps.organizations.models import Organization, Membership
from apps.users.models import User
from apps.marketplace.models import MarketplacePartner
from apps.products.models import Product, WorkspaceSupplier, WorkspaceManufacturer, WorkspaceWarehouse, WorkspacePackaging, WorkspaceTransport, WorkspaceQualityLab, WorkspaceCertificationAgency, WorkspaceConsultant, WorkspaceMachinery

def run_pipeline_test():
    print("=" * 80)
    print("STARTING END-TO-END WORKSPACE MARKETPLACE ASSIGNMENT PIPELINE VERIFICATION")
    print("=" * 80)

    # 1. Setup Test Org, User with Membership, and Product Workspace
    product = Product.objects.first()
    if not product:
        org = Organization.objects.first() or Organization.objects.create(name="Pipeline Test Org", slug="pipeline-test-org")
        user = User.objects.first() or User.objects.create(email="tester@supplyos.io", full_name="Pipeline Tester")
        from apps.projects.models import Project
        project, _ = Project.objects.get_or_create(organization=org, name="Pipeline Test Project", defaults={"created_by": user})
        product = Product.objects.create(organization=org, project=project, name="Pipeline Verification Product Workspace", created_by=user)
    
    org = product.organization
    user = product.created_by or User.objects.first()

    # Ensure User has Membership in this Org
    Membership.objects.get_or_create(organization=org, user=user, defaults={"role": "admin"})

    client = APIClient()
    client.force_authenticate(user=user)
    headers = {"HTTP_X_ORGANIZATION_ID": str(org.id)}

    categories = [
        "raw_materials",
        "manufacturers",
        "packaging",
        "warehouses",
        "logistics",
        "quality_labs",
        "certifications",
        "consultants",
        "machinery"
    ]

    role_mapping = {
        "raw_materials": ("supplier", WorkspaceSupplier, "supplier_partner"),
        "manufacturers": ("manufacturer", WorkspaceManufacturer, "manufacturer_partner"),
        "packaging": ("packaging", WorkspacePackaging, "packaging_partner"),
        "warehouses": ("warehouse", WorkspaceWarehouse, "warehouse_partner"),
        "logistics": ("transport", WorkspaceTransport, "transport_partner"),
        "quality_labs": ("quality", WorkspaceQualityLab, "quality_partner"),
        "certifications": ("certification", WorkspaceCertificationAgency, "certification_partner"),
        "consultants": ("consultant", WorkspaceConsultant, "consultant_partner"),
        "machinery": ("machinery", WorkspaceMachinery, "machinery_partner"),
    }

    test_results = {}

    for cat_code in categories:
        print(f"\n--- Testing Category: '{cat_code}' ---")
        # Step A: Verify API Endpoint & Query Parameters for Marketplace Partner Listing
        url = f"/api/v1/marketplace/partners/?status=active&category={cat_code}"
        response = client.get(url, **headers)
        assert response.status_code == 200, f"Failed GET {url} with status {response.status_code}: {response.data}"
        
        data = response.data
        results = data.get("results", [])
        count = len(results)
        total_in_db = data.get("count", count)
        print(f"URL: {url} | Header X-Organization-Id: {org.id}")
        print(f"Category '{cat_code}' -> Returned {count} partners (total in DB for category: {total_in_db})")
        assert count > 0, f"ERROR: Category '{cat_code}' returned EMPTY results!"

        partner_1 = results[0]

        role_name, model_cls, attr_name = role_mapping[cat_code]

        # Step B: Test Workspace Partner Assignment (POST /api/v1/workspaces/{workspace_id}/{role}/)
        assign_url = f"/api/v1/workspaces/{product.id}/{role_name}/"
        assign_resp = client.post(
            assign_url,
            {"partner_id": partner_1["id"], "category": cat_code},
            format="json",
            **headers
        )
        assert assign_resp.status_code == 200, f"Assign failed for {role_name}: {assign_resp.data}"
        print(f"Assigning '{partner_1['name']}' as '{role_name}' via {assign_url} -> SUCCESS")

        # Step C: Test Refresh / Page Reload (GET /api/v1/workspaces/{workspace_id}/workspace/)
        ws_url = f"/api/v1/workspaces/{product.id}/workspace/"
        ws_resp = client.get(ws_url, **headers)
        assert ws_resp.status_code == 200
        sc_data = ws_resp.data.get("supply_chain", {})
        assigned_in_sc = sc_data.get(role_name)
        assert assigned_in_sc is not None, f"Persisted supply chain missing assigned partner for {role_name}"
        assert str(assigned_in_sc["id"]) == str(partner_1["id"]), f"Mismatched partner ID for {role_name}"
        print(f"Workspace Supply Chain retrieval for '{role_name}' -> SUCCESS (Found {assigned_in_sc['name']})")

        # Step D: Test Replacement (If 2+ partners available)
        if count >= 2:
            partner_2 = results[1]
            replace_resp = client.post(
                assign_url,
                {"partner_id": partner_2["id"], "category": cat_code},
                format="json",
                **headers
            )
            assert replace_resp.status_code == 200, f"Replace failed for {role_name}"
            
            # Verify replacement in DB & workspace endpoint
            ws_resp2 = client.get(ws_url, **headers)
            sc_data2 = ws_resp2.data.get("supply_chain", {})
            assert str(sc_data2[role_name]["id"]) == str(partner_2["id"])
            print(f"Replacing with '{partner_2['name']}' for '{role_name}' -> SUCCESS")

        # Step E: Test Removal (DELETE /api/v1/workspaces/{workspace_id}/{role}/)
        remove_resp = client.delete(assign_url, **headers)
        assert remove_resp.status_code == 200, f"Removal failed for {role_name}"

        ws_resp3 = client.get(ws_url, **headers)
        sc_data3 = ws_resp3.data.get("supply_chain", {})
        assert sc_data3.get(role_name) is None, f"Partner was not removed from supply chain"
        assert MarketplacePartner.objects.filter(id=partner_1["id"]).exists(), f"CRITICAL BUG: MarketplacePartner was deleted from directory!"
        print(f"Removing '{role_name}' assignment -> SUCCESS (Directory company preserved)")

        test_results[cat_code] = {"status": "PASSED", "count": total_in_db}

    print("\n" + "=" * 80)
    print("ALL 9 CATEGORIES PASSED END-TO-END PIPELINE VERIFICATION!")
    print("=" * 80)
    for cat, res in test_results.items():
        print(f"  - Category '{cat}': {res['status']} ({res['count']} marketplace partners available)")

if __name__ == "__main__":
    run_pipeline_test()
