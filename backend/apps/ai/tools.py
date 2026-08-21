"""
Business logic tool layer for SupplyOS AI Copilot V2.
All functions require an explicit `org` parameter to guarantee multi-tenant organization isolation.
Records are serialized into concise summaries to minimize token consumption before being passed to Google Gemini.

Supports all 10 marketplace categories:
  raw_materials, manufacturers, packaging, warehouses, logistics,
  quality_labs, certifications, consultants, machinery, import_export
"""
import re
from django.db.models import Q
from apps.marketplace.models import MarketplacePartner


# ─── Serialization ─────────────────────────────────────────────────────────────

def _serialize_partner_lean(p):
    """Returns a token-minimized dictionary of essential business attributes."""
    certs = p.certifications if isinstance(p.certifications, list) else []
    caps = p.capabilities if isinstance(p.capabilities, list) else []
    mats = p.materials_supplied if isinstance(p.materials_supplied, list) else []
    prods = p.products_offered if isinstance(p.products_offered, list) else []
    accr = p.accreditations if isinstance(p.accreditations, list) else []
    testing = p.testing_capabilities if isinstance(p.testing_capabilities, list) else []
    consulting = p.consulting_specialities if isinstance(p.consulting_specialities, list) else []
    trade = p.trade_services if isinstance(p.trade_services, list) else []
    machinery_list = p.machinery if isinstance(p.machinery, list) else []
    shipping = p.shipping_modes if isinstance(p.shipping_modes, list) else []
    wh_locs = p.warehouse_locations if isinstance(p.warehouse_locations, list) else []
    industries = p.industries_served if isinstance(p.industries_served, list) else []

    result = {
        "id": str(p.id),
        "name": p.name,
        "location": f"{p.city or 'India'}, {p.state or 'India'}",
        "rating": float(p.rating),
        "ai_score": p.ai_score,
        "verified": bool(p.verified_status),
        "lead_time_days": p.lead_time_days or 14,
        "moq": p.moq_display or f"{p.moq_number or 500} units",
        "certifications": certs[:5],
        "description": p.description[:200] if p.description else "Verified industrial B2B supply partner.",
    }

    # Add category-specific fields only when populated
    if caps:
        result["capabilities"] = caps[:5]
    if mats:
        result["materials_supplied"] = mats[:5]
    if prods:
        result["products_offered"] = prods[:5]
    if accr:
        result["accreditations"] = accr[:5]
    if testing:
        result["testing_capabilities"] = testing[:5]
    if consulting:
        result["consulting_specialities"] = consulting[:5]
    if trade:
        result["trade_services"] = trade[:5]
    if machinery_list:
        result["machinery"] = machinery_list[:5]
    if shipping:
        result["shipping_modes"] = shipping[:5]
    if wh_locs:
        result["warehouse_locations"] = wh_locs[:5]
    if industries:
        result["industries_served"] = industries[:5]
    if p.storage_capacity_sqft:
        result["storage_capacity_sqft"] = p.storage_capacity_sqft
    if p.has_cold_storage:
        result["has_cold_storage"] = True
    if p.is_bonded_warehouse:
        result["is_bonded_warehouse"] = True
    if p.fleet_size:
        result["fleet_size"] = p.fleet_size
    if p.oem_available:
        result["oem_available"] = True
    if p.odm_available:
        result["odm_available"] = True
    if p.monthly_capacity_display:
        result["monthly_capacity"] = p.monthly_capacity_display
    if p.availability_status:
        result["availability"] = p.availability_status

    return result


# ─── Keyword Extraction Helpers ────────────────────────────────────────────────

GLOBAL_STOP_WORDS = frozenset([
    "find", "need", "want", "show", "give", "list", "get", "search",
    "best", "top", "good", "any", "some", "near", "from", "with",
    "company", "companies", "partner", "partners", "provider", "providers",
    "agency", "agencies", "the", "and", "for", "that", "this", "who",
    "which", "what", "where", "how", "can", "please", "help",
])

CATEGORY_STOP_WORDS = {
    "raw_materials": frozenset(["supplier", "suppliers", "raw", "material", "materials", "ingredient", "ingredients", "bulk"]),
    "manufacturers": frozenset(["manufacturer", "manufacturers", "manufacturing", "mfg", "factory", "factories", "oem", "odm", "assembly"]),
    "packaging": frozenset(["packaging", "packing", "package", "pack"]),
    "warehouses": frozenset(["warehouse", "warehouses", "warehousing", "storage", "godown"]),
    "logistics": frozenset(["logistics", "transport", "shipping", "freight", "delivery", "courier"]),
    "quality_labs": frozenset(["testing", "laboratory", "lab", "labs", "quality", "analytical"]),
    "certifications": frozenset(["certification", "certifier", "certifying", "accreditation"]),
    "consultants": frozenset(["consultant", "consulting", "consultancy", "advisor", "advisory"]),
    "machinery": frozenset(["machinery", "machine", "machines", "equipment"]),
    "import_export": frozenset(["import", "export", "trade", "customs", "clearance"]),
}


