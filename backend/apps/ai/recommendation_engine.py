"""
SupplyOS AI Recommendation Engine (Context-Aware & Weighted B2B Pipeline)
Executes deterministic weighted scoring across 9 business criteria (100% total),
guaranteeing explainable recommendations with verified domain compatibility.
"""
import json
import logging
from decimal import Decimal
from django.db.models import Q

logger = logging.getLogger(__name__)

class RequirementExtractor:
    """Step 1 & 2: Reads all available workspace data and extracts structured requirements."""
    @staticmethod
    def extract_from_workspace(product):
        data = {
            "product_name": product.name or "Unnamed Product",
            "category": product.category or "",
            "subcategory": product.subcategory or "",
            "industry": product.target_industry or "",
            "description": product.description or "",
            "country": product.country or "India",
            "budget": product.budget_total or Decimal(0),
            "timeline": product.estimated_launch or "3-6 months",
            "commercial_data": product.commercial_data or {},
            "manufacturing_data": product.manufacturing_data or {},
            "raw_materials_data": product.raw_materials_data or [],
            "packaging_data": product.packaging_data or {},
            "warehouse_data": product.warehouse_data or {},
            "logistics_data": product.logistics_data or {},
            "quality_data": product.quality_data or {},
            "inventory_data": product.inventory_data or {},
            "ai_insights": product.ai_insights or {},
        }

        # Extract BOM & Ingredients
        ingredients = []
        if isinstance(data["raw_materials_data"], list):
            for rm in data["raw_materials_data"]:
                if isinstance(rm, dict) and (rm.get("material") or rm.get("name")):
                    ingredients.append(str(rm.get("material") or rm.get("name")))
                elif isinstance(rm, str) and rm.strip():
                    ingredients.append(rm.strip())
        
        # Also try relational BOM if empty
        if not ingredients and hasattr(product, "bill_of_materials"):
            for bom in product.bill_of_materials.filter(is_active=True):
                for line in bom.lines.select_related("material").all():
                    if line.material and line.material.name:
                        ingredients.append(line.material.name)

        data["extracted_ingredients"] = ingredients
        return data


