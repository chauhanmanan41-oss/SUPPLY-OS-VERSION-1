"""
SupplyOS AI Copilot V2 — Intent Detection, Entity Extraction & Parameter Extraction Engine.

Pipeline: User Request → Intent Detection → Entity Extraction → Parameter Extraction → Tool Selection

Supports 25+ intents across Marketplace, Products, Procurement, Documents, and general ERP.
Greetings and farewells are handled without any database query.
"""
import re


# ─── Known Entities ────────────────────────────────────────────────────────────

KNOWN_LOCATIONS = [
    "gujarat", "maharashtra", "pune", "mumbai", "ahmedabad", "surat", "chennai",
    "tamil nadu", "hyderabad", "telangana", "bangalore", "karnataka", "delhi",
    "baddi", "indore", "noida", "kolkata", "rajasthan", "madhya pradesh",
    "uttar pradesh", "haryana", "gurgaon", "goa", "jaipur", "lucknow",
    "chandigarh", "punjab", "bhopal", "nagpur", "vadodara", "rajkot",
    "new delhi", "ncr", "thane", "navi mumbai",
]

GREETING_PATTERNS = [
    r"^(hi|hello|hey|howdy|hola|namaste|greetings|good\s*(?:morning|afternoon|evening|day)|what'?s?\s*up|yo|sup)(?:[\s,.!?-]+(?:there|ai|copilot|assistant|supplyos|good\s*(?:morning|afternoon|evening|day)|how are you|nice to meet you|welcome))*[\s,.!?-]*$",
    r"^(good\s*(?:morning|afternoon|evening|day))(?:[\s,.!?-]+(?:there|ai|copilot|assistant|supplyos|hi|hello|hey))*[\s,.!?-]*$",
]

FAREWELL_PATTERNS = [
    r"^(bye|goodbye|see\s*ya|later|thanks?|thank\s*you|that'?s?\s*all|done|exit|quit|close)[\s!.?]*$",
]

# Category code → keyword triggers
CATEGORY_KEYWORDS = {
    "warehouses": ["warehouse", "warehousing", "storage", "store", "godown", "cold storage", "bonded warehouse", "fulfillment center", "distribution center"],
    "logistics": ["logistics", "transport", "shipping", "freight", "delivery", "courier", "trucking", "reefer", "air freight", "sea freight", "road transport", "3pl", "fleet"],
    "quality_labs": ["testing lab", "testing laboratory", "quality lab", "quality testing", "lab test", "laboratory", "nabl", "analytical", "microbiology", "stability study", "coa", "certificate of analysis"],
    "certifications": ["certification", "certifier", "certifying", "accreditation", "iso certification", "gmp certification", "fssai", "haccp", "halal certification", "kosher certification", "organic certification", "ce marking", "bis", "bureau of indian standards"],
    "consultants": ["consultant", "consulting", "consultancy", "advisor", "advisory", "business consultant", "regulatory consultant", "food consultant", "pharma consultant"],
    "machinery": ["machinery", "machine", "equipment", "cnc", "lathe", "press", "extruder", "mixer", "blender", "dryer", "granulator", "tablet press", "encapsulation", "filling machine", "sealing machine"],
    "import_export": ["import", "export", "trade", "customs", "clearance", "iec", "dgft", "foreign trade", "international trade", "customs broker", "freight forwarder"],
    "packaging": ["packaging", "packing", "label", "bottle", "pouch", "jar", "container", "blister", "carton", "box", "wrapper", "foil", "shrink wrap"],
    "manufacturers": ["manufacturer", "manufacturing", "mfg", "factory", "oem", "odm", "assembly", "contract manufacturing", "private label", "third party manufacturing", "production facility", "gmp manufacturer", "who-gmp", "plant"],
    "raw_materials": ["supplier", "raw material", "ingredient", "chemical", "polymer", "alloy", "bulk", "excipient", "api", "active pharmaceutical", "protein", "vitamin", "mineral", "extract", "starch", "cellulose", "gelatin"],
}


# ─── Entity Extraction ─────────────────────────────────────────────────────────

def extract_location(text_lower):
    """Extract geographic location entities from query text."""
    for loc in KNOWN_LOCATIONS:
        if loc in text_lower or f"in {loc}" in text_lower or f"near {loc}" in text_lower or f"from {loc}" in text_lower:
            return loc.title()
    return None