def _extract_keywords(text, category_code=None):
    """Extract meaningful search keywords after removing stop words."""
    all_stop = GLOBAL_STOP_WORDS | CATEGORY_STOP_WORDS.get(category_code, frozenset())
    words = [w for w in re.findall(r'\w+', text.lower()) if len(w) > 2 and w not in all_stop]
    return words


def _apply_keyword_filter(qs, keywords, extra_fields=None):
    """Apply OR-based keyword filtering across multiple text fields."""
    if not keywords:
        return qs

    base_fields = ["name", "description"]
    fields = base_fields + (extra_fields or [])

    query_filter = Q()
    for word in keywords:
        word_q = Q()
        for field in fields:
            word_q |= Q(**{f"{field}__icontains": word})
        query_filter |= word_q

    filtered = qs.filter(query_filter).distinct()
    return filtered


# ─── Generic Category Search ──────────────────────────────────────────────────

def _find_by_category(org, category_code, query=None, location=None, limit=6, extra_filter_fields=None):
    """
    Generic category-aware partner search.
    Filters by category_code first, then applies keyword filtering.
    """
    qs = MarketplacePartner.objects.filter(organization=org, status="active")

    # Filter strictly by category
    qs = qs.filter(categories__category_code=category_code).distinct()

    # Apply keyword search if query provided
    if query:
        keywords = _extract_keywords(query, category_code)
        if keywords:
            filtered = _apply_keyword_filter(qs, keywords, extra_filter_fields)
            if filtered.exists():
                qs = filtered

    # Apply location filter
    if location:
        loc_qs = qs.filter(
            Q(city__icontains=location) | Q(state__icontains=location) | Q(country__icontains=location)
        ).distinct()
        if loc_qs.exists():
            qs = loc_qs

    partners = list(qs.order_by("-ai_score", "-rating")[:limit])
    return partners


def _build_result(tool_name, parameters, partners):
    """Build standardized tool result."""
    return {
        "tool_name": tool_name,
        "parameters": parameters,
        "results": [_serialize_partner_lean(p) for p in partners],
        "total_matches": len(partners),
    }


# ─── Category-Specific Tool Functions ─────────────────────────────────────────

def find_suppliers(org, material=None, location=None, limit=6):
    """Query raw material and ingredient suppliers."""
    partners = _find_by_category(
        org, "raw_materials", query=material, location=location, limit=limit,
        extra_filter_fields=["materials_supplied", "products_offered", "categories__name"]
    )
    if not partners and material:
        keywords = _extract_keywords(material, "raw_materials")
        if not keywords:
            partners = _find_by_category(org, "raw_materials", location=location, limit=limit)
    return _build_result("find_suppliers", {"material": material, "location": location}, partners)


def find_manufacturers(org, capability=None, location=None, limit=6):
    """Query industrial manufacturers and contract assemblers."""
    partners = _find_by_category(
        org, "manufacturers", query=capability, location=location, limit=limit,
        extra_filter_fields=["capabilities", "products_offered", "certifications", "categories__name"]
    )
    if not partners and capability:
        keywords = _extract_keywords(capability, "manufacturers")
        if not keywords:
            partners = _find_by_category(org, "manufacturers", location=location, limit=limit)
    return _build_result("find_manufacturers", {"capability": capability, "location": location}, partners)


def find_packaging(org, query=None, location=None, limit=6):
    """Query packaging companies."""
    partners = _find_by_category(
        org, "packaging", query=query, location=location, limit=limit,
        extra_filter_fields=["products_offered", "materials_supplied", "capabilities", "categories__name"]
    )
    return _build_result("find_packaging", {"query": query, "location": location}, partners)


def find_warehouses(org, query=None, location=None, limit=6):
    """Query warehouse and storage providers."""
    partners = _find_by_category(
        org, "warehouses", query=query, location=location, limit=limit,
        extra_filter_fields=["warehouse_locations", "capabilities", "categories__name"]
    )
    return _build_result("find_warehouses", {"query": query, "location": location}, partners)


def find_logistics(org, query=None, location=None, limit=6):
    """Query logistics and transport providers."""
    partners = _find_by_category(
        org, "logistics", query=query, location=location, limit=limit,
        extra_filter_fields=["shipping_modes", "delivery_regions", "capabilities", "categories__name"]
    )
    return _build_result("find_logistics", {"query": query, "location": location}, partners)


