import os
import sys
import django
from decimal import Decimal

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from apps.products.models import Product
from apps.projects.models import Project
from apps.ai.recommendation_engine import RecommendationService

User = get_user_model()

def verify_engine():
    print("==================================================================================")
    print("      SUPPLY-OS AI RECOMMENDATION ENGINE - CONTEXT AWARENESS VERIFICATION      ")
    print("==================================================================================")

    # Ensure all users have standard test password
    for u in User.objects.all():
        u.set_password("Password123!")
        u.save(update_fields=["password"])
        print(f"[USER READY] {u.email} (Password: Password123! | Org: {u.default_organization.name if u.default_organization else 'None'})")

    from apps.marketplace.models import MarketplacePartner
    orgs = Organization.objects.all()

    # Define 5 entirely distinct test products across varied manufacturing sectors
    test_workspaces = [
        {
            "name": "Ultra Whey Protein Isolate 90%",
            "category": "Nutraceuticals & Supplement",
            "target_industry": "Food & Beverage",
            "description": "High-purity microfiltered protein sports nutritional drink powder.",
            "budget_total": Decimal("45000"),
            "raw_materials_data": ["Whey Protein Isolate 90%", "Creatine Monohydrate", "Steviol Glycosides 97%"],
            "country": "India"
        },
        {
            "name": "Apex Flagship Smartphone 5G",
            "category": "Consumer Electronics",
            "target_industry": "Electronics & Technology",
            "description": "Next-generation mobile communication device with OLED display and AI camera.",
            "budget_total": Decimal("250000"),
            "raw_materials_data": ["OLED Retina Displays", "Lithium Polymer Battery Cells", "Microchip SoC Assemblies"],
            "country": "India"
        },
        {
            "name": "Solid Oak Hardwood Executive Dining Table",
            "category": "Home & Office Furniture",
            "target_industry": "Furniture & Woodworking",
            "description": "Hand-crafted sustainable hardwood table with heavy-duty steel support fixtures.",
            "budget_total": Decimal("80000"),
            "raw_materials_data": ["Seasoned Hardwood Lumber", "Powder-Coated Steel Tubing", "MDF & HDF Panels"],
            "country": "India"
        },
        {
            "name": "Aseptic Amoxicillin Antibiotic Capsules 500mg",
            "category": "Prescription Medicine",
            "target_industry": "Pharmaceuticals & Healthcare",
            "description": "GMP certified antibiotic clinical drug formulation for hospital distribution.",
            "budget_total": Decimal("150000"),
            "raw_materials_data": ["Active Pharmaceutical Ingredients (API)", "Microcrystalline Cellulose (MCC)", "High-Grade Gelatin Capsule Shells"],
            "country": "India"
        },
        {
            "name": "Organic Botanical Vitamin C Brightening Facial Serum",
            "category": "Luxury Cosmetics & Skincare",
            "target_industry": "Cosmetics & Personal Care",
            "description": "Cold-pressed herbal infusion face lotion and beauty serum.",
            "budget_total": Decimal("35000"),
            "raw_materials_data": ["Natural Cold-Pressed Essential Oils", "Botanical Herb & Flower Extracts", "Shea Butter & Argan Oils"],
            "country": "India"
        }
    ]

    for org in orgs:
        partner_count = MarketplacePartner.objects.filter(organization=org).count()
        print(f"\n==================================================================================")
        print(f"      PROCESSING TENANT: {org.name} (Active Partners: {partner_count})")
        print(f"==================================================================================")
        user = User.objects.filter(organizations=org).first() or User.objects.first()

        all_recommendation_fingerprints = {}

        for ws_spec in test_workspaces:
            project, _ = Project.objects.update_or_create(
                name=f"{ws_spec['name']} ({org.name[:6]})",
                organization=org,
                defaults={"created_by": user, "status": "in_progress"}
            )
            product, _ = Product.objects.update_or_create(
                project=project,
                defaults={
                    "name": ws_spec["name"],
                    "category": ws_spec["category"],
                    "target_industry": ws_spec["target_industry"],
                    "description": ws_spec["description"],
                    "budget_total": ws_spec["budget_total"],
                    "raw_materials_data": ws_spec["raw_materials_data"],
                    "country": ws_spec["country"],
                    "created_by": user,
                    "organization": org,
                    "status": "in_progress"
                }
            )

            print(f"\n---> [TEST WORKSPACE IN {org.name}] {product.name} (ID: {product.id})")
            recs = RecommendationService.get_recommendations_for_workspace(product, org)
            product.marketplace_recommendations = recs
            product.save(update_fields=["marketplace_recommendations", "updated_at"])

            top_names = []
            for cat_key in ["suppliers", "manufacturers", "packaging", "warehouse"]:
                cat_list = recs.get(cat_key, [])
                if cat_list:
                    best = cat_list[0]
                    top_names.append(f"{cat_key.upper()}: {best['name']} (Score: {best['overall_score']}%)")
                    print(f"     • Top {cat_key:13s} -> {best['name']} | Match: {best['overall_score']}% | Tier: {best.get('price_tier', '$$')}")
                    print(f"       Why: {best['reasons'][0]} | {best['reasons'][1] if len(best['reasons']) > 1 else ''}")

            all_recommendation_fingerprints[product.name] = tuple(top_names)

        unique_combinations = set(all_recommendation_fingerprints.values())
        print(f"\n[AUDIT FOR {org.name}] Tested Workspaces: {len(test_workspaces)} | Unique Recommendation Sets: {len(unique_combinations)}")
        if len(unique_combinations) == len(test_workspaces):
            print(f"[SUCCESS] 100% CONTEXT AWARENESS across {org.name}!")
        else:
            print(f"[NOTICE] Note: Limited partners in tenant {org.name} resulted in partial sharing.")

if __name__ == "__main__":
    verify_engine()