def extract_quoted_names(text):
    """Extract company/entity names enclosed in quotes."""
    matches = re.findall(r'"([^"]*)"|\'([^\']*)\'', text)
    return [n[0] or n[1] for n in matches if n[0] or n[1]]


def extract_quantity(text_lower):
    """Extract quantity/MOQ from query."""
    qty_match = re.search(r'(\d[\d,]*)\s*(units?|kg|tons?|pcs?|pieces?|liters?|bottles?|packs?)', text_lower)
    if qty_match:
        return f"{qty_match.group(1)} {qty_match.group(2)}"
    return None


def extract_certifications_from_query(text_lower):
    """Extract certification requirements from query."""
    certs = []
    cert_patterns = ["iso 9001", "iso 22000", "iso 14001", "who-gmp", "who gmp", "gmp", "fssai", "haccp",
                     "halal", "kosher", "organic", "fda", "us fda", "ce", "bis", "nabl", "iso/iec 17025"]
    for cert in cert_patterns:
        if cert in text_lower:
            certs.append(cert.upper().replace("WHO-GMP", "WHO-GMP").replace("US FDA", "US FDA"))
    return certs


# ─── Intent Resolution ─────────────────────────────────────────────────────────

def resolve_intent(question: str, context: dict = None) -> dict:
    """
    Master intent resolver for SupplyOS AI Copilot V2.

    Returns:
        {
            "intent": str,          # e.g. "greeting", "supplier_search", etc.
            "tool_name": str,       # backend tool to invoke (None for greetings)
            "kwargs": dict,         # extracted parameters for the tool
            "entities": dict,       # extracted entities (location, names, quantities, certs)
            "category_code": str,   # marketplace category code if applicable
        }
    """
    q_clean = question.strip()
    q_lower = q_clean.lower()

    # Extract entities
    location = extract_location(q_lower)
    quoted_names = extract_quoted_names(q_clean)
    quantity = extract_quantity(q_lower)
    certs = extract_certifications_from_query(q_lower)

    entities = {
        "location": location,
        "names": quoted_names,
        "quantity": quantity,
        "certifications": certs,
    }

    # ─── 1. Greeting ───────────────────────────────────────────────────────────
    is_greeting = False
    for pattern in GREETING_PATTERNS:
        if re.match(pattern, q_lower):
            is_greeting = True
            break
    
    # Algorithmic fallback for short greeting sentences without domain search terms
    if not is_greeting and len(q_lower.split()) <= 7:
        if any(q_lower.startswith(g) for g in ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "greetings"]):
            action_words = ["find", "search", "recommend", "suggest", "build", "create", "plan", "supplier", "manufacturer", "warehouse", "packaging", "lab", "rfq", "bom", "spec", "who", "where", "what", "how", "why"]
            if not any(re.search(r'\b' + w + r'\b', q_lower) for w in action_words):
                is_greeting = True

    if is_greeting:
        return {
            "intent": "greeting",
            "tool_name": None,
            "kwargs": {},
            "entities": entities,
            "category_code": None,
        }

    # ─── 2. Farewell ───────────────────────────────────────────────────────────
    for pattern in FAREWELL_PATTERNS:
        if re.match(pattern, q_lower):
            return {
                "intent": "farewell",
                "tool_name": None,
                "kwargs": {},
                "entities": entities,
                "category_code": None,
            }

    # ─── 3. Comparison ─────────────────────────────────────────────────────────
    if any(w in q_lower for w in ["compare", "comparison", "versus", " vs ", "vs.", "difference between", "side by side", "head to head"]):
        return {
            "intent": "comparison",
            "tool_name": "compare_partners",
            "kwargs": {"names": quoted_names if quoted_names else None, "query": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 4. RFQ Generation ────────────────────────────────────────────────────
    if any(w in q_lower for w in ["rfq", "request for quotation", "draft rfq", "generate rfq", "create rfq", "quotation for", "quote for"]):
        spec = q_clean
        for kw in ["generate an rfq for", "generate rfq for", "create rfq for", "draft rfq for", "rfq for", "quotation for", "quote for"]:
            if kw in q_lower:
                idx = q_lower.find(kw) + len(kw)
                spec = q_clean[idx:].strip(" .!?:")
                break
        return {
            "intent": "rfq_generation",
            "tool_name": "generate_rfq",
            "kwargs": {"product_spec": spec, "quantity": quantity or "1,000 units"},
            "entities": entities,
            "category_code": None,
        }

    # ─── 5. BOM Generation ────────────────────────────────────────────────────
    if any(w in q_lower for w in ["bom", "bill of materials", "bill of material", "material list"]):
        return {
            "intent": "bom_generation",
            "tool_name": "ai_generate_document",
            "kwargs": {"doc_type": "bom", "description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 6. Specification Sheet ───────────────────────────────────────────────
    if any(w in q_lower for w in ["spec sheet", "specification", "product spec", "technical spec"]):
        return {
            "intent": "spec_generation",
            "tool_name": "ai_generate_document",
            "kwargs": {"doc_type": "spec_sheet", "description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 7. Product Creation (AI Product Builder) ─────────────────────────────
    if any(w in q_lower for w in ["create product", "new product", "build product", "design product", "product idea", "launch product", "make a product"]):
        return {
            "intent": "product_create",
            "tool_name": "ai_generate_product",
            "kwargs": {"description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 8. Product Validation ────────────────────────────────────────────────
    if any(w in q_lower for w in ["validate product", "check product", "product validation", "product review", "product audit", "what am i missing", "missing in my product"]):
        return {
            "intent": "product_validate",
            "tool_name": "ai_validate_product",
            "kwargs": {"description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 9. Procurement Planning ──────────────────────────────────────────────
    if any(w in q_lower for w in ["procurement plan", "supply chain plan", "launch plan", "i want to launch", "i want to start", "build supply chain", "plan my supply", "procurement strategy", "sourcing plan"]):
        return {
            "intent": "procurement_plan",
            "tool_name": "ai_build_procurement_plan",
            "kwargs": {"description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 10. Document Generation (general) ────────────────────────────────────
    if any(w in q_lower for w in ["generate document", "create document", "draft document", "quality checklist", "production instructions", "packaging instructions", "coa draft", "certificate of analysis"]):
        doc_type = "general"
        if "checklist" in q_lower:
            doc_type = "quality_checklist"
        elif "coa" in q_lower or "certificate of analysis" in q_lower:
            doc_type = "coa_draft"
        elif "packaging" in q_lower and "instruction" in q_lower:
            doc_type = "packaging_instructions"
        elif "production" in q_lower and "instruction" in q_lower:
            doc_type = "production_instructions"
        return {
            "intent": "document_generation",
            "tool_name": "ai_generate_document",
            "kwargs": {"doc_type": doc_type, "description": q_clean},
            "entities": entities,
            "category_code": None,
        }

    # ─── 11. Recommendation (explicit) ────────────────────────────────────────
    if any(w in q_lower for w in ["recommend", "suggest", "best option", "who should i choose", "top match", "which is best", "best supplier", "best manufacturer", "cheapest", "most affordable", "lowest price", "highest rated", "top rated"]):
        # Determine category for recommendation
        rec_category = _detect_category(q_lower)
        return {
            "intent": "recommendation",
            "tool_name": "recommend_partner",
            "kwargs": {"query": q_clean, "criteria": "quality and ai_score", "category": rec_category},
            "entities": entities,
            "category_code": rec_category,
        }

    # ─── 12. Category-Specific Searches (the core marketplace intent engine) ──

    # Check each category in priority order (most specific first)
    # Warehouses — must come before generic "supplier" since warehouses are a distinct category
    if _matches_category(q_lower, "warehouses"):
        return _build_category_intent("warehouse_search", "find_warehouses", q_lower, q_clean, entities, "warehouses", location)

    # Logistics
    if _matches_category(q_lower, "logistics"):
        return _build_category_intent("logistics_search", "find_logistics", q_lower, q_clean, entities, "logistics", location)

    # Quality Testing Labs
    if _matches_category(q_lower, "quality_labs"):
        return _build_category_intent("testing_lab_search", "find_testing_labs", q_lower, q_clean, entities, "quality_labs", location)

    # Certification Agencies
    if _matches_category(q_lower, "certifications"):
        return _build_category_intent("certification_search", "find_certification_agencies", q_lower, q_clean, entities, "certifications", location)

    # Consultants
    if _matches_category(q_lower, "consultants"):
        return _build_category_intent("consultant_search", "find_consultants", q_lower, q_clean, entities, "consultants", location)

    # Machinery
    if _matches_category(q_lower, "machinery"):
        return _build_category_intent("machinery_search", "find_machinery", q_lower, q_clean, entities, "machinery", location)

    # Import/Export
    if _matches_category(q_lower, "import_export"):
        return _build_category_intent("import_export_search", "find_import_export", q_lower, q_clean, entities, "import_export", location)

    # Packaging — must come before raw_materials since "packaging supplier" should go to packaging
    if _matches_category(q_lower, "packaging"):
        return _build_category_intent("packaging_search", "find_packaging", q_lower, q_clean, entities, "packaging", location)

    # Manufacturers — must come before raw_materials since "manufacturer" is distinct
    if _matches_category(q_lower, "manufacturers"):
        cap = _strip_location(q_clean, q_lower)
        return {
            "intent": "manufacturer_search",
            "tool_name": "find_manufacturers",
            "kwargs": {"capability": cap.strip(" ?.!"), "location": location},
            "entities": entities,
            "category_code": "manufacturers",
        }

    # Raw Material Suppliers (broadest match — must be last among categories)
    if _matches_category(q_lower, "raw_materials"):
        mat = _strip_location(q_clean, q_lower)
        return {
            "intent": "supplier_search",
            "tool_name": "find_suppliers",
            "kwargs": {"material": mat.strip(" ?.!"), "location": location},
            "entities": entities,
            "category_code": "raw_materials",
        }

    # ─── 13. Explain / Why (justification) ────────────────────────────────────
    if any(w in q_lower for w in ["explain", "why is", "why this", "tell me about", "what makes", "how is"]):
        return {
            "intent": "recommendation",
            "tool_name": "recommend_partner",
            "kwargs": {"query": q_clean, "criteria": "quality and ai_score"},
            "entities": entities,
            "category_code": None,
        }

    # ─── 14. Default — General Marketplace Search ─────────────────────────────
    return {
        "intent": "marketplace_search",
        "tool_name": "search_marketplace",
        "kwargs": {"query": q_clean, "location": location},
        "entities": entities,
        "category_code": None,
    }


# ─── Helper Functions ──────────────────────────────────────────────────────────

def _has_keyword(text: str, kw: str) -> bool:
    return bool(re.search(r'\b' + re.escape(kw) + r'\b', text))


def _matches_category(q_lower: str, category_code: str) -> bool:
    """Check if query matches any keyword for a given marketplace category using word boundaries."""
    keywords = CATEGORY_KEYWORDS.get(category_code, [])
    return any(_has_keyword(q_lower, kw) for kw in keywords)


def _detect_category(q_lower: str) -> str:
    """Detect the most likely marketplace category from the query text using word boundaries."""
    for code, keywords in CATEGORY_KEYWORDS.items():
        if any(_has_keyword(q_lower, kw) for kw in keywords):
            return code
    return None


def _strip_location(q_clean: str, q_lower: str) -> str:
    """Remove location phrases from query to get clean search terms."""
    result = q_clean
    for loc in KNOWN_LOCATIONS:
        result = re.sub(rf'\b(in|near|from|at)\s+{re.escape(loc)}\b', '', result, flags=re.IGNORECASE)
    return result


def _build_category_intent(intent_name, tool_name, q_lower, q_clean, entities, category_code, location):
    """Build a standard category search intent result."""
    query = _strip_location(q_clean, q_lower)
    return {
        "intent": intent_name,
        "tool_name": tool_name,
        "kwargs": {"query": query.strip(" ?.!"), "location": location},
        "entities": entities,
        "category_code": category_code,
    }


# ─── Backward Compatibility ───────────────────────────────────────────────────

def resolve_marketplace_intent(question: str, context: dict = None) -> dict:
    """
    Backward-compatible wrapper for V1 marketplace assistant.
    Maps V2 intent format to V1 format: { tool_name, kwargs }
    """
    result = resolve_intent(question, context)
    return {
        "tool_name": result["tool_name"] or "search_marketplace",
        "kwargs": result["kwargs"],
    }