def find_testing_labs(org, query=None, location=None, limit=6):
    """Query quality testing laboratories."""
    partners = _find_by_category(
        org, "quality_labs", query=query, location=location, limit=limit,
        extra_filter_fields=["testing_capabilities", "accreditations", "categories__name"]
    )
    return _build_result("find_testing_labs", {"query": query, "location": location}, partners)


def find_certification_agencies(org, query=None, location=None, limit=6):
    """Query certification and accreditation agencies."""
    partners = _find_by_category(
        org, "certifications", query=query, location=location, limit=limit,
        extra_filter_fields=["standards_certified", "accreditations", "categories__name"]
    )
    return _build_result("find_certification_agencies", {"query": query, "location": location}, partners)


def find_consultants(org, query=None, location=None, limit=6):
    """Query business consultants and advisors."""
    partners = _find_by_category(
        org, "consultants", query=query, location=location, limit=limit,
        extra_filter_fields=["consulting_specialities", "industries_served", "categories__name"]
    )
    return _build_result("find_consultants", {"query": query, "location": location}, partners)


def find_machinery(org, query=None, location=None, limit=6):
    """Query machinery and equipment suppliers."""
    partners = _find_by_category(
        org, "machinery", query=query, location=location, limit=limit,
        extra_filter_fields=["machinery", "capabilities", "products_offered", "categories__name"]
    )
    return _build_result("find_machinery", {"query": query, "location": location}, partners)


def find_import_export(org, query=None, location=None, limit=6):
    """Query import/export and trade service companies."""
    partners = _find_by_category(
        org, "import_export", query=query, location=location, limit=limit,
        extra_filter_fields=["trade_services", "delivery_regions", "categories__name"]
    )
    return _build_result("find_import_export", {"query": query, "location": location}, partners)


# ─── Cross-Category Tools ─────────────────────────────────────────────────────

def compare_partners(org, names=None, partner_ids=None, query=None, limit=4):
    """Compare multiple marketplace enterprises side-by-side."""
    qs = MarketplacePartner.objects.filter(organization=org, status="active")

    selected = []
    if partner_ids:
        selected = list(qs.filter(id__in=partner_ids)[:limit])
    elif names and isinstance(names, list) and len(names) > 0:
        query_filter = Q()
        for name in names:
            query_filter = query_filter | Q(name__icontains=name.strip())
        selected = list(qs.filter(query_filter).distinct()[:limit])

    if not selected and query:
        q_lower = query.lower() if query else ""
        if "supplier" in q_lower or "raw" in q_lower:
            selected = list(qs.filter(categories__category_code__in=["raw_materials", "packaging"]).distinct().order_by("-rating", "-ai_score")[:limit])
        elif "manufact" in q_lower or "gmp" in q_lower or "mfg" in q_lower or "factory" in q_lower:
            selected = list(qs.filter(Q(categories__category_code__in=["manufacturers", "machinery"]) | Q(categories__name__icontains="manufact")).distinct().order_by("-rating", "-ai_score")[:limit])
        elif "warehouse" in q_lower:
            selected = list(qs.filter(categories__category_code="warehouses").distinct().order_by("-rating", "-ai_score")[:limit])
        elif "logistics" in q_lower or "transport" in q_lower:
            selected = list(qs.filter(categories__category_code="logistics").distinct().order_by("-rating", "-ai_score")[:limit])

        if not selected:
            selected = list(qs.order_by("-ai_score", "-rating")[:limit])

    serialized = [_serialize_partner_lean(p) for p in selected]

    fastest = min(serialized, key=lambda x: x["lead_time_days"]) if serialized else None
    highest_rated = max(serialized, key=lambda x: x["rating"]) if serialized else None

    return {
        "tool_name": "compare_partners",
        "parameters": {"names": names, "query": query},
        "results": serialized,
        "total_matches": len(serialized),
        "comparison_highlights": {
            "fastest_lead_time": fastest["name"] if fastest else None,
            "highest_rating": highest_rated["name"] if highest_rated else None,
            "count": len(serialized)
        }
    }


