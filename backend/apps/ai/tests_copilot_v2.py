from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.organizations.models import Organization, Membership
from apps.marketplace.models import MarketplaceCategory, MarketplacePartner
from apps.ai.models import AIInteractionLog
from apps.ai import tools, product_tools, procurement_tools
from apps.ai.services import SupplyOSCopilot
from apps.ai.intent import resolve_intent

User = get_user_model()


class SupplyOSCopilotV2Tests(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Alpha Corp", slug="alpha-corp", is_active=True)
        self.other_org = Organization.objects.create(name="Beta Corp", slug="beta-corp", is_active=True)

        self.user = User.objects.create_user(email="copilot_test@alphacorp.com", password="password123")
        Membership.objects.create(organization=self.org, user=self.user, role="owner", is_active=True)

        # Create categories
        self.cat_raw = MarketplaceCategory.objects.create(organization=self.org, name="Raw Materials", slug="raw-materials", category_code="raw_materials")
        self.cat_mfg = MarketplaceCategory.objects.create(organization=self.org, name="Manufacturers", slug="manufacturers", category_code="manufacturers")
        self.cat_pkg = MarketplaceCategory.objects.create(organization=self.org, name="Packaging", slug="packaging", category_code="packaging")
        self.cat_wh = MarketplaceCategory.objects.create(organization=self.org, name="Warehousing", slug="warehouses", category_code="warehouses")
        self.cat_log = MarketplaceCategory.objects.create(organization=self.org, name="Logistics", slug="logistics", category_code="logistics")
        self.cat_lab = MarketplaceCategory.objects.create(organization=self.org, name="Testing Labs", slug="testing-labs", category_code="testing_labs")

        # Create active Alpha Corp partners
        self.p_raw = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Raw Whey Supplier", slug="alpha-whey", city="Ahmedabad",
            rating=4.8, ai_score=95, lead_time_days=7, status="active", materials_supplied=["Whey Isolate", "Vitamins"]
        )
        self.p_raw.categories.add(self.cat_raw)

        self.p_mfg = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Contract Factory", slug="alpha-factory", city="Mumbai",
            rating=4.9, ai_score=98, lead_time_days=14, status="active", capabilities=["Tablet Compression", "Blending"]
        )
        self.p_mfg.categories.add(self.cat_mfg)

        self.p_pkg = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Eco Packaging", slug="alpha-eco-pkg", city="Surat",
            rating=4.6, ai_score=91, lead_time_days=10, status="active", materials_supplied=["HDPE Jar", "Pouches"]
        )
        self.p_pkg.categories.add(self.cat_pkg)

        self.p_wh = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Central Warehouse", slug="alpha-wh", city="Bhiwandi",
            rating=4.7, ai_score=90, status="active"
        )
        self.p_wh.categories.add(self.cat_wh)

        self.p_log = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Express Logistics", slug="alpha-log", city="Mumbai",
            rating=4.5, ai_score=89, status="active"
        )
        self.p_log.categories.add(self.cat_log)

        self.p_lab = MarketplacePartner.objects.create(
            organization=self.org, name="Alpha Quality Lab", slug="alpha-lab", city="Ahmedabad",
            rating=4.9, ai_score=97, status="active", certifications=["NABL", "ISO 17025"]
        )
        self.p_lab.categories.add(self.cat_lab)

        # Beta Corp partner (Must never leak to Alpha Corp)
        self.p_beta_lab = MarketplacePartner.objects.create(
            organization=self.other_org, name="Beta Secret Lab", slug="beta-lab", city="Delhi", status="active"
        )

        # Setup API Client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.defaults["HTTP_X_ORGANIZATION_SLUG"] = "alpha-corp"

    def test_intent_resolution_and_greeting_bypass(self):
        # Greeting should resolve to greeting intent and zero DB calls in execute
        intent_res = resolve_intent("Hello there!", {})
        self.assertEqual(intent_res["intent"], "greeting")

        copilot = SupplyOSCopilot()
        res = copilot.execute(self.org, "Good morning AI Copilot", user=self.user)
        self.assertEqual(res["response_type"], "greeting")
        self.assertEqual(res["tool_called"], None)
        self.assertEqual(len(res["records_used"]), 0)

    def test_category_tools_and_tenant_isolation(self):
        # Check packaging tool
        pkg_res = tools.find_packaging(self.org)
        self.assertEqual(len(pkg_res["results"]), 1)
        self.assertEqual(pkg_res["results"][0]["name"], "Alpha Eco Packaging")

        # Check warehouses tool
        wh_res = tools.find_warehouses(self.org)
        self.assertEqual(len(wh_res["results"]), 1)
        self.assertEqual(wh_res["results"][0]["name"], "Alpha Central Warehouse")

        # Check logistics tool
        log_res = tools.find_logistics(self.org)
        self.assertEqual(len(log_res["results"]), 1)
        self.assertEqual(log_res["results"][0]["name"], "Alpha Express Logistics")

        # Check testing labs tool and isolation
        lab_res = tools.find_testing_labs(self.org)
        self.assertEqual(len(lab_res["results"]), 1)
        self.assertEqual(lab_res["results"][0]["name"], "Alpha Quality Lab")

        beta_lab_res = tools.find_testing_labs(self.other_org)
        self.assertEqual(len(beta_lab_res["results"]), 0)  # Because Beta secret lab didn't get added to a category with category_code 'testing_labs' in Beta Corp!

    def test_product_builder_service(self):
        copilot = SupplyOSCopilot()
        res = copilot.build_product(self.org, "High protein whey isolate 80% chocolate flavor in 500g pouch", user=self.user)
        self.assertTrue(res["success"])
        self.assertIn("data", res)
        self.assertIn("productName", res["data"])
        self.assertIn("ai_product_details", res["data"])

    def test_product_validator_service(self):
        copilot = SupplyOSCopilot()
        # Incomplete data should generate warnings/errors
        incomplete_data = {"productName": "Test Whey", "budget": "", "certifications": []}
        res = copilot.validate_product(self.org, incomplete_data, user=self.user)
        self.assertTrue(res["success"])
        self.assertLess(res["completeness_pct"], 100)
        self.assertGreater(len(res["issues"]), 0)
        self.assertIn("ai_commentary", res)

    def test_procurement_planner_service(self):
        copilot = SupplyOSCopilot()
        res = copilot.build_procurement_plan_service(self.org, "Whey protein supplement production", user=self.user)
        self.assertTrue(res["success"])
        self.assertIn("plan", res)
        self.assertIn("timeline", res)
        self.assertIn("risks", res)
        # Should have found our Alpha raw supplier and manufacturer
        self.assertGreater(len(res["plan"]["raw_material_suppliers"]), 0)
        self.assertGreater(len(res["plan"]["manufacturers"]), 0)

    def test_document_generator_service(self):
        copilot = SupplyOSCopilot()
        res = copilot.generate_document_service(self.org, doc_type="bom", description="Whey Protein Batch", user=self.user)
        self.assertTrue(res["success"])
        self.assertEqual(res["document_type"], "bom")
        self.assertIn("Bill of Materials", res["content"])

    def test_v2_api_endpoints(self):
        # 1. Copilot general endpoint
        response = self.client.post("/api/v1/ai/copilot/", {"question": "Find warehouses in Mumbai"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["tool_called"], "find_warehouses")

        # 2. Product builder endpoint
        response = self.client.post("/api/v1/ai/product-builder/", {"description": "Organic multivitamin gummy for kids"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])

        # 3. Product validator endpoint
        response = self.client.post("/api/v1/ai/product-validator/", {"product_data": {"productName": "Gummy", "category": "Nutrition"}})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])

        # 4. Procurement planner endpoint
        response = self.client.post("/api/v1/ai/procurement-planner/", {"description": "Multivitamin production"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("timeline", response.data)

        # 5. Document generator endpoint
        response = self.client.post("/api/v1/ai/generate-document/", {"doc_type": "spec_sheet", "description": "Gummy Specs"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["document_type"], "spec_sheet")

        # Ensure logs were recorded
        logs = AIInteractionLog.objects.filter(organization=self.org)
        self.assertGreaterEqual(logs.count(), 5)