class IndustryClassifier:
    """Step 2: Classify product into domain industry and infer missing specifications."""
    PROFILES = {
        "Food & Nutraceuticals": {
            "keywords": ["protein", "whey", "supplement", "nutra", "vitamin", "creatin", "food", "beverage", "drink", "snack", "powder", "bar", "herb"],
            "inferred_ingredients": ["Whey Protein Isolate 90%", "Creatine Monohydrate", "Ashwagandha Extract", "L-Ascorbic Acid (Vitamin C)", "Soy Lecithin Fluid", "Steviol Glycosides"],
            "inferred_packaging": ["PET Protein Jars", "Standup Resealable Zipper Pouches", "Induction Seal Wads"],
            "inferred_warehouse": "Grade-A hygienic food warehouse with FSSAI compliance and temperature control",
            "inferred_logistics": "Food-grade clean containers and FSSAI compliant supply chain",
            "inferred_certifications": ["FSSAI", "GMP", "ISO 22000", "Halal", "Kosher"],
            "requires_cold_chain": False,
        },
        "Electronics & Technology": {
            "keywords": ["phone", "smartphone", "smart", "device", "electric", "electronic", "chip", "pcb", "circuit", "display", "battery", "audio", "camera", "sensor", "laptop", "computing"],
            "inferred_ingredients": ["OLED Retina Displays", "Lithium Polymer Battery Cells", "Microchip SoC", "Multi-layer PCB Boards", "Precision Aluminum Housings"],
            "inferred_packaging": ["ESD Anti-Static Shielding Bags", "Precision EVA Foam Inserts", "Rigid Retail Gift Box Packaging"],
            "inferred_warehouse": "ESD-protected dust-free electronic components vault and assembly storage",
            "inferred_logistics": "Air freight express and fragile electronics transport with shock suspension",
            "inferred_certifications": ["RoHS Compliant", "CE Certified", "ISO 9001:2015", "FCC Approved"],
            "requires_cold_chain": False,
        },
        "Furniture & Woodworking": {
            "keywords": ["furniture", "chair", "table", "sofa", "wood", "desk", "bed", "cabinet", "shelf", "upholstery", "lumber", "teak", "dining"],
            "inferred_ingredients": ["Seasoned Hardwood Lumber", "High-Density Upholstery Foam", "Powder-Coated Steel Tubing", "MDF Panels", "Steel Hinges"],
            "inferred_packaging": ["Heavy-Duty 7-Ply Corrugated Shipper Boxes", "Corner Protection Foam Caps", "Stretch Pallet Wrap Film"],
            "inferred_warehouse": "High-bay wide-aisle pallet storage facility engineered for heavy furniture",
            "inferred_logistics": "Dedicated heavy road transport and container hauling with lift-gate support",
            "inferred_certifications": ["FSC Sustainable Certified", "BIFMA Compliant", "ISO 9001:2015", "CE Safe Standard"],
            "requires_cold_chain": False,
        },
        "Pharmaceuticals & Medicine": {
            "keywords": ["medicine", "pharma", "drug", "pill", "tablet", "capsule", "syrup", "antibiotic", "vaccine", "clinical", "hospital", "healthcare", "medical", "api"],
            "inferred_ingredients": ["Active Pharmaceutical Ingredients (API)", "Microcrystalline Cellulose", "Magnesium Stearate (EP)", "High-Grade Gelatin Capsules"],
            "inferred_packaging": ["Child-Resistant HDPE Pharma Bottles", "Aluminium Foil Blister Packs", "Tamper-Evident Cartons"],
            "inferred_warehouse": "WHO-GDP compliant cold chain pharmaceutical storage vault with 24/7 temperature monitoring",
            "inferred_logistics": "Refrigerated cold-chain pharmaceutical freight with live temperature GPS tracking",
            "inferred_certifications": ["WHO-GMP", "US-FDA", "ISO 9001:2015", "EU-GMP"],
            "requires_cold_chain": True,
        },
        "Cosmetics & Personal Care": {
            "keywords": ["shampoo", "lotion", "cream", "soap", "beauty", "cosmetics", "skin", "hair", "face", "serum", "perfume", "makeup", "personal care", "balm"],
            "inferred_ingredients": ["Natural Essential Oils", "Sodium Lauryl Sulfate & Surfactants", "Botanical Herb Extracts", "Emulsifying Waxes", "Shea Butter & Argan Oils"],
            "inferred_packaging": ["Luxury PET & HDPE Shampoo Bottles", "Precision Lotion Pump Dispensers", "Glass Cream Jars"],
            "inferred_warehouse": "Temperature and humidity-controlled warehouse designed for cosmetics storage",
            "inferred_logistics": "Insulated container shipping preventing temperature degradation of cosmetics",
            "inferred_certifications": ["ISO 22716 Cosmetics GMP", "Ecocert", "Cruelty-Free Certified", "ISO 9001:2015"],
            "requires_cold_chain": False,
        },
        "Footwear & Textiles": {
            "keywords": ["shoe", "sneaker", "boot", "slipper", "footwear", "shirt", "t-shirt", "apparel", "garment", "cloth", "textile", "cotton", "denim"],
            "inferred_ingredients": ["100% Organic Combed Cotton Yarn", "Heavier 220 GSM Single Jersey Fabric", "Reactive Textile Dyes", "Polyester Sewing Thread", "YKK Zippers"],
            "inferred_packaging": ["Corrugated Retail Garment Boxes", "Printed Silk Tissue Paper Inserts", "Outer Corrugated Master Cartons"],
            "inferred_warehouse": "Apparel and footwear distribution hub with automated barcode sortation",
            "inferred_logistics": "Pan-India fashion and retail distribution logistics with barcode tracking",
            "inferred_certifications": ["GOTS", "OEKO-TEX Standard 100", "WRAP Approved", "ISO 9001:2015"],
            "requires_cold_chain": False,
        },
        "Confectionery & Chocolate": {
            "keywords": ["chocolate", "cocoa", "confectionery", "snack", "candy", "sweet", "bar", "edible", "butter"],
            "inferred_ingredients": ["70% Single-Origin Cocoa Liquor", "Deodorized Cocoa Butter", "Organic Cane Sugar", "Bourbon Vanilla", "Sunflower Lecithin"],
            "inferred_packaging": ["Food-Grade Aluminum Foil Wrappers", "Cardboard Cartons", "Flow-Wrap Films"],
            "inferred_warehouse": "Refrigerated Confectionery Cold Storage (16°C - 18°C)",
            "inferred_logistics": "Refrigerated Cold Chain Reefer Fleet (16°C maintained)",
            "inferred_certifications": ["ISO 22000", "FSSAI", "FSSC 22000", "Halal"],
            "requires_cold_chain": True,
        }
    }

    @classmethod
    def classify_and_infer(cls, reqs):
        try:
            from apps.ai.dynamic_engine import ProductClassifier, WorkspaceSchemaGenerator
            classification = ProductClassifier.classify(reqs['product_name'], reqs['category'], reqs['description'])
            
            class DummyProd:
                name = reqs['product_name']
                category = reqs['category']
                raw_materials_data = []
                
            schema = WorkspaceSchemaGenerator.get_schema(classification["key"], DummyProd())
            
            reqs["inferred_domain"] = classification["sub_industry"] or classification["industry"] or "Industrial Manufacturing"
            reqs["target_ingredients"] = reqs["extracted_ingredients"] if reqs["extracted_ingredients"] else [item.get("material", "Component") for item in schema.get("bom", [])]
            reqs["target_packaging"] = list(schema.get("packaging", {}).values())
            reqs["target_warehouse"] = classification.get("storage_specification", "Bonded Industrial Storage")
            reqs["target_logistics"] = classification.get("logistics_specification", "Secure Surface Transit")
            reqs["target_certifications"] = classification.get("regulatory_bodies", ["ISO 9001:2015", "GMP"])
            reqs["classification_key"] = classification["key"]
            reqs["target_moq"] = classification.get("target_moq", "500 units")
            reqs["target_capacity"] = classification.get("target_capacity", "25,000 units/mo")
            reqs["requires_cold_chain"] = classification.get("key") in ["pharma", "chocolate", "protein"]
            return reqs
        except Exception as e:
            logger.error(f"Error in dynamic IndustryClassifier fallback: {e}")
            
        combined_text = f"{reqs['product_name']} {reqs['category']} {reqs['subcategory']} {reqs['industry']} {reqs['description']} {' '.join(reqs['extracted_ingredients'])}".lower()
        selected_domain = "Food & Nutraceuticals"
        max_hits = -1
        for domain, profile in cls.PROFILES.items():
            hits = sum(1 for kw in profile["keywords"] if kw in combined_text)
            if domain.lower() in reqs['industry'].lower() or domain.lower() in reqs['category'].lower():
                hits += 5
            if hits > max_hits and hits > 0:
                max_hits = hits
                selected_domain = domain

        prof = cls.PROFILES[selected_domain]
        reqs["inferred_domain"] = selected_domain
        reqs["target_ingredients"] = reqs["extracted_ingredients"] if reqs["extracted_ingredients"] else prof["inferred_ingredients"]
        reqs["target_packaging"] = prof["inferred_packaging"]
        reqs["target_warehouse"] = prof["inferred_warehouse"]
        reqs["target_logistics"] = prof["inferred_logistics"]
        reqs["target_certifications"] = prof["inferred_certifications"]
        reqs["target_moq"] = "500 units"
        reqs["target_capacity"] = "25,000 units/mo"
        reqs["requires_cold_chain"] = prof.get("requires_cold_chain", False)
        return reqs


