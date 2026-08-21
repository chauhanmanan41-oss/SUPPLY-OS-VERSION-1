import os
import sys
import django

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()


from apps.marketplace.models import MarketplacePartner, MarketplaceCategory
from apps.organizations.models import Organization

org = Organization.objects.filter(name="MAXMAN").first() or Organization.objects.first()
print(f"=== VERIFYING MARKETPLACE IMPORT FOR TENANT: {org.name} ===")

total = MarketplacePartner.objects.filter(organization=org).count()
print(f"\n[TOTAL COUNT] MarketplacePartners in org: {total}")

print("\n[CATEGORY COUNTS]")
for cat in MarketplaceCategory.objects.filter(organization=org).order_by("name"):
    cnt = cat.partners.count()
    if cnt > 0:
        print(f"  * {cat.name:24s} ({cat.category_code:15s}): {cnt} companies")

print("\n[SAMPLE RECORD INSPECTION: Nova Raw 1]")
sample_p = MarketplacePartner.objects.filter(organization=org, name="Nova Raw 1").first()
if sample_p:
    print(f"  Name:          {sample_p.name}")
    print(f"  Description:   {sample_p.description}")
    print(f"  Certifications:{sample_p.certifications}")
    print(f"  Products:      {sample_p.products_offered}")
    print(f"  Capabilities:  {sample_p.capabilities}")
    print(f"  Status/Verif:  {sample_p.status} / Verified={sample_p.verified_status}")
    print(f"  MOQ / Lead:    {sample_p.moq_display} ({sample_p.moq_number} num) / {sample_p.lead_time_days} days")
    print(f"  Rating/Rev:    {sample_p.rating} stars ({sample_p.reviews_count} reviews)")
else:
    print("  WARNING: Nova Raw 1 not found!")

print("\n[SEARCH VERIFICATION]")
# Simulate marketplace search across description, name, products, certifications
search_kw = "Whey Protein"
matches = MarketplacePartner.objects.filter(
    organization=org
).filter(
    description__icontains=search_kw
)
print(f"  Search for '{search_kw}' in descriptions: {matches.count()} companies found.")
for m in matches[:3]:
    print(f"    - {m.name} ({m.city}): {m.products_offered}")

print("\n[AI RECOMMENDATION ENGINE COMPATIBILITY]")
from apps.ai.recommendation_engine import RecommendationService
from apps.products.models import Product
prod = Product.objects.filter(organization=org, name__icontains="Protein").first() or Product.objects.filter(organization=org).first()
if prod:
    print(f"  Generating recommendations for Workspace: '{prod.name}' (Category: {prod.category})")
    recs = RecommendationService.get_recommendations_for_workspace(prod, org)
    for cat_key in ["suppliers", "manufacturers", "packaging", "warehouse"]:
        cat_list = recs.get(cat_key, [])
        if cat_list:
            best = cat_list[0]
            print(f"    * Top {cat_key:13s} -> {best['name']} (Match: {best['overall_score']}%)")
            print(f"      Reasons: {best['reasons'][0]} | {best['reasons'][1] if len(best['reasons']) > 1 else ''}")
        else:
            print(f"    * Top {cat_key:13s} -> None found")
else:
    print("  No product workspace found to test AI recommendations.")

print("\n=== VERIFICATION COMPLETE ===")

