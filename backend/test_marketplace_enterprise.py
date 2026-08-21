from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.organizations.models import Organization
from apps.users.models import User
from apps.marketplace.models import MarketplaceCategory, MarketplacePartner


class MarketplaceEnterpriseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org = Organization.objects.create(name="Enterprise Test Org", slug="ent-test", is_active=True)
        self.user = User.objects.create_user(email="buyer@supplyos.local", password="password123")
        self.user.organizations.add(self.org)
        self.client.force_authenticate(user=self.user)

        # Create category and partner
        self.cat_mfg = MarketplaceCategory.objects.create(
            organization=self.org, name="Manufacturers", slug="manufacturers", category_code="manufacturers", icon="🏭"
        )
        self.cat_wh = MarketplaceCategory.objects.create(
            organization=self.org, name="Warehouses", slug="warehouses", category_code="warehouses", icon="🏪"
        )

        self.partner_mfg = MarketplacePartner.objects.create(
            organization=self.org,
            name="Apex Gujarat Protein Mfg",
            city="Ahmedabad",
            state="Gujarat",
            ai_score=96,
            rating=4.90,
            quality_score=95,
            verified_status=True,
            capabilities=["GMP Tablet Pressing", "Whey Protein Formulation"],
            certifications=["WHO-GMP", "ISO 22000"],
            oem_available=True
        )
        self.partner_mfg.categories.add(self.cat_mfg)

        self.partner_wh = MarketplacePartner.objects.create(
            organization=self.org,
            name="Mumbai Port Bonded Warehouse",
            city="Mumbai",
            state="Maharashtra",
            ai_score=90,
            rating=4.70,
            quality_score=91,
            verified_status=True,
            storage_capacity_sqft=100000,
            has_cold_storage=True,
            is_bonded_warehouse=True,
            warehouse_locations=["Nhava Sheva Port, Navi Mumbai"]
        )
        self.partner_wh.categories.add(self.cat_wh)

    def test_category_filtering(self):
        url = reverse("marketplace-search") + "?category=warehouses"
        res = self.client.get(url, HTTP_X_ORGANIZATION="ent-test")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Mumbai Port Bonded Warehouse")
        self.assertEqual(results[0]["storage_capacity_sqft"], 100000)

    def test_nlp_semantic_search(self):
        # Query: "Need GMP whey protein manufacturer in Gujarat"
        url = reverse("marketplace-search") + "?q=Need+GMP+whey+protein+manufacturer+in+Gujarat"
        res = self.client.get(url, HTTP_X_ORGANIZATION="ent-test")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data["results"]
        self.assertTrue(len(results) >= 1)
        self.assertEqual(results[0]["name"], "Apex Gujarat Protein Mfg")

    def test_ai_advisor(self):
        url = reverse("marketplace-ai-advisor") + "?q=Whey+Protein&category=manufacturers"
        res = self.client.get(url, HTTP_X_ORGANIZATION="ent-test")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["advisor_status"], "optimal_match_found")
        self.assertEqual(res.data["top_recommendation"]["partner"]["name"], "Apex Gujarat Protein Mfg")
        self.assertTrue(len(res.data["supply_chain_health"]) > 0)