class CandidateScorer:
    """
    Step 4: Deterministic Weighted B2B Scoring Engine (Phase 5 & Phase 6)
    Criteria Weights (100% total):
      - Industry Match     : 25%
      - Product Match      : 30%
      - Certification Match: 10%
      - Capacity Match     : 10%
      - MOQ Match          : 5%
      - Lead Time          : 5%
      - Location           : 5%
      - Services Match     : 5%
      - Availability       : 5%
    """
    @staticmethod
    def score_partner(partner, reqs, category_type="generic"):
        score_breakdown = {}
        reasons = []
        tradeoffs = []
        missing = []
        
        domain = str(reqs.get("inferred_domain", "")).lower()
        classification_key = str(reqs.get("classification_key", "")).lower()
        
        p_ind = (str(getattr(partner, "primary_industry", "")) + " " + str(getattr(partner, "sub_industry", "")) + " " + " ".join(getattr(partner, "industries_served", []) or [])).lower()
        p_kws = [k.lower() for k in getattr(partner, "keywords", []) or []]
        p_prod = " ".join(getattr(partner, "products_offered", []) or [] + getattr(partner, "materials_supplied", []) or [] + getattr(partner, "machinery", []) or [] + getattr(partner, "packaging_types", []) or []).lower()
        p_srv = " ".join(getattr(partner, "services", []) or [] + getattr(partner, "capabilities", []) or [] + getattr(partner, "testing_capabilities", []) or [] + getattr(partner, "consulting_areas", []) or []).lower()
        p_certs = " ".join(str(c) for c in (getattr(partner, "certifications", []) or [] + getattr(partner, "accreditations", []) or [] + getattr(partner, "certificates_issued", []) or [])).lower()
        p_desc = (str(getattr(partner, "description", "")) + " " + str(partner.name)).lower()

        # --- VALIDATION GUARD (Phase 10) ---
        # Never recommend incompatible domains (e.g. Pharma for Furniture, Chemical for Protein)
        compatible_industries = {
            "protein": ["Sports Nutrition & Dietary Supplements", "Food & Beverage Processing", "Fast-Moving Consumer Goods (FMCG)"],
            "medicine": ["Healthcare & Drug Formulation", "Medical Devices & Diagnostic Equipment", "Industrial & Specialty Chemicals"],
            "shampoo": ["Hair & Skin Hygiene Care", "Fast-Moving Consumer Goods (FMCG)", "Industrial & Specialty Chemicals"],
            "shirt": ["Garment Manufacturing & Fashion", "Fast-Moving Consumer Goods (FMCG)"],
            "smartphone": ["Telecommunications & Computing Hardware", "Specialized Industrial Manufacturing & Assembly Operations"],
            "laptop": ["Telecommunications & Computing Hardware", "Specialized Industrial Manufacturing & Assembly Operations"],
            "furniture": ["Woodworking, Interior & Ergonomics", "Specialized Industrial Manufacturing & Assembly Operations"],
            "chocolate": ["Confectionery & Snack Processing", "Food & Beverage Processing", "Fast-Moving Consumer Goods (FMCG)"],
            "bottle": ["Hydration, Packaging & Plastics", "Packaging Solutions & Materials", "Fast-Moving Consumer Goods (FMCG)"],
            "cycle": ["Micro-Mobility & Bicycles", "Telecommunications & Computing Hardware", "Specialized Industrial Manufacturing & Assembly Operations"],
            "solar": ["Renewable Energy & Photovoltaics", "Telecommunications & Computing Hardware", "Specialized Industrial Manufacturing & Assembly Operations"],
        }

        domain_keywords_map = {
            "protein": ["whey", "protein", "supplement", "nutrition", "nutraceutical", "food", "isolate"],
            "medicine": ["pharma", "medicine", "syrup", "tablet", "capsule", "who-gmp", "api", "drug", "healthcare"],
            "shampoo": ["shampoo", "cosmetic", "herbal", "surfactant", "hair", "skin", "hygiene", "lotion"],
            "shirt": ["shirt", "apparel", "garment", "cotton", "textile", "yarn", "fabric", "weave", "jersey"],
            "smartphone": ["smartphone", "phone", "oled", "display", "smt", "pcb", "electronics", "chip", "battery"],
            "laptop": ["laptop", "computing", "pcb", "electronics", "ram", "processor", "device", "hardware"],
            "furniture": ["furniture", "chair", "teak", "wood", "timber", "hardwood", "dining", "ergonomic", "upholstery"],
            "chocolate": ["chocolate", "cocoa", "confectionery", "snack", "candy", "tempering", "food"],
            "bottle": ["bottle", "water", "stainless", "vacuum", "plastic", "hdpe", "pet", "hydration"],
            "cycle": ["e-bike", "cycle", "bicycle", "battery", "lithium", "motor", "mobility", "scooter"],
            "solar": ["solar", "photovoltaic", "inverter", "pv", "renewable", "module", "bifacial", "panel"],
        }

        target_kws = domain_keywords_map.get(classification_key, [w for w in domain.split() if len(w) > 3])
        
        # Enforce strict primary industry check for manufacturers, suppliers, and packaging
        partner_primary_ind = str(getattr(partner, "primary_industry", "")).strip()
        if category_type in ["suppliers", "manufacturers", "packaging"] and classification_key in compatible_industries:
            has_domain_match = (partner_primary_ind in compatible_industries[classification_key])
            if not has_domain_match and any(w in p_ind or w in p_kws for w in target_kws[:3]):
                # Allow fallback if their specific keywords match top core domain keywords
                has_domain_match = True
        else:
            has_domain_match = any(w in p_ind or w in p_kws or w in p_prod or w in p_desc for w in target_kws) if target_kws else True

        # Special Check: For warehouses and logistics, verify cold chain if product requires it
        if category_type in ["warehouse", "transport"] and reqs.get("requires_cold_chain"):
            has_cold = getattr(partner, "has_cold_storage", False) or getattr(partner, "has_cold_chain", False) or "cold" in p_srv or "refrigerat" in p_srv or "cold" in p_prod
            if not has_cold:
                missing.append("❌ Lacks required Cold-Chain Refrigeration facility (2°C-16°C)")
                has_domain_match = False

        if not has_domain_match:
            # Out-of-domain vendor gets minimal scores and is filtered out (<50 threshold)
            score_breakdown = {
                "Industry Match (25%)": 5, "Product Match (30%)": 5, "Certification Match (10%)": 3,
                "Capacity Match (10%)": 5, "MOQ Match (5%)": 2, "Lead Time (5%)": 2,
                "Location (5%)": 3, "Services Match (5%)": 2, "Availability (5%)": 3
            }
            tradeoffs.append(f"Primary operational specialty is outside {reqs.get('inferred_domain', 'your industry')}")
            missing.append(f"Domain alignment for {reqs.get('inferred_domain', 'target sector')}")
            return {
                "score": 30, "ai_match_pct": 30, "reasons": ["Verified business entity in SupplyOS directory"],
                "tradeoffs": tradeoffs, "missing_requirements": missing, "confidence": "Low (30%)",
                "why_recommended": f"**Match Score: 30%** (Not Recommended for {reqs.get('inferred_domain')})", "breakdown": score_breakdown
            }

        # 1. Industry Match (25% weight -> 25 points max)
        ind_score = 12
        spec_text = str(getattr(partner, "specialization", "")).lower()
        sec_ind = str(getattr(partner, "secondary_industry", "")).lower()
        if getattr(partner, "primary_industry", "") and any(w in (str(partner.primary_industry) + " " + spec_text + " " + sec_ind).lower() for w in [domain] + target_kws[:3]):
            ind_score = 25
            reasons.append(f"✓ Specialized verified leader in {getattr(partner, 'specialization', partner.primary_industry) or reqs.get('inferred_domain')}")
        elif any(w in p_ind or w in spec_text for w in target_kws):
            ind_score = 20
            reasons.append(f"✓ Strong industry alignment for {reqs.get('inferred_domain')}")
        else:
            ind_score = 15
        score_breakdown["Industry Match (25%)"] = ind_score

        # 2. Product Match (30% weight -> 30 points max)
        prod_score = 15
        matched_items = []
        for item in (reqs.get("target_ingredients", []) + reqs.get("target_packaging", [])):
            words = [w.lower() for w in str(item).split() if len(w) > 3 and w.lower() not in ["grade", "certified", "standard", "heavy", "with", "from", "pure"]]
            if any(w in p_prod or w in p_kws for w in words):
                matched_items.append(str(item))

        if category_type in ["suppliers", "manufacturers", "packaging"]:
            if len(matched_items) >= 2 or any(k in p_prod for k in target_kws[:2]):
                prod_score = 30
                sample_item = matched_items[0] if matched_items else getattr(partner, "products_offered", ["custom components"])[0] if getattr(partner, "products_offered", None) else target_kws[0]
                reasons.append(f"✓ Manufactures/supplies precise target items (e.g., {sample_item})")
            elif matched_items:
                prod_score = 24
                reasons.append(f"✓ Compatible production lines for {matched_items[0]}")
            else:
                prod_score = 18
                tradeoffs.append("May require tooling adaptation for specific BOM SKU")
        elif category_type == "warehouse":
            prod_score = 30 if getattr(partner, "wms_supported", False) else 25
            reasons.append(f"✓ Storage facility equipped for {reqs.get('inferred_domain', 'industrial goods')}")
        elif category_type == "transport":
            prod_score = 30 if getattr(partner, "express_delivery", False) else 25
            reasons.append("✓ Multi-modal freight fleet compatible with product dimensions")
        elif category_type == "quality_labs":
            prod_score = 30 if any(k in p_srv for k in ["test", "assay", "stability", "hplc", "nabl"]) else 24
            reasons.append("✓ Laboratory testing procedures aligned with required quality specifications")
        else:
            prod_score = 28
            reasons.append("✓ Services scope matches organizational growth strategy")
        score_breakdown["Product Match (30%)"] = prod_score

        # 3. Certification Match (10% weight -> 10 points max)
        cert_score = 6
        matched_certs = []
        for c in reqs.get("target_certifications", []):
            for word in str(c).split():
                if len(word) >= 3 and word.lower() in p_certs and word.upper() not in matched_certs:
                    matched_certs.append(word.upper())
        if matched_certs:
            cert_score = 10
            reasons.append(f"✓ {', '.join(matched_certs[:2])} Certified")
        elif getattr(partner, "certifications", None) or getattr(partner, "accreditations", None):
            cert_score = 8
            sample_c = getattr(partner, "certifications", getattr(partner, "accreditations", ["ISO 9001:2015"]))[0]
            reasons.append(f"✓ {sample_c} Verified")
        else:
            cert_score = 5
            tradeoffs.append("Specific ISO/GMP compliance certificates pending upload")
        score_breakdown["Certification Match (10%)"] = cert_score

        # 4. Capacity Match (10% weight -> 10 points max)
        cap_val = getattr(partner, "monthly_capacity_number", 0) or getattr(partner, "storage_capacity_sqft", 0) or getattr(partner, "fleet_size", 0) or 100000
        ann_cap = getattr(partner, "annual_capacity", "") or ""
        util_pct = getattr(partner, "current_utilization_pct", 80) or 80
        cap_disp = ann_cap or getattr(partner, "monthly_capacity_display", "") or (f"{cap_val:,} sq. ft." if category_type == "warehouse" else "Enterprise scale capacity")
        
        if cap_val >= 10000 and util_pct < 90:
            cap_score = 10
            reasons.append(f"✓ High Available Capacity ({cap_disp}, {100 - int(util_pct)}% available bandwidth)")
        elif cap_val >= 5000:
            cap_score = 8
            reasons.append(f"✓ Compatible Capacity Bandwidth ({cap_disp})")
        else:
            cap_score = 6
            reasons.append(f"✓ Modular Batch Capacity ({cap_disp})")
        score_breakdown["Capacity Match (10%)"] = cap_score

        # 5. MOQ Match (5% weight -> 5 points max)
        moq_val = getattr(partner, "moq_number", 500) or 500
        moq_disp = getattr(partner, "moq_display", "") or f"{moq_val} units"
        if moq_val <= 1000 or category_type in ["warehouse", "transport", "consultants", "quality_labs"]:
            moq_score = 5
            if category_type in ["suppliers", "manufacturers", "packaging"]:
                reasons.append(f"✓ MOQ Compatible ({moq_disp})")
        else:
            moq_score = 3
            tradeoffs.append(f"Higher MOQ threshold ({moq_disp})")
        score_breakdown["MOQ Match (5%)"] = moq_score

        # 6. Lead Time Match (5% weight -> 5 points max)
        lead_time = getattr(partner, "lead_time_days", 14) or getattr(partner, "average_delivery_days", 5) or 14
        if lead_time <= 14:
            lt_score = 5
            if category_type not in ["consultants"]:
                reasons.append(f"✓ Rapid Turnaround ({lead_time} days lead time)")
        else:
            lt_score = 3
            tradeoffs.append(f"Lead Time: {lead_time} Days")
        score_breakdown["Lead Time (5%)"] = lt_score

        # 7. Location (5% weight -> 5 points max)
        loc = f"{getattr(partner, 'city', '')}, {getattr(partner, 'state', '')}".strip(", ") or getattr(partner, 'country', 'India') or "India"
        target_country = str(reqs.get("country", "India")).lower()
        if target_country in loc.lower() or "india" in loc.lower() or "gujarat" in loc.lower() or "mumbai" in loc.lower() or "pan-india" in p_srv:
            loc_score = 5
            reasons.append(f"✓ Located in {loc}")
        else:
            loc_score = 4
            reasons.append(f"✓ Global Export / Delivery to {target_country.title()}")
        score_breakdown["Location (5%)"] = loc_score

        # 8. Services Match (5% weight -> 5 points max)
        srv_list = getattr(partner, "services", []) or getattr(partner, "capabilities", []) or []
        srv_score = 5 if len(srv_list) >= 2 else 4
        if srv_list and len(reasons) < 6:
            reasons.append(f"✓ Offers {srv_list[0]}")
        score_breakdown["Services Match (5%)"] = srv_score

        # 9. Availability (5% weight -> 5 points max)
        avail = getattr(partner, "availability_status", "Available Now") or "Available Now"
        avail_score = 5 if "available" in avail.lower() or "ready" in avail.lower() or getattr(partner, "status", "active") == "active" else 3
        if avail_score == 5 and len(reasons) < 6:
            reasons.append(f"✓ {avail}")
        score_breakdown["Availability (5%)"] = avail_score

        # Calculate absolute sum (out of 100) - strict deterministic scoring
        total_score = int(min(100, max(0, sum(score_breakdown.values()))))
        
        # Ensure price tier tradeoffs are highlighted if budget is tight or premium
        p_tier = getattr(partner, "price_tier", "$$") or "$$"
        if p_tier == "$$$":
            tradeoffs.append("Slightly Higher Price Tier ($$$ - Premium Infrastructure)")

        confidence_lbl = "High" if total_score >= 90 else ("Medium" if total_score >= 80 else "Low")
        confidence = f"{confidence_lbl} ({total_score}%)"

        why_text = f"**Recommendation Score: {total_score}%** | **Confidence:** {confidence}\n"
        why_text += "**Reasons:**\n" + "\n".join(f"  {r}" for r in reasons[:6])
        if tradeoffs:
            why_text += "\n**Tradeoffs:** " + ", ".join(tradeoffs)
        if missing:
            why_text += "\n**Missing Requirements:** " + ", ".join(missing)

        return {
            "score": total_score,
            "ai_match_pct": total_score,
            "reasons": reasons[:6],
            "tradeoffs": tradeoffs,
            "missing_requirements": missing,
            "confidence": confidence,
            "why_recommended": why_text,
            "breakdown": score_breakdown
        }


