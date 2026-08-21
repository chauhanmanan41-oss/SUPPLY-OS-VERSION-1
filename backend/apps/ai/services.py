"""
SupplyOS AI Copilot V2 — Service Layer.

The central orchestrator for all AI operations in SupplyOS.
Routes user requests through: Intent Detection → Entity Extraction → Tool Selection
→ Organization-Scoped DB Query → Business Logic → Gemini Reasoning → Structured Response.

Supports modules: marketplace, products, procurement, documents, copilot.
"""
import os
import json
import time
import urllib.request
import urllib.error
from abc import ABC, abstractmethod
from django.conf import settings

from .models import AIInteractionLog
from .intent import resolve_intent, resolve_marketplace_intent
from .prompts import build_gemini_prompt, build_greeting_response, build_farewell_response, get_system_prompt
from . import tools
from . import product_tools
from . import procurement_tools


# ─── Abstract AI Service (preserved for backward compat) ──────────────────────

class AIService(ABC):
    @abstractmethod
    def generate_blueprint(self, wizard_inputs: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def recommend_suppliers(self, material: str, context: dict) -> list:
        raise NotImplementedError

    @abstractmethod
    def recommend_manufacturers(self, product_context: dict) -> list:
        raise NotImplementedError

    @abstractmethod
    def estimate_cost(self, blueprint_context: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def forecast_demand(self, historical_data: list) -> dict:
        raise NotImplementedError

    @abstractmethod
    def draft_purchase_order(self, rfq_context: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def ask(self, question: str, context: dict) -> str:
        raise NotImplementedError


class RuleBasedAIService(AIService):
    """Deterministic, dependency-free fallback provider."""
    def generate_blueprint(self, wizard_inputs: dict) -> dict:
        category = wizard_inputs.get("category", "General")
        name = wizard_inputs.get("product_name", "New Product")
        budget = wizard_inputs.get("budget", "")
        return {
            "manufacturing_process": f"Standard {category.lower()} manufacturing process for '{name}'.",
            "raw_materials": [{"name": "Primary material", "quantity": 100, "unit": "kg", "est_cost": 500}],
            "machinery_required": ["Mixing line", "Packaging line", "QC equipment"],
            "packaging_notes": "Standard retail packaging with tamper-evident seal.",
            "estimated_cost": self._parse_budget(budget) or 5000,
            "certifications_needed": ["ISO 9001"],
            "complexity": "medium",
            "production_timeline_days": 30,
            "suggested_manufacturer_tags": [category.lower(), "contract manufacturing"],
            "suggested_supplier_tags": [category.lower(), "bulk supplier"],
            "raw": {"provider": "rule_based", "inputs": wizard_inputs},
        }

    def recommend_suppliers(self, material, context):
        return [{"reason": f"Matches material '{material}'", "tags": [material]}]

    def recommend_manufacturers(self, product_context):
        return [{"reason": "Matches product category", "tags": [product_context.get("category", "")]}]

    def estimate_cost(self, blueprint_context):
        mc = sum(m.get("est_cost", 0) for m in blueprint_context.get("raw_materials", []))
        return {"estimated_total": mc * 1.3, "breakdown": {"materials": mc, "overhead_pct": 30}}

    def forecast_demand(self, historical_data):
        if not historical_data:
            return {"forecast": [], "confidence": 0.0}
        avg = sum(historical_data) / len(historical_data)
        return {"forecast": [round(avg, 2)] * 3, "confidence": 0.5}

    def draft_purchase_order(self, rfq_context):
        return {"supplier": rfq_context.get("supplier_id"), "line_items": rfq_context.get("line_items", []),
                "notes": "Auto-drafted. Review before sending."}

    def ask(self, question, context):
        return f"(rule-based) Based on the data provided, here is what is available for: \"{question}\""

    @staticmethod
    def _parse_budget(budget):
        if not budget:
            return None
        digits = "".join(c for c in str(budget) if c.isdigit())
        return int(digits) if digits else None


def get_ai_service() -> AIService:
    provider = os.environ.get("AI_PROVIDER", "rule_based")
    if provider == "rule_based":
        return RuleBasedAIService()
    raise ValueError(f"Unknown AI_PROVIDER '{provider}'")


# ─── Tool Registry ─────────────────────────────────────────────────────────────

TOOL_REGISTRY = {
    # Marketplace tools
    "find_suppliers": lambda org, **kw: tools.find_suppliers(org, **kw),
    "find_manufacturers": lambda org, **kw: tools.find_manufacturers(org, **kw),
    "find_packaging": lambda org, **kw: tools.find_packaging(org, **kw),
    "find_warehouses": lambda org, **kw: tools.find_warehouses(org, **kw),
    "find_logistics": lambda org, **kw: tools.find_logistics(org, **kw),
    "find_testing_labs": lambda org, **kw: tools.find_testing_labs(org, **kw),
    "find_certification_agencies": lambda org, **kw: tools.find_certification_agencies(org, **kw),
    "find_consultants": lambda org, **kw: tools.find_consultants(org, **kw),
    "find_machinery": lambda org, **kw: tools.find_machinery(org, **kw),
    "find_import_export": lambda org, **kw: tools.find_import_export(org, **kw),
    "compare_partners": lambda org, **kw: tools.compare_partners(org, **kw),
    "generate_rfq": lambda org, **kw: tools.generate_rfq(org, **kw),
    "search_marketplace": lambda org, **kw: tools.search_marketplace(org, **kw),
    "recommend_partner": lambda org, **kw: tools.recommend_partner(org, **kw),
    # Product tools
    "ai_generate_product": lambda org, **kw: product_tools.ai_generate_product(org, **kw),
    "ai_validate_product": lambda org, **kw: product_tools.ai_validate_product(org, **kw),
    "ai_recommend_partners_for_product": lambda org, **kw: product_tools.ai_recommend_partners_for_product(org, **kw),
    # Procurement tools
    "ai_build_procurement_plan": lambda org, **kw: procurement_tools.ai_build_procurement_plan(org, **kw),
    "ai_generate_document": lambda org, **kw: procurement_tools.ai_generate_document(org, **kw),
}

# Intent → response_type mapping for frontend rendering
RESPONSE_TYPE_MAP = {
    "greeting": "greeting",
    "farewell": "farewell",
    "supplier_search": "partners",
    "manufacturer_search": "partners",
    "packaging_search": "partners",
    "warehouse_search": "partners",
    "logistics_search": "partners",
    "testing_lab_search": "partners",
    "certification_search": "partners",
    "consultant_search": "partners",
    "machinery_search": "partners",
    "import_export_search": "partners",
    "marketplace_search": "partners",
    "comparison": "comparison",
    "rfq_generation": "rfq",
    "recommendation": "recommendation",
    "product_create": "product_spec",
    "product_validate": "validation",
    "procurement_plan": "procurement_plan",
    "bom_generation": "document",
    "spec_generation": "document",
    "document_generation": "document",
}


# ─── SupplyOS Copilot V2 ──────────────────────────────────────────────────────

class SupplyOSCopilot:
    """
    The unified AI Copilot for SupplyOS V2.
    Handles all modules: marketplace, products, procurement, documents.
    """

    def execute(self, org, question: str, context: dict = None, user=None, module: str = "copilot") -> dict:
        """
        Main execution pipeline:
        1. Intent Detection & Entity Extraction
        2. Greeting/Farewell bypass (no DB, no Gemini)
        3. Tool Selection & Execution (org-scoped DB query)
        4. Gemini Reasoning (with DB context)
        5. Structured UI Response
        """
        start_time = time.time()
        context = context or {}

        # Step 1: Intent Detection
        intent_result = resolve_intent(question, context)
        intent = intent_result["intent"]
        tool_name = intent_result["tool_name"]
        kwargs = intent_result["kwargs"]
        entities = intent_result["entities"]
        response_type = RESPONSE_TYPE_MAP.get(intent, "text")

        # Step 2: Greeting/Farewell bypass — zero DB queries, zero Gemini calls
        if intent == "greeting":
            elapsed = round((time.time() - start_time) * 1000)
            self._log_interaction(org, user, module, question, build_greeting_response(), tool_name, 0, elapsed, "")
            return {
                "answer": build_greeting_response(),
                "tool_called": None,
                "records_used": [],
                "response_type": "greeting",
                "intent": intent,
                "entities": entities,
                "execution_time_ms": elapsed,
                "model_version": "deterministic",
                "suggested_follow_ups": [
                    "Find raw material suppliers",
                    "Compare top manufacturers",
                    "Recommend packaging suppliers",
                    "Build a procurement plan for whey protein",
                ],
            }

        if intent == "farewell":
            elapsed = round((time.time() - start_time) * 1000)
            return {
                "answer": build_farewell_response(),
                "tool_called": None,
                "records_used": [],
                "response_type": "farewell",
                "intent": intent,
                "entities": entities,
                "execution_time_ms": elapsed,
                "model_version": "deterministic",
                "suggested_follow_ups": [],
            }

        # Step 3: Tool Execution (org-scoped DB query)
        tool_func = TOOL_REGISTRY.get(tool_name)
        if not tool_func:
            tool_func = TOOL_REGISTRY["search_marketplace"]
            tool_name = "search_marketplace"

        try:
            tool_output = tool_func(org, **kwargs)
        except Exception as e:
            elapsed = round((time.time() - start_time) * 1000)
            error_msg = f"Tool execution error: {str(e)}"
            self._log_interaction(org, user, module, question, error_msg, tool_name, 0, elapsed, error_msg)
            return {
                "answer": f"I encountered an error while processing your request. Please try again.\n\n*Error: {str(e)}*",
                "tool_called": tool_name,
                "records_used": [],
                "response_type": "error",
                "intent": intent,
                "entities": entities,
                "execution_time_ms": elapsed,
                "model_version": "error",
                "suggested_follow_ups": [],
            }

        results = tool_output.get("results", [])

        # Debug logging
        print(f"Tool: {tool_name}")
        print(f"Results: {len(results)}")
        if results:
            print(results[:2])

        # Step 4: Generate response
        if len(results) == 0 and intent not in ("greeting", "farewell"):
            answer = self._generate_empty_response(intent, question, entities)
            model_version = "deterministic-empty"
        else:
            answer, model_version = self._generate_ai_response(
                org, question, tool_name, tool_output, intent, entities
            )

        elapsed = round((time.time() - start_time) * 1000)

        # Build response with extra data for frontend rendering
        response = {
            "answer": answer,
            "tool_called": tool_name,
            "records_used": results,
            "response_type": response_type,
            "intent": intent,
            "entities": entities,
            "execution_time_ms": elapsed,
            "model_version": model_version,
            "suggested_follow_ups": self._generate_follow_ups(intent, entities),
        }

        # Add tool-specific extras
        if "comparison_highlights" in tool_output:
            response["comparison_data"] = tool_output["comparison_highlights"]
        if "rfq_data" in tool_output:
            response["rfq_data"] = tool_output["rfq_data"]
        if "recommendations" in tool_output:
            response["recommendations"] = tool_output.get("recommendations")
        if "plan" in tool_output:
            response["plan"] = tool_output["plan"]
            response["timeline"] = tool_output.get("timeline")
            response["risks"] = tool_output.get("risks")
        if "issues" in tool_output:
            response["issues"] = tool_output["issues"]
            response["suggestions"] = tool_output.get("suggestions")
            response["completeness_pct"] = tool_output.get("completeness_pct")

        # Step 5: Log interaction
        self._log_interaction(org, user, module, question, answer[:500], tool_name, len(results), elapsed, model_version)

        return response

    def build_product(self, org, description: str, user=None) -> dict:
        """Dedicated AI Product Builder endpoint logic."""
        start_time = time.time()
        tool_output = product_tools.ai_generate_product(org, description)
        prompt = build_gemini_prompt(description, "ai_generate_product", tool_output, org.name, "product_create")
        gemini_res = self._call_gemini_api(prompt)
        model_version = "deterministic-rule-fallback"
        json_data = None

        if gemini_res:
            try:
                clean_text = gemini_res.strip()
                if "```json" in clean_text:
                    clean_text = clean_text.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_text:
                    clean_text = clean_text.split("```")[1].split("```")[0].strip()
                json_data = json.loads(clean_text)
                model_version = settings.GEMINI_MODEL
            except Exception as e:
                print(f"Failed to parse Gemini product JSON: {e}")

        if not json_data or not isinstance(json_data, dict):
            words = description.split()
            json_data = {
                "productName": words[0].capitalize() + " Pro" if words else "New Industrial Product",
                "brandName": org.name + " Brand",
                "category": "Nutrition & Supplements" if any(k in description.lower() for k in ["whey", "protein", "vitamin", "supplement", "nutrition"]) else "Industrial",
                "industry": "FMCG" if any(k in description.lower() for k in ["whey", "food", "snack", "beverage", "protein"]) else "Manufacturing",
                "description": description,
                "targetCountry": "India",
                "businessModel": "contract",
                "budget": "500000",
                "monthlyProduction": "5000",
                "productionUnit": "units",
                "launchTimeline": "3 months",
                "certifications": ["FSSAI", "WHO-GMP", "ISO 9001:2015"],
                "rawMaterials": description,
                "packagingType": "HDPE Jar & Moisture-Proof Seal",
                "storageConditions": "Ambient",
                "ai_product_details": {
                    "ingredients": ["Primary Active Ingredient (80%)", "Excipients & Stabilizers (15%)", "Flavors & Preservatives (5%)"],
                    "formula_draft": f"Standardized formulation grade for {description[:50]}.",
                    "manufacturing_process": "Raw material batch testing -> Controlled industrial mixing -> Automated filling and vacuum sealing -> Quality control audit -> Boxing and shipment.",
                    "manufacturing_steps": ["1. Intake QC inspection", "2. Blending & processing", "3. Automated filling", "4. Sealing & packaging", "5. Final CoA verification"],
                    "shelf_life": "24 months from manufacturing date under recommended storage.",
                    "quality_standards": ["ISO 22000", "GMP compliance"],
                    "testing_requirements": ["Microbial load analysis", "Heavy metals screening", "Active assay testing"],
                    "target_audience": "Commercial distribution & institutional consumers.",
                    "marketing_description": f"High-performance {description} engineered with verifiable quality standards and dependable supply chain traceability.",
                    "keywords": [w for w in description.lower().split() if len(w) > 3][:5] or ["quality", "industrial", "certified"],
                    "suggested_certifications": ["FSSAI", "ISO 9001"],
                    "business_notes": "Recommend dual-sourcing critical raw materials and initiating testing lab verification 45 days prior to product rollout."
                }
            }

        elapsed = round((time.time() - start_time) * 1000)
        self._log_interaction(org, user, "product_builder", description, json.dumps(json_data)[:2000], "ai_generate_product", 1, elapsed, model_version)
        return {
            "success": True,
            "data": json_data,
            "execution_time_ms": elapsed,
            "model_version": model_version
        }

    def validate_product(self, org, product_data: dict, user=None) -> dict:
        """Dedicated AI Product Validator endpoint logic."""
        start_time = time.time()
        tool_output = product_tools.ai_validate_product(org, product_data)
        prompt = build_gemini_prompt(json.dumps(product_data), "ai_validate_product", tool_output, org.name, "product_validate")
        gemini_res = self._call_gemini_api(prompt)
        model_version = settings.GEMINI_MODEL if gemini_res else "deterministic"

        ai_commentary = gemini_res or (
            "### 🛡️ AI Compliance Audit\nWe evaluated your configuration against regulatory mandates and manufacturing norms:\n\n"
            + "\n".join([f"* **{issue['label']}:** {issue['tip']}" for issue in tool_output.get("issues", [])])
            if tool_output.get("issues") else "✅ **Fully Compliant:** All mandatory specifications and supply chain identifiers have been satisfied."
        )

        elapsed = round((time.time() - start_time) * 1000)
        self._log_interaction(org, user, "product_validator", str(product_data.get("productName", "")), ai_commentary[:2000], "ai_validate_product", 1, elapsed, model_version)
        return {
            "success": True,
            "completeness_pct": tool_output.get("completeness_pct", 0),
            "issues": tool_output.get("issues", []),
            "suggestions": tool_output.get("suggestions", []),
            "ai_commentary": ai_commentary,
            "execution_time_ms": elapsed,
            "model_version": model_version
        }

    def build_procurement_plan_service(self, org, description: str, user=None) -> dict:
        """Dedicated AI Procurement Planner endpoint logic."""
        start_time = time.time()
        tool_output = procurement_tools.ai_build_procurement_plan(org, description)
        prompt = build_gemini_prompt(description, "ai_build_procurement_plan", tool_output, org.name, "procurement_plan")
        gemini_res = self._call_gemini_api(prompt)
        model_version = settings.GEMINI_MODEL if gemini_res else "deterministic"

        commentary = gemini_res or self._generate_deterministic_response("ai_build_procurement_plan", tool_output, "procurement_plan", description)

        elapsed = round((time.time() - start_time) * 1000)
        self._log_interaction(org, user, "procurement_planner", description, commentary[:2000], "ai_build_procurement_plan", tool_output.get("total_matches", 0), elapsed, model_version)
        return {
            "success": True,
            "plan": tool_output["plan"],
            "timeline": tool_output["timeline"],
            "risks": tool_output["risks"],
            "ai_commentary": commentary,
            "execution_time_ms": elapsed,
            "model_version": model_version
        }

    def generate_document_service(self, org, doc_type: str, description: str = "", context: dict = None, user=None) -> dict:
        """Dedicated AI Document Generator endpoint logic."""
        start_time = time.time()
        tool_output = procurement_tools.ai_generate_document(org, doc_type, description, context)
        prompt = build_gemini_prompt(f"Generate {doc_type} for {description}", "ai_generate_document", tool_output, org.name, "document_generation")
        gemini_res = self._call_gemini_api(prompt)
        model_version = settings.GEMINI_MODEL if gemini_res else "deterministic"

        if gemini_res:
            doc_content = gemini_res
        else:
            if doc_type == "bom":
                doc_content = f"""# 📦 Bill of Materials (BOM)\n**Project/Item:** {description or 'Industrial Product'}\n**Organization:** {org.name}\n\n| Item Code | Description | Qty | Unit | Supplier Cat |\n|---|---|---|---|---|\n| MAT-01 | Primary Active Ingredient | 100.0 | kg | Raw Material |\n| MAT-02 | Secondary Stabilizing Excipients | 15.0 | kg | Raw Material |\n| PKG-01 | HDPE Retail Container (500g) | 1000 | pcs | Packaging |\n| PKG-02 | Moisture-Evac Foil Seal | 1000 | pcs | Packaging |\n\n*Auto-generated from SupplyOS Master Data directory.*"""
            elif doc_type == "spec_sheet":
                doc_content = f"""# 📄 Technical Product Specification (TPS)\n**Product Name:** {description or 'General Spec'}\n**Entity:** {org.name}\n\n### 1. General Characteristics\n* **Appearance:** Free-flowing homogeneous composition.\n* **Storage Requirement:** Ambient temperatures (<25°C, <60% RH).\n* **Shelf Life:** 24 Months.\n\n### 2. Regulatory Compliance\n* Complies with food-grade / industrial safety guidelines.\n* Requires CoA inspection per delivery batch."""
            elif doc_type == "quality_checklist":
                doc_content = f"""# 🧪 Quality Assurance & QC Checklist\n**Target Audit:** {description or 'Production Batch'}\n\n- [ ] Pre-production machinery sanitize & calibration verification\n- [ ] Raw material COA match with lab specifications\n- [ ] In-process weight variation & sealing leak test\n- [ ] Finished good packaging integrity inspection\n- [ ] NABL lab samples archived for stability testing"""
            elif doc_type == "coa_draft":
                doc_content = f"""# 📜 Certificate of Analysis (CoA) - Template\n**Product Name:** {description or 'Industrial Grade Compound'}\n**Batch Number:** BATCH-{time.strftime('%Y%m')}-001\n**Organization:** {org.name}\n\n| Test Parameter | Standard Specification | Result | Compliance |\n|---|---|---|---|\n| Appearance | Conforming standard | Complies | PASS |\n| Assay (%) | NLT 98.5% | 99.1% | PASS |\n| Heavy Metals | < 10 ppm | < 2 ppm | PASS |\n| Moisture Content| < 2.0% | 0.8% | PASS |\n\n**Authorized Signatory:** QA Head, SupplyOS Quality Division"""
            else:
                doc_content = f"""# 📋 Structured Business Document ({doc_type})\n**Organization:** {org.name}\n**Subject:** {description}\n\nDocument synthesized from verified organizational operational variables."""

        elapsed = round((time.time() - start_time) * 1000)
        self._log_interaction(org, user, "document_generator", f"{doc_type}: {description}", doc_content[:2000], "ai_generate_document", 1, elapsed, model_version)
        return {
            "success": True,
            "document_type": doc_type,
            "content": doc_content,
            "execution_time_ms": elapsed,
            "model_version": model_version
        }

    def _generate_ai_response(self, org, question, tool_name, tool_output, intent, entities):
        """Generate response using Gemini API with fallback to deterministic."""
        try:
            prompt = build_gemini_prompt(
                user_question=question,
                tool_name=tool_name,
                tool_output=tool_output,
                org_name=org.name,
                intent=intent,
            )
            gemini_answer = self._call_gemini_api(prompt)
            if gemini_answer:
                return gemini_answer, settings.GEMINI_MODEL
        except Exception as e:
            print(f"Gemini API error: {e}")

        # Deterministic fallback
        answer = self._generate_deterministic_response(tool_name, tool_output, intent, question)
        return answer, "deterministic-rule-fallback"

    def _call_gemini_api(self, prompt: str) -> str:
        """Call Google Gemini API via REST."""
        api_key = settings.GEMINI_API_KEY
        model = settings.GEMINI_MODEL or "gemini-3.6-flash"

        if not api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "maxOutputTokens": 2048,
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                body = json.loads(resp.read().decode("utf-8"))
                candidates = body.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            print(f"Gemini API HTTP Error {e.code}: {e.reason} -> {err_body}")
        except (urllib.error.URLError, TimeoutError) as e:
            print(f"Gemini API connection error: {e}")
        except json.JSONDecodeError:
            print("Gemini API returned non-JSON response")

        return None

    def _generate_deterministic_response(self, tool_name, tool_output, intent, question):
        """Generate a structured deterministic response from tool output."""
        results = tool_output.get("results", [])

        if not results:
            return self._generate_empty_response(intent, question, {})

        # Comparison
        if tool_name == "compare_partners":
            highlights = tool_output.get("comparison_highlights", {})
            lines = [f"### \u2696\ufe0f Enterprise Partner Comparison",
                     f"We compared the top matching enterprises currently registered in your organization's directory:\n"]
            for i, p in enumerate(results, 1):
                lines.append(f"#### {i}. **{p['name']}** ({p.get('location', 'India')})")
                lines.append(f"* **Rating & AI Score:** {p.get('rating', 'N/A')}\u2605 | **AI Match:** {p.get('ai_score', 'N/A')}%")
                lines.append(f"* **Lead Time & MOQ:** {p.get('lead_time_days', 'N/A')} business days | **MOQ:** {p.get('moq', 'N/A')}")
                if p.get("certifications"):
                    lines.append(f"* **Certifications:** {', '.join(p['certifications'])}")
                if p.get("capabilities"):
                    lines.append(f"* **Capabilities:** {', '.join(p['capabilities'])}")
                lines.append("")
            if highlights:
                lines.append(f"> **Fastest:** {highlights.get('fastest_lead_time', 'N/A')} | **Highest Rated:** {highlights.get('highest_rating', 'N/A')}")
            return "\n".join(lines)

        # RFQ
        if tool_name == "generate_rfq":
            rfq = tool_output.get("rfq_data", {})
            return f"""### \U0001f4cb Request for Quotation (RFQ)

| Field | Value |
|-------|-------|
| **RFQ Number** | {rfq.get('rfq_number', 'N/A')} |
| **Buyer** | {rfq.get('buyer_organization', 'N/A')} |
| **Supplier** | {rfq.get('supplier_name', 'N/A')} |
| **Location** | {rfq.get('supplier_location', 'N/A')} |
| **Item** | {rfq.get('target_item', 'N/A')} |
| **Quantity** | {rfq.get('requested_quantity', 'N/A')} |
| **Lead Time** | {rfq.get('target_lead_time', 'N/A')} |
| **Payment** | {rfq.get('payment_terms', 'N/A')} |
| **Validity** | {rfq.get('validity_days', 30)} days |

**Required Certifications:** {', '.join(rfq.get('required_certifications', []))}

**Compliance:** {rfq.get('compliance_notes', '')}"""

        # Recommendation
        if tool_name == "recommend_partner" and tool_output.get("top_match"):
            top = tool_output["top_match"]
            p = top["partner"]
            reasons = top.get("recommendation_reasons", [])
            lines = [f"### \u2b50 Top Recommended Partner: **{p['name']}**\n",
                     f"Located in **{p.get('location', 'India')}**, this partner holds an AI Match Confidence of **{p.get('ai_score', 'N/A')}%** with a buyer rating of **{p.get('rating', 'N/A')}\u2605**.\n",
                     f"#### Why This Partner is Recommended:"]
            for r in reasons:
                lines.append(f"* {r}")
            return "\n".join(lines)

        # Procurement Plan
        if tool_name == "ai_build_procurement_plan" and results:
            plan_data = results[0]
            plan = plan_data.get("plan", {})
            timeline = plan_data.get("timeline", [])
            risks = plan_data.get("risks", [])

            lines = [f"### \U0001f4ca AI Procurement Plan\n"]
            for cat_key, cat_label in [
                ("raw_material_suppliers", "Raw Material Suppliers"),
                ("manufacturers", "Manufacturers"),
                ("packaging_companies", "Packaging Companies"),
                ("warehouses", "Warehouses"),
                ("logistics_providers", "Logistics Providers"),
                ("testing_labs", "Quality Testing Labs"),
                ("certification_agencies", "Certification Agencies"),
            ]:
                partners = plan.get(cat_key, [])
                if partners:
                    lines.append(f"\n#### {cat_label}")
                    for p in partners[:3]:
                        lines.append(f"* **{p['name']}** ({p.get('location', 'India')}) — {p.get('rating', 'N/A')}\u2605, {p.get('lead_time_days', 'N/A')} days lead time")

            if timeline:
                lines.append(f"\n#### \u23f1\ufe0f Estimated Timeline")
                for phase in timeline:
                    lines.append(f"* **{phase['phase']}:** {phase['weeks']} weeks")

            if risks:
                lines.append(f"\n#### \u26a0\ufe0f Risk Assessment")
                for risk in risks[:5]:
                    sev = risk.get("severity", "low").upper()
                    lines.append(f"* [{sev}] {risk['risk']} — *{risk.get('mitigation', '')}*")

            return "\n".join(lines)

        # Default partner list
        lines = [f"### \U0001f50d Matching Industrial Partners",
                 f"Based on your organization's verified directory, here are the top matching enterprises:\n"]
        for p in results:
            lines.append(f"* **{p['name']}** ({p.get('location', 'India')}) \u2014 **{p.get('rating', 'N/A')}\u2605** (AI Confidence: {p.get('ai_score', 'N/A')}%)")
            lines.append(f"  * *Lead Time:* {p.get('lead_time_days', 'N/A')} days | *MOQ:* {p.get('moq', 'N/A')}")
            if p.get("certifications"):
                lines.append(f"  * *Certifications:* {', '.join(p['certifications'])}")
        return "\n".join(lines)

    def _generate_empty_response(self, intent, question, entities):
        """Response when no matching records found."""
        return f"### No Matching Records Found\n\nI searched your organization's verified directory but found no partners matching your query: *\"{question}\"*.\n\nTry:\n* Broadening your search terms\n* Checking a different category\n* Adding new partners to your Marketplace directory"

    def _generate_follow_ups(self, intent, entities):
        """Generate contextual follow-up suggestions based on the current intent."""
        follow_ups_map = {
            "supplier_search": ["Compare these suppliers", "Generate an RFQ", "Find manufacturers too", "Recommend the best supplier"],
            "manufacturer_search": ["Compare these manufacturers", "Find packaging companies", "Generate an RFQ", "Build a procurement plan"],
            "packaging_search": ["Find warehouses", "Compare packaging companies", "Find logistics providers"],
            "warehouse_search": ["Find logistics providers", "Compare warehouses", "Find packaging companies"],
            "logistics_search": ["Find warehouses", "Compare logistics providers", "Build a procurement plan"],
            "testing_lab_search": ["Find certification agencies", "Compare testing labs", "Find manufacturers"],
            "certification_search": ["Find testing labs", "Compare certification agencies", "Find consultants"],
            "comparison": ["Recommend the best option", "Generate an RFQ", "Build a procurement plan"],
            "rfq_generation": ["Compare other suppliers", "Find alternative manufacturers"],
            "recommendation": ["Compare top options", "Generate an RFQ", "Build a procurement plan"],
            "procurement_plan": ["Generate an RFQ", "Find specific suppliers", "Compare manufacturers"],
            "product_create": ["Validate this product", "Find suppliers for this product", "Build a procurement plan"],
            "product_validate": ["Fix missing fields", "Find recommended partners", "Build a procurement plan"],
        }
        return follow_ups_map.get(intent, ["Find raw material suppliers", "Compare top manufacturers", "Recommend packaging suppliers"])

    def _log_interaction(self, org, user, module, question, answer, tool_name, records_count, elapsed, model_version):
        """Log AI interaction for audit and analytics."""
        try:
            AIInteractionLog.objects.create(
                organization=org,
                created_by=user,
                module=module if module in dict(AIInteractionLog.MODULE_CHOICES) else "copilot",
                question=question,
                response_text=answer[:2000],
                tools_used=[tool_name] if tool_name else [],
                records_count=records_count,
                execution_time_ms=elapsed,
                model_version=model_version or "deterministic",
            )
        except Exception as e:
            print(f"Failed to log AI interaction: {e}")


# ─── Backward Compatibility ───────────────────────────────────────────────────

class GeminiMarketplaceAssistant:
    """
    Backward-compatible V1 marketplace assistant.
    Delegates to SupplyOSCopilot under the hood.
    """
    def __init__(self):
        self._copilot = SupplyOSCopilot()

    def execute(self, org, question: str, context: dict = None, user=None) -> dict:
        return self._copilot.execute(org, question, context, user, module="marketplace")