def generate_rfq(org, partner_name=None, product_spec=None, quantity="1,000 units"):
    """Generate a formal Request for Quotation (RFQ) draft."""
    qs = MarketplacePartner.objects.filter(organization=org, status="active")
    target_partner = None

    if partner_name and partner_name.strip():
        target_partner = qs.filter(name__icontains=partner_name.strip()).first()

    if not target_partner and product_spec:
        res = find_suppliers(org, material=product_spec, limit=1)
        if res["results"]:
            target_partner = qs.filter(id=res["results"][0]["id"]).first()

    if not target_partner:
        target_partner = qs.order_by("-ai_score").first()

    partner_data = _serialize_partner_lean(target_partner) if target_partner else {
        "name": "General Verified Supplier", "location": "India",
        "lead_time_days": 14, "moq": "500 units"
    }

    rfq_draft = {
        "rfq_number": f"RFQ-{org.slug[:4].upper()}-{org.id.hex[:4].upper()}",
        "buyer_organization": org.name,
        "supplier_name": partner_data["name"],
        "supplier_location": partner_data.get("location"),
        "target_item": product_spec or "Industrial Raw Material & Custom Assembly",
        "requested_quantity": quantity or "1,000 units",
        "target_lead_time": f"Within {partner_data.get('lead_time_days', 14)} business days",
        "required_certifications": partner_data.get("certifications", ["WHO-GMP", "ISO 9001:2015"]),
        "compliance_notes": "Certificate of Analysis (CoA) and product inspection report required prior to dispatch.",
        "payment_terms": "30% Advance, 70% against Shipping Documents (Net 30)",
        "validity_days": 30
    }

    return {
        "tool_name": "generate_rfq",
        "parameters": {"partner_name": partner_name, "product_spec": product_spec},
        "results": [partner_data] if partner_data else [],
        "total_matches": 1 if partner_data else 0,
        "rfq_data": rfq_draft,
        "target_partner": partner_data
    }


def search_marketplace(org, query=None, category=None, location=None, limit=6):
    """Natural language Marketplace search querying multi-field business metrics."""
    qs = MarketplacePartner.objects.filter(organization=org, status="active")

    if category and category != "all":
        qs = qs.filter(
            Q(categories__category_code__iexact=category) |
            Q(categories__slug__iexact=category) |
            Q(categories__name__icontains=category)
        ).distinct()

    if location:
        qs = qs.filter(
            Q(city__icontains=location) | Q(state__icontains=location) | Q(delivery_regions__icontains=location)
        ).distinct()

    if query:
        keywords = _extract_keywords(query)
        if keywords:
            filtered = _apply_keyword_filter(qs, keywords, [
                "materials_supplied", "products_offered", "capabilities",
                "certifications", "city", "state", "categories__name", "categories__category_code"
            ])
            if filtered.exists():
                qs = filtered

    if query and ("lead time" in query.lower() or "fastest" in query.lower() or "shortest" in query.lower()):
        partners = list(qs.order_by("lead_time_days", "-rating")[:limit])
    else:
        partners = list(qs.order_by("-ai_score", "-rating", "name")[:limit])

    return _build_result("search_marketplace", {"query": query, "category": category, "location": location}, partners)


def recommend_partner(org, query=None, category=None, criteria=None, limit=3):
    """Recommend optimal partner and explain rating / AI match compatibility reasons."""
    if category:
        # Route to the correct category tool for recommendations
        tool_map = {
            "raw_materials": lambda: find_suppliers(org, limit=limit),
            "manufacturers": lambda: find_manufacturers(org, limit=limit),
            "packaging": lambda: find_packaging(org, limit=limit),
            "warehouses": lambda: find_warehouses(org, limit=limit),
            "logistics": lambda: find_logistics(org, limit=limit),
            "quality_labs": lambda: find_testing_labs(org, limit=limit),
            "certifications": lambda: find_certification_agencies(org, limit=limit),
            "consultants": lambda: find_consultants(org, limit=limit),
            "machinery": lambda: find_machinery(org, limit=limit),
            "import_export": lambda: find_import_export(org, limit=limit),
        }
        res = tool_map.get(category, lambda: search_marketplace(org, query=query, limit=limit))()
    else:
        res = search_marketplace(org, query=query, category=category, limit=limit)

    partners = res["results"]

    recommendations = []
    for idx, p in enumerate(partners):
        score = p.get("ai_score", 90)
        rating = p.get("rating", 4.5)
        reasons = [
            f"Rated {rating}\u2605 out of 5.0 with verified buyer reputation.",
            f"AI Match Confidence score of {score}% based on capacity and compliance standards.",
            f"Estimated production lead time is {p.get('lead_time_days', 14)} days (MOQ: {p.get('moq', '500 units')})."
        ]
        if p.get("certifications"):
            reasons.append(f"Holds critical certifications: {', '.join(p['certifications'])}.")
        if p.get("capabilities"):
            reasons.append(f"Specialized capabilities: {', '.join(p['capabilities'])}.")

        recommendations.append({
            "rank": idx + 1,
            "partner": p,
            "recommendation_reasons": reasons,
            "optimal_choice": idx == 0
        })

    return {
        "tool_name": "recommend_partner",
        "parameters": {"query": query, "criteria": criteria},
        "results": partners,
        "total_matches": len(partners),
        "recommendations": recommendations,
        "top_match": recommendations[0] if recommendations else None
    }