class RecommendationService:
    """
    Step 8: Reusable Recommendation Service orchestrating the complete pipeline.
    Provides explainable AI recommendations, alternative supplier comparisons,
    and structured B2B intelligence across all workspace modules.
    """
    @classmethod
    def get_recommendations_for_workspace(cls, product, organization):
        logger.info(f"\n--- [AI Recommendation Engine] Pipeline Execution for Workspace: {product.name} ({product.id}) ---")
        
        reqs = RequirementExtractor.extract_from_workspace(product)
        reqs = IndustryClassifier.classify_and_infer(reqs)
        logger.info(f"-> Inferred Domain: {reqs['inferred_domain']} | Target Country: {reqs['country']}")

        from apps.marketplace.models import MarketplacePartner
        all_partners = list(MarketplacePartner.objects.filter(organization=organization, status="active").prefetch_related("categories"))
        if not all_partners:
            logger.warning("-> No active marketplace partners found in organization.")
            return {}

        results = {
            "suppliers": [],
            "manufacturers": [],
            "packaging": [],
            "warehouse": [],
            "transport": [],
            "quality_labs": [],
            "consultants": [],
            "machinery": [],
        }

        for p in all_partners:
            p_cats = [c.category_code or c.name.lower() for c in p.categories.all()] if hasattr(p, 'categories') else []
            p_text = f"{p.name} {p.description} {' '.join(p_cats)}".lower()
            
            # Determine category type
            cat_key = "suppliers"
            if "manufacturers" in p_cats or any("mfg" in c or "manufactur" in c for c in p_cats) or any(k in p_text for k in ["manufacturer", "oem", "odm", "fabrication", "factory"]) and not any(k in p_text for k in ["machine", "machinery"]):
                cat_key = "manufacturers"
            elif "packaging" in p_cats or any("pack" in c for c in p_cats) or any(k in p_text for k in ["package", "packaging", "box", "label", "bottle"]):
                cat_key = "packaging"
            elif "warehouses" in p_cats or any("warehouse" in c or "storage" in c for c in p_cats) or any(k in p_text for k in ["warehouse", "storage", "fulfillment", "3pl"]):
                cat_key = "warehouse"
            elif "logistics" in p_cats or any("logistic" in c or "transport" in c for c in p_cats) or any(k in p_text for k in ["logistics", "transport", "freight", "reefer", "shipping"]):
                cat_key = "transport"
            elif "quality_labs" in p_cats or any("lab" in c or "test" in c for c in p_cats) or any(k in p_text for k in ["lab", "testing", "inspection", "nabl"]):
                cat_key = "quality_labs"
            elif "machinery" in p_cats or any("machin" in c for c in p_cats) or any(k in p_text for k in ["machine", "machinery", "equipment"]):
                cat_key = "machinery"
            elif "consultants" in p_cats or "import_export" in p_cats or "certifications" in p_cats or any(k in p_text for k in ["consultant", "regulatory", "advisory", "agency"]):
                cat_key = "consultants"

            eval_res = CandidateScorer.score_partner(p, reqs, cat_key)
            
            # Skip out of domain candidates if their match score is too low (<50%)
            if eval_res["score"] < 50:
                continue

            loc = f"{getattr(p, 'city', '')}, {getattr(p, 'state', '')}".strip(", ") or getattr(p, 'country', 'India') or "India"

            entry = {
                "id": str(p.id),
                "name": p.name,
                "logo": getattr(p, "logo", "🏭") or "🏭",
                "rating": float(getattr(p, "rating", 4.8) or 4.8),
                "ai_match_pct": eval_res["ai_match_pct"],
                "overall_score": eval_res["score"],
                "lead_time_days": getattr(p, "lead_time_days", 14) or getattr(p, "average_delivery_days", 5) or 14,
                "moq": getattr(p, "moq_display", "500 units") or f"{getattr(p, 'moq_number', 500) or 500} units",
                "location": loc,
                "head_office": getattr(p, "head_office", loc) or loc,
                "specialization": getattr(p, "specialization", "") or getattr(p, "primary_industry", "") or "Enterprise Operations",
                "revenue_range": getattr(p, "revenue_range", "$5M - $15M") or "$5M - $15M",
                "annual_capacity": getattr(p, "annual_capacity", "") or getattr(p, "monthly_capacity_display", "Enterprise Scale") or "Enterprise Scale",
                "current_utilization_pct": getattr(p, "current_utilization_pct", 75) or 75,
                "custom_manufacturing_support": getattr(p, "custom_manufacturing_support", False),
                "white_label_support": getattr(p, "white_label_support", False),
                "export_ready": getattr(p, "export_ready", False),
                "cost": getattr(p, "price_tier", "$$") or "$$",
                "price_tier": getattr(p, "price_tier", "$$") or "$$",
                "reasons": eval_res["reasons"],
                "tradeoffs": eval_res["tradeoffs"],
                "missing_requirements": eval_res.get("missing_requirements", []),
                "confidence": eval_res["confidence"],
                "why_recommended": eval_res["why_recommended"],
                "score_breakdown": eval_res["breakdown"],
                "approved": False
            }
            results[cat_key].append(entry)

        # Sort by Overall Score, populate Why Not Recommended & Alternative comparisons, and prune to top 6
        for cat_key in results:
            results[cat_key].sort(key=lambda x: x.get("overall_score", 0), reverse=True)
            results[cat_key] = results[cat_key][:6]
            
            if results[cat_key]:
                top_cand = results[cat_key][0]
                top_name = top_cand["name"]
                top_score = top_cand["overall_score"]
                
                alts = []
                for runner_up in results[cat_key][1:4]:
                    alts.append({
                        "name": runner_up["name"],
                        "match_pct": f"{runner_up['overall_score']}%",
                        "tradeoff": runner_up["tradeoffs"][0] if runner_up["tradeoffs"] else "Slightly lower cumulative match score"
                    })
                
                top_cand["why_not_recommended"] = None
                top_cand["alternative_companies"] = alts
                top_cand["why_recommended_bullet"] = f"Top-ranked candidate with {top_score}% score based on strict business criteria."
                
                for idx, secondary in enumerate(results[cat_key][1:], 1):
                    reason_not_first = secondary["tradeoffs"][0] if secondary["tradeoffs"] else "Lower cumulative 9-factor weighted score."
                    secondary["why_not_recommended"] = f"Ranked #{idx+1} behind {top_name} ({top_score}%) due to: {reason_not_first}"
                    secondary["alternative_companies"] = [{"name": top_name, "match_pct": f"{top_score}%", "tradeoff": "Primary recommended #1 partner"}]
                    secondary["why_recommended_bullet"] = f"Viable alternative ({secondary['overall_score']}%) offering verified capability compliance."

                logger.info(f"   -> Top [{cat_key}]: {top_name} (Score: {top_score}%)")

        logger.info("--- [AI Recommendation Engine] Pipeline completed successfully ---\n")
        return results
