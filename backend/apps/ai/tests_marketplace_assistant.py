from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from apps.organizations.models import Organization, Membership
from apps.marketplace.models import MarketplaceCategory, MarketplacePartner
from apps.ai.models import AIInteractionLog
from apps.ai import tools
from apps.ai.services import GeminiMarketplaceAssistant

User = get_user_model()


class AIMarketplaceAssistantTests(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Alpha Corp", slug="alpha-corp", is_active=True)
        self.other_org = Organization.objects.create(name="Beta Corp", slug="beta-corp", is_active=True)
        
        self.user = User.objects.create_user(email="test@alphacorp.com", password="password123")
        Membership.objects.create(organization=self.org, user=self.user, role="owner", is_active=True)
        
        self.cat_raw = MarketplaceCategory.objects.create(organization=self.org, name="Raw Materials", slug="raw-materials", category_code="raw_materials")
        self.cat_mfg = MarketplaceCategory.objects.create(organization=self.org, name="Manufacturers", slug="manufacturers", category_code="manufacturers")
        
        # Alpha Corp partners
        self.p1 = MarketplacePartner.objects.create(
            organization=self.org, name="WheyPro Ingredient Solutions", slug="wheypro-solutions", city="Ahmedabad", state="Gujarat",
            rating=4.9, ai_score=98, lead_time_days=7, moq_display="100 kg", status="active",
            materials_supplied=["Whey Protein", "Soy Isolate", "Vitamins"]
        )
        self.p1.categories.add(self.cat_raw)
        
        self.p2 = MarketplacePartner.objects.create(
            organization=self.org, name="BioTech Pharma Factory", slug="biotech-factory", city="Mumbai", state="Maharashtra",
            rating=4.7, ai_score=92, lead_time_days=14, moq_display="5,000 units", status="active",
            capabilities=["WHO-GMP Certified Assembly", "Tablet Compression", "Packaging"]
        )
        self.p2.categories.add(self.cat_mfg)
        
        # Beta Corp partner (Must NEVER be accessed by Alpha Corp)
        self.p3 = MarketplacePartner.objects.create(
            organization=self.other_org, name="Secret Beta Manufacturer", slug="secret-beta", city="Delhi", status="active"
        )
        self.p3.categories.add(self.cat_mfg)
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.credentials(HTTP_X_ORGANIZATION_SLUG="alpha-corp", HTTP_AUTHORIZATION="Bearer mock_token")
        # Ensure request.organization is set for unit test request emulation if needed
        self.client.defaults["HTTP_X_ORGANIZATION_SLUG"] = "alpha-corp"

    def test_tool_find_suppliers_organization_isolation(self):
        res = tools.find_suppliers(self.org, material="Whey Protein")
        self.assertEqual(res["tool_name"], "find_suppliers")
        self.assertEqual(len(res["results"]), 1)
        self.assertEqual(res["results"][0]["name"], "WheyPro Ingredient Solutions")
        
        # Beta Corp query should NOT see Alpha's partner
        res_beta = tools.find_suppliers(self.other_org, material="Whey Protein")
        self.assertEqual(len(res_beta["results"]), 0)

    def test_tool_compare_partners_and_highlights(self):
        res = tools.compare_partners(self.org, query="compare suppliers")
        self.assertIn("comparison_highlights", res)
        self.assertTrue(len(res["results"]) >= 1)

    def test_tool_generate_rfq_drafting(self):
        res = tools.generate_rfq(self.org, partner_name="WheyPro", product_spec="Whey Protein Isolate", quantity="500 kg")
        self.assertEqual(res["tool_name"], "generate_rfq")
        self.assertIn("rfq_number", res["rfq_data"])
        self.assertEqual(res["rfq_data"]["supplier_name"], "WheyPro Ingredient Solutions")

    def test_assistant_execution_and_logging(self):
        assistant = GeminiMarketplaceAssistant()
        res = assistant.execute(self.org, "Recommend GMP manufacturers in Mumbai", user=self.user)
        self.assertEqual(res["tool_called"], "recommend_partner")
        self.assertTrue(len(res["records_used"]) >= 1)
        self.assertIn("answer", res)
        
        # Verify interaction log was created in DB
        log_count = AIInteractionLog.objects.filter(organization=self.org, module="marketplace").count()
        self.assertEqual(log_count, 1)
        log_entry = AIInteractionLog.objects.first()
        self.assertEqual(log_entry.question, "Recommend GMP manufacturers in Mumbai")

    def test_api_marketplace_assistant_endpoint(self):
        response = self.client.post("/api/v1/ai/marketplace-assistant/", {
            "question": "Find whey protein suppliers in Gujarat"
        }, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["tool_called"], "find_suppliers")
        self.assertIn("answer", response.data)
