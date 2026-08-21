import os
import sys
import django
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.organizations.models import Organization
from apps.ai.services import SupplyOSCopilot

def run_verification():
    org = Organization.objects.filter(name="MAXMAN").first()
    if not org:
        org = Organization.objects.first()
    print(f"\n=======================================================")
    print(f"🚀 SUPPLY-OS ENTERPRISE AI COPILOT V2 LIVE VERIFICATION")
    print(f"Active Tenant Organization: {org.name} (ID: {org.id})")
    print(f"=======================================================\n")

    copilot = SupplyOSCopilot()

    # 1. Greeting Bypass Test
    print("---> TEST 1: Greeting & Intent Bypass (\"Hello Copilot\")")
    res1 = copilot.execute(org, "Hello Copilot, good morning!")
    print(f"   [Intent]: {res1['intent']} | [Response Type]: {res1['response_type']}")
    print(f"   [Tool Called]: {res1['tool_called']} | [Records Query]: {len(res1['records_used'])}")
    print(f"   [Execution Time]: {res1['execution_time_ms']} ms")
    assert res1['response_type'] == 'greeting', "FAILED: Greeting bypass did not activate!"
    assert res1['execution_time_ms'] < 200, f"FAILED: Greeting took too long ({res1['execution_time_ms']}ms)!"
    print("   ✅ PASSED: Instant greeting without DB/Gemini overhead.\n")

    # 2. Multi-Category Intelligence
    queries = [
        ("Find certified quality testing labs", "find_testing_labs"),
        ("Find warehousing partners", "find_warehouses"),
        ("Find logistics providers for India shipping", "find_logistics"),
        ("Search for packaging companies", "find_packaging"),
    ]
    print("---> TEST 2: Multi-Category Supply Chain Intelligence")
    for q, expected_tool in queries:
        res2 = copilot.execute(org, q)
        print(f"   • Query: \"{q}\" -> Tool: [{res2['tool_called']}] | Matches: {len(res2['records_used'])} | Model: {res2['model_version']}")
        assert res2['tool_called'] == expected_tool, f"FAILED: Expected tool {expected_tool}, got {res2['tool_called']}"
        print(f"     ✅ PASSED ({res2['execution_time_ms']} ms)")
    print()

    # 3. AI Product Builder
    print("---> TEST 3: Dedicated AI Product Architect & Builder")
    desc = "High-protein organic lactose-free whey isolate 80% chocolate flavor in 500g matte eco pouches for India fitness brands, 5000 unit MOQ budget"
    res3 = copilot.build_product(org, desc)
    print(f"   [Success]: {res3['success']} | [Model]: {res3['model_version']} | [Time]: {res3['execution_time_ms']} ms")
    p_data = res3['data']
    print(f"   [Generated Product Name]: {p_data.get('productName')}")
    print(f"   [Category & Industry]: {p_data.get('category')} ({p_data.get('industry')})")
    details = p_data.get('ai_product_details', {})
    print(f"   [Ingredients]: {details.get('ingredients')}")
    assert res3['success'] and p_data.get('productName'), "FAILED: Product Builder did not generate valid product spec!"
    print("   ✅ PASSED: Master specification and formulation synthesized.\n")

    # 4. AI Product Validator
    print("---> TEST 4: Pre-Launch Compliance & Readiness Validator")
    test_spec = {"productName": "Whey Isolate", "budget": "", "certifications": [], "category": "Nutrition & Supplements"}
    res4 = copilot.validate_product(org, test_spec)
    print(f"   [Completeness Score]: {res4['completeness_pct']}% | [Issues Found]: {len(res4['issues'])}")
    for issue in res4['issues'][:2]:
        print(f"     ⚠️ ({issue['severity']}) {issue['label']}: {issue['tip']}")
    assert res4['success'] and len(res4['issues']) > 0, "FAILED: Validator failed to catch specification gaps!"
    print("   ✅ PASSED: Compliance gaps successfully audited.\n")

    # 5. AI Procurement Planner
    print("---> TEST 5: Master Procurement & Supply Chain Roadmap Planner")
    res5 = copilot.build_procurement_plan_service(org, "Whey protein supplement packaging and distribution")
    plan = res5['plan']
    total_partners = sum(len(v) for v in plan.values())
    print(f"   [Total Recommended Partners Across Categories]: {total_partners}")
    for cat_name, p_list in plan.items():
        if p_list:
            print(f"     • {cat_name}: {len(p_list)} partner(s) found (e.g. {p_list[0]['name']})")
    print(f"   [Timeline Phases]: {len(res5['timeline'])} phases | [Identified Risks]: {len(res5['risks'])}")
    assert res5['success'] and total_partners > 0, "FAILED: Procurement Planner found zero partners!"
    print("   ✅ PASSED: End-to-end supply chain roadmap generated.\n")

    # 6. AI Document Generator
    print("---> TEST 6: Industrial Business Document Generator (BOM)")
    res6 = copilot.generate_document_service(org, "bom", "Whey Protein Isolate 80% Retail Batch")
    doc_snip = res6['content'].replace('\n', ' ')[:140]
    print(f"   [Document Type]: {res6['document_type']} | [Model]: {res6['model_version']}")
    print(f"   [Preview]: \"{doc_snip}...\"")
    assert res6['success'] and "BOM" in res6['content'] or "Bill of Materials" in res6['content'] or "MAT-" in res6['content'], "FAILED: Document generator did not synthesize valid BOM!"
    print("   ✅ PASSED: Professional industrial document generated.\n")

    print("=========================================================================")
    print("🎉 ALL 6 SUPPLYOS ENTERPRISE AI COPILOT V2 MODULES PASSED LIVE VERIFICATION!")
    print("=========================================================================\n")

if __name__ == "__main__":
    run_verification()
