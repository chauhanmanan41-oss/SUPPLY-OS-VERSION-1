import random
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import transaction
from django.utils.text import slugify

from apps.organizations.models import Organization
from apps.marketplace.models import MarketplaceCategory, MarketplacePartner
from apps.suppliers.models import Supplier
from apps.manufacturers.models import Manufacturer


class Command(BaseCommand):
    help = "Seeds 490 authentic B2B business records across all 10 categories into SupplyOS Marketplace"

    def add_arguments(self, parser):
        parser.add_argument("--organization", type=str, help="Specific organization name to import into")
        parser.add_argument("--all", action="store_true", default=True, help="Seed into all existing active organizations (default)")

    def handle(self, *args, **options):
        org_name = options.get("organization")
        if org_name:
            orgs = Organization.objects.filter(name__icontains=org_name)
            if not orgs.exists():
                self.stderr.write(self.style.ERROR(f"No organization found matching '{org_name}'"))
                return
        else:
            orgs = Organization.objects.filter(is_active=True)
            if not orgs.exists():
                self.stderr.write(self.style.ERROR("No active organizations found in SupplyOS."))
                return

        for org in orgs:
            self.stdout.write(self.style.NOTICE(f"\n--- Seeding Marketplace Master Data for Organization: {org.name} ---"))
            with transaction.atomic():
                self.seed_for_organization(org)
            self.stdout.write(self.style.SUCCESS(f"Successfully seeded Marketplace for {org.name}."))

        self.stdout.write(self.style.NOTICE("\n--- Running deep B2B structured enrichment across all partners ---"))
        call_command("enrich_marketplace")

    def seed_for_organization(self, org):
        # 1. Ensure Categories Exist
        categories_data = [
            {"name": "Raw Material Suppliers", "code": "raw_materials", "icon": "🧪", "color": "#16a34a", "bg": "rgba(22,163,74,0.08)", "desc": "Ingredients, chemicals & bulk active formulations"},
            {"name": "Manufacturers", "code": "manufacturers", "icon": "🏭", "color": "#3b82f6", "bg": "rgba(59,130,246,0.08)", "desc": "GMP-certified contract & private label OEM/ODM"},
            {"name": "Packaging Companies", "code": "packaging", "icon": "📦", "color": "#a855f7", "bg": "rgba(168,85,247,0.08)", "desc": "Bottles, jars, pouches, boxes & high-speed labels"},
            {"name": "Warehouses", "code": "warehouses", "icon": "🏪", "color": "#f97316", "bg": "rgba(249,115,22,0.08)", "desc": "Dry, cold-chain & customs bonded port storage"},
            {"name": "Logistics Providers", "code": "logistics", "icon": "🚚", "color": "#14b8a6", "bg": "rgba(20,184,166,0.08)", "desc": "Pan-India FTL/LTL freight, ocean & air express"},
            {"name": "Quality Testing Labs", "code": "quality_labs", "icon": "🧫", "color": "#eab308", "bg": "rgba(234,179,8,0.08)", "desc": "NABL accredited HPLC, assay & shelf-life testing"},
            {"name": "Certification Agencies", "code": "certifications", "icon": "🏅", "color": "#ff8a73", "bg": "rgba(255,138,115,0.08)", "desc": "GMP, FSSAI, CE, ISO 9001 & export compliance audits"},
            {"name": "Import Export Companies", "code": "import_export", "icon": "🌐", "color": "#3b82f6", "bg": "rgba(59,130,246,0.08)", "desc": "Customs clearance, port forwarding & trade tariffs"},
            {"name": "Business Consultants", "code": "consultants", "icon": "💼", "color": "#a855f7", "bg": "rgba(168,85,247,0.08)", "desc": "Factory setup, lean six-sigma & supply chain strategy"},
            {"name": "Machinery Suppliers", "code": "machinery", "icon": "⚙️", "color": "#6b7280", "bg": "rgba(107,114,128,0.08)", "desc": "High-speed processing, filling & automation equipment"},
        ]
        cat_map = {}
        for c in categories_data:
            slug = slugify(c["name"])
            cat, _ = MarketplaceCategory.objects.update_or_create(
                organization=org,
                slug=slug,
                defaults={
                    "name": c["name"],
                    "category_code": c["code"],
                    "icon": c["icon"],
                    "color_theme": c["color"],
                    "bg_theme": c["bg"],
                    "description": c["desc"],
                }
            )
            cat_map[c["code"]] = cat

        # Common location pools
        locations = [
            ("Pune", "Maharashtra", "India", "411001"),
            ("Mumbai", "Maharashtra", "India", "400001"),
            ("Ahmedabad", "Gujarat", "India", "380001"),
            ("Surat", "Gujarat", "India", "395001"),
            ("Chennai", "Tamil Nadu", "India", "600001"),
            ("Hyderabad", "Telangana", "India", "500001"),
            ("Bangalore", "Karnataka", "India", "560001"),
            ("Delhi NCR", "Delhi", "India", "110001"),
            ("Baddi", "Himachal Pradesh", "India", "173205"),
            ("Indore", "Madhya Pradesh", "India", "452001"),
        ]

        # Helper for generating names without collisions
        def gen_names(prefixes, suffixes, count):
            combos = []
            for p in prefixes:
                for s in suffixes:
                    combos.append(f"{p} {s}")
            random.Random(42).shuffle(combos)
            return combos[:count]

        total_seeded = 0
        
        # Define 6 domain-specific Industry Profiles for realistic specialization
        industry_profiles = [
            {
                "industry": "Food & Nutraceuticals",
                "materials": ["Whey Protein Isolate 90%", "Creatine Monohydrate", "Ashwagandha Extract", "L-Ascorbic Acid (Vitamin C)", "Soy Lecithin Fluid", "Steviol Glycosides 97%"],
                "mfg_caps": ["Powder Blending & Sachets", "Softgel & Hard Gel Encapsulation", "Tabletting & Coating", "Nutrient Bar Extrusion", "FSSAI Food Grade Cleanroom"],
                "mfg_machs": ["Automatic Fluid Bed Dryer", "Continuous Ribbon Blenders", "High-Speed Rotary Tablet Press", "Automatic Sachet Packing Line"],
                "pkg_prods": ["PET Protein Jars (500g - 2kg)", "Standup Resealable Zipper Pouches", "Food-Grade Induction Foil Wads", "Shrink Sleeve Rolls"],
                "wh_desc": "Grade-A hygienic food and nutraceutical warehouse with humidity and temperature controls.",
                "wh_certs": ["FSSAI Food Storage Approved", "ISO 22000 Food Safety", "Pest & Rodent Free Certified"],
                "log_desc": "Food-grade supply chain transport equipped with clean containers and optional reefer capability.",
                "lab_tests": ["HPLC Active Ingredient Assays", "Microbial Shelf-life Assays", "Heavy Metals ICP-MS Analysis", "Protein Content Nitrogen Assays"],
                "lab_certs": ["NABL Accredited", "FSSAI Authorized Food Lab", "ISO/IEC 17025"],
                "cert_stds": ["FSSAI License Support", "WHO-GMP Audit Certification", "ISO 22000 Food Safety", "Halal & Kosher Compliance"],
                "cons_specs": ["Nutraceutical Factory Setup", "FSSAI Regulatory Strategy", "Ingredient Sourcing Cost Reduction"],
                "machs_offered": ["High-Speed Rotary Tablet Presses", "Continuous Powder Ribbon Blenders", "Sachet & Pouch Filling Machines"],
                "general_certs": ["FSSAI Compliant", "WHO-GMP Certified", "ISO 22000 Food Safety", "Halal Certified"],
            },
            {
                "industry": "Electronics & Technology",
                "materials": ["OLED Retina Displays", "Lithium Polymer Battery Cells", "Microchip SoC Assemblies", "Multi-layer PCB Boards", "Precision Aluminum Housings", "Gold-plated Connectors"],
                "mfg_caps": ["SMT Surface Mount Cleanroom", "Automated PCB Soldering", "Precision Electronic Assembly", "Electrostatic Discharge (ESD) Testing", "Laser Etching & Enclosure Fitting"],
                "mfg_machs": ["High-Speed SMT Pick & Place Machine", "Automated Wave Soldering Oven", "CNC Precision Case Milled Centers", "Inline Optical Inspection (AOI)"],
                "pkg_prods": ["ESD Anti-Static Shielding Bags", "Precision EVA Foam Inserts", "Rigid Retail Gift Box Packaging", "High-Gloss Polymeric Hologram Labels"],
                "wh_desc": "ESD-protected dust-free electronic components vault and assembly warehousing center.",
                "wh_certs": ["ESD Anti-Static Certified", "ISO 9001:2015", "High-Security CCTV Monitored Vault"],
                "log_desc": "Air freight express and fragile electronics transport with shock-absorbing suspension vehicles.",
                "lab_tests": ["Short Circuit & Thermal Overload Testing", "RoHS Heavy Metal & Lead Screening", "Electromagnetic Interference (EMI/EMC) Assays", "Drop & Vibration Durability Studies"],
                "lab_certs": ["ISO/IEC 17025 Accredited", "RoHS Compliance Lab", "CE & FCC Certified Test Range"],
                "cert_stds": ["CE Marking for Europe", "FCC Regulatory Certification", "RoHS Compliance Audit", "ISO 9001 Quality Management"],
                "cons_specs": ["Turnkey SMT Line Setup", "Component Supply Chain Resilience", "Electronics Yield Optimization"],
                "machs_offered": ["High-Speed SMT Pick & Place Lines", "Reflow & Wave Soldering Systems", "Precision Laser Enclosure Etchers"],
                "general_certs": ["RoHS Compliant", "CE Certified", "ISO 9001:2015", "FCC Approved"],
            },
            {
                "industry": "Furniture & Woodworking",
                "materials": ["Seasoned Hardwood Lumber", "High-Density Upholstery Foam", "Powder-Coated Steel Tubing", "Premium Leather & Fabrics", "MDF & HDF Panels", "Heavy-Duty Steel Hinges"],
                "mfg_caps": ["CNC Precision Wood Milling", "Automated Tube Bending & Welding", "Heavy Upholstery & Cushioning Line", "Automated Powder Coating", "Modular Furniture Assembly"],
                "mfg_machs": ["5-Axis CNC Woodworking Router", "Automated Steel Tube Bending Center", "Heavy-Duty Upholstery Sewing Rigs", "Edge Banding Automation Line"],
                "pkg_prods": ["Heavy-Duty 7-Ply Corrugated Shipper Boxes", "Corner Protection Foam Caps", "Stretch Pallet Wrap Film Rolls", "Corrugated Cardboard Dividers"],
                "wh_desc": "High-bay wide-aisle pallet storage facility engineered for heavy furniture and building hardware.",
                "wh_certs": ["Fire Safety Level-5 Certified", "Heavy Racking Safe-Load Compliant", "ISO 9001 Storage"],
                "log_desc": "Dedicated heavy road transport and container hauling with lift-gate and white-glove logistics capability.",
                "lab_tests": ["Structural Static & Fatigue Load Testing", "Formaldehyde Emission Screening", "Fabric Martindale Abrasion Assays", "Coating Corrosion & Salt Spray Test"],
                "lab_certs": ["BIFMA Testing Accredited", "NABL Structural Test Lab", "FSC Wood Compliance Validator"],
                "cert_stds": ["BIFMA Ergonomic & Safety Cert", "FSC Sustainable Forestry Certification", "ISO 9001 Quality Management"],
                "cons_specs": ["Woodworking Factory Optimization", "Flat-Pack Logistics Reduction", "Sustainable Wood Sourcing Strategy"],
                "machs_offered": ["5-Axis CNC Woodworking Routers", "Automated Edge Banders & Saws", "Industrial Tube Welding Machines"],
                "general_certs": ["FSC Sustainable Certified", "BIFMA Compliant", "ISO 9001:2015", "CE Safe Standard"],
            },
            {
                "industry": "Pharmaceuticals & Medicine",
                "materials": ["Active Pharmaceutical Ingredients (API)", "Microcrystalline Cellulose (MCC)", "Magnesium Stearate (EP/USP)", "Sterile Saline Base Fluid", "High-Grade Gelatin Capsule Shells", "L-Ascorbic Acid USP Grade"],
                "mfg_caps": ["Class 10,000 Sterile Cleanroom Formulation", "High-Speed Rotary Tablet Pressing", "Blister Foil Packing & Cartoning", "Aseptic Liquid Vial Bottling", "Clinical Pilot Scale R&D"],
                "mfg_machs": ["61-Station Rotary Tablet Press", "Automated Blister Packaging Machine", "Aseptic Liquid Filling & Sealing Rig", "High Shear Granulators"],
                "pkg_prods": ["Child-Resistant HDPE Pharma Bottles", "Aluminium Foil Blister Packs", "Induction Seal Bottle Caps", "Tamper-Evident Holographic Cartons"],
                "wh_desc": "WHO-GDP compliant cold chain pharmaceutical storage vault with 24/7 temperature monitoring.",
                "wh_certs": ["WHO-GDP Cold Chain Certified", "FDA Regulated Storage", "24/7 Temp Monitored Vault"],
                "log_desc": "Refrigerated cold-chain pharmaceutical freight with live temperature GPS tracking.",
                "lab_tests": ["HPLC & GC Active Ingredient Assay", "Microbial & Sterile Sterility Testing", "ICH Accelerated Stability Studies", "Dissolution & Bioavailability Testing"],
                "lab_certs": ["NABL Accredited", "US FDA Regulated QA Lab", "WHO-GLP Compliant Facility"],
                "cert_stds": ["WHO-GMP Audit Support", "US FDA Plant Registration", "EU GMP Certification", "NABL Lab Accreditation Setup"],
                "cons_specs": ["FDA / MHRA Audit Preparation", "Sterile Room Cleanroom Validation", "Pharma Batch Record Digitalization"],
                "machs_offered": ["High-Speed Rotary Tablet Presses", "Automatic Blister Foil Pack Lines", "Aseptic Liquid Ampoule Filling"],
                "general_certs": ["WHO-GMP Certified", "US FDA Inspected", "ISO 9001:2015", "EU GMP Standard"],
            },
            {
                "industry": "Cosmetics & Personal Care",
                "materials": ["Natural Cold-Pressed Essential Oils", "Sodium Lauryl Sulfate & Surfactants", "Botanical Herb & Flower Extracts", "Emulsifying Waxes & Silicones", "Zinc Oxide Cosmetic Grade", "Shea Butter & Argan Oils"],
                "mfg_caps": ["High-Speed Liquid Rotary Bottling", "Emulsion Homogenization & Mixing", "Cosmetic Cream Tube Filling", "Natural Organic Preservation Lab", "Private Label Scent Formulation"],
                "mfg_machs": ["Vacuum Emulsifier Homogenizing Mixer", "Automatic Shampoo & Lotion Bottling Line", "Cosmetic Cream Tube Sealing Machine"],
                "pkg_prods": ["Luxury PET & HDPE Shampoo Bottles", "Precision Lotion Pump Dispensers", "Glass Cosmetics Cream Jars", "Metallic Foil Stamped Labels"],
                "wh_desc": "Temperature and humidity-controlled warehouse designed for organic cosmetics and liquid personal care products.",
                "wh_certs": ["Cosmetics Storage Approved", "ISO 22716 Good Storage", "Climate Controlled Certified"],
                "log_desc": "Air express and insulated container shipping preventing temperature degradation of cosmetics.",
                "lab_tests": ["Dermatological Safety & Patch Testing", "Microbial Contamination Assay", "Emulsion Stability & Centrifuge Test", "Heavy Metals In Cosmetics Screening"],
                "lab_certs": ["ISO 22716 Cosmetics QA Lab", "NABL Accredited Testing", "FDA Cosmetics Competent Lab"],
                "cert_stds": ["ISO 22716 Cosmetics GMP", "Cruelty-Free Leaping Bunny Cert", "Organic ECOCERT Certification", "FDA Cosmetics Registration"],
                "cons_specs": ["Cosmetics Brand Launch Formulation", "Organic ECOCERT Compliance", "Lotion & Cream Scale-up Strategy"],
                "machs_offered": ["Vacuum Emulsifying Homogenizers", "Automatic Lotion Rotary Fillers", "Tube Filling & Sealing Equipment"],
                "general_certs": ["ISO 22716 Cosmetics GMP", "Organic ECOCERT", "Cruelty-Free Certified", "ISO 9001:2015"],
            },
            {
                "industry": "Footwear & Textiles",
                "materials": ["High-Rebound EVA Foam Midsoles", "Breathable Polyester Mesh Fabric", "Carbon Fiber Stability Plates", "Abrasion-Resistant Rubber Outsoles", "Premium Cowhide & Synthetic Leather", "High-Tenacity Nylon Stitching Thread"],
                "mfg_caps": ["High-Pressure EVA Molding", "Automated Computer Stitching Lines", "Lasting & Cementing Shoe Assembly", "Seamless Upper Thermal Welding", "Laser Leather Pattern Cutting"],
                "mfg_machs": ["Automatic EVA Injection Molding Rig", "Multi-Head Computerized Stitching Machines", "Rotary Shoe Sole Bonding Line"],
                "pkg_prods": ["Corrugated Retail Shoe Boxes", "Printed Silk Tissue Paper Inserts", "Custom Woven Apparel & Tongue Labels", "Outer Corrugated Master Cartons"],
                "wh_desc": "Apparel and footwear distribution hub with automated barcode sortation and shelving.",
                "wh_certs": ["Apparel Distribution Approved", "ISO 9001 Storage", "Dust-Free Garment Care Certified"],
                "log_desc": "Pan-India fashion and retail distribution logistics with carton-level barcode scanning.",
                "lab_tests": ["Bally Flex & Sole Abrasion Testing", "Upper Mesh Tear Strength Assay", "Color Fastness & Washing Studies", "Cushioning Rebound & Shock Absorption Test"],
                "lab_certs": ["NABL Footwear & Textile Test Lab", "ISO 17025 Accredited", "CE Protective Footwear Validator"],
                "cert_stds": ["ISO 9001 Quality Management", "SA8000 Ethical Labor Certification", "CE Footwear Standard Support", "Global Organic Textile Standard (GOTS)"],
                "cons_specs": ["Footwear Assembly Lean Optimization", "Shoe Sole Material Lightweighting", "Ethical Factory Audit Preparation"],
                "machs_offered": ["EVA Foam Sole Injection Machines", "Computerized Multi-Head Stitchers", "Automatic Leather Pattern Cutters"],
                "general_certs": ["SA8000 Ethical Certified", "ISO 9001:2015", "CE Footwear Safety", "GOTS Textile Certified"],
            }
        ]

        # 1. Raw Material Suppliers (100)
        pfx_raw = ["BioSynth", "Apex Chem", "PureVibe", "Organika", "VitaGen", "SynthForm", "NutraBulk", "AccuMat", "ChemPro", "PrimeIngredient", "HerbExtract", "ActiveForm", "CeloZymes", "Elemental", "PolymerX", "BioActive", "SupremeChem", "PharmaMat", "VitalityIng", "ApexNutra", "ZenithChem", "AlphaActive", "CoreExtracts", "SterlingChem", "MegaIng"]
        sfx_raw = ["India Pvt Ltd", "Synthetics", "Lab Materials", "Chemical Solutions", "Biotech Corp", "Global Supplies", "Ingredients Ltd", "Formulations", "Organics", "Enterprise", "Global Labs"]
        raw_names = gen_names(pfx_raw, sfx_raw, 100)
        
        for idx, name in enumerate(raw_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[idx % len(locations)]
            moqs = [(50, "50 kg / units"), (100, "100 kg / units"), (250, "250 units"), (500, "500 units"), (1000, "1,000 units")]
            moq = moqs[idx % len(moqs)]
            rating = round(4.2 + (idx % 8) * 0.1, 2)
            mats = profile["materials"][:3] + [profile["materials"][(idx // 6) % len(profile["materials"])]]
            
            supp_account = None
            if idx < 15:
                supp_account, _ = Supplier.objects.get_or_create(
                    organization=org,
                    name=name,
                    defaults={"city": loc[0], "country": loc[2], "materials_supplied": mats, "status": "active"}
                )

            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name),
                    "logo": "🧪",
                    "description": f"Leading raw material supplier specializing in {profile['industry']} ingredients and components including {mats[0]} and {mats[1]}.",
                    "established_year": 2005 + (idx % 15),
                    "employees_range": "50 - 200 Employees",
                    "annual_turnover": "$5M - $20M",
                    "city": loc[0], "state": loc[1], "country": loc[2], "postal_code": loc[3],
                    "address": f"Plot No {40+idx}, Industrial Area Phase II, {loc[0]}",
                    "price_tier": "$$" if idx % 2 == 0 else "$$$",
                    "verified_status": True,
                    "moq_number": moq[0], "moq_display": moq[1],
                    "lead_time_days": 5 + (idx % 10),
                    "response_time_hours": 2 + (idx % 6),
                    "response_time_display": f"< {2 + (idx % 6)} hrs",
                    "quality_score": 88 + (idx % 12),
                    "performance_score": 87 + (idx % 12),
                    "ai_score": 88 + (idx % 12),
                    "rating": rating,
                    "reviews_count": 25 + (idx * 3 % 200),
                    "completed_projects_count": 80 + (idx * 5 % 400),
                    "availability_status": "Available Now" if idx % 5 != 0 else "Low Stock — Order Soon",
                    "certifications": profile["general_certs"],
                    "industries_served": [profile["industry"], "General Industrial"],
                    "delivery_regions": ["Pan-India", "Export Available", "Asia-Pacific"],
                    "materials_supplied": mats,
                    "products_offered": mats,
                    "supplier_account": supp_account
                }
            )
            p.categories.set([cat_map["raw_materials"]])
            total_seeded += 1

        # 2. Manufacturers (100)
        pfx_mfg = ["Nutraceutix", "Formulatech", "PrimeMfg", "BioCaps", "MediSynth", "MaximalFab", "ZenithProd", "ProBuild", "SterlingMfg", "ApexHealth", "BioPro", "CuraForm", "NovusLabs", "InnovaMfg", "PrecisionMake", "MegaFactory", "UltraForm", "OmniProd", "TruQuality", "VertexWorks", "OlympusFab", "DynastyMfg", "ProlineHealth", "SupremeFactory"]
        sfx_mfg = ["Manufacturing", "Pharmaceuticals", "Laboratories", "Contract Mfg", "Private Label Corp", "Tech Industries", "Factory Systems", "Production Ltd", "Works Pvt Ltd", "Healthcare Mfg", "Enterprises"]
        mfg_names = gen_names(pfx_mfg, sfx_mfg, 100)
        
        for idx, name in enumerate(mfg_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 2) % len(locations)]
            caps = profile["mfg_caps"]
            machs = profile["mfg_machs"]
            capacity = (idx % 10 + 2) * 50000
            
            mfg_account = None
            if idx < 15:
                mfg_account, _ = Manufacturer.objects.get_or_create(
                    organization=org,
                    name=name,
                    defaults={"city": loc[0], "country": loc[2], "capabilities": caps, "status": "active"}
                )

            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name),
                    "logo": "🏭",
                    "description": f"Verified OEM/ODM contract manufacturer specializing in {profile['industry']} with advanced capabilities in {caps[0]} and {caps[1]}.",
                    "established_year": 2000 + (idx % 20),
                    "employees_range": "100 - 500 Employees",
                    "annual_turnover": "$10M - $50M",
                    "city": loc[0], "state": loc[1], "country": loc[2], "postal_code": loc[3],
                    "address": f"Factory Gate No {12+idx}, GIDC Estate, {loc[0]}",
                    "price_tier": "$$$" if idx % 3 == 0 else ("$" if idx % 4 == 0 else "$$"),
                    "verified_status": True,
                    "moq_number": 5000 if idx % 2 == 0 else 2000,
                    "moq_display": "5,000 units" if idx % 2 == 0 else "2,000 units",
                    "lead_time_days": 14 + (idx % 15),
                    "response_time_hours": 4 + (idx % 8),
                    "response_time_display": f"< {4 + (idx % 8)} hrs",
                    "quality_score": 89 + (idx % 11),
                    "performance_score": 90 + (idx % 10),
                    "ai_score": 89 + (idx % 10),
                    "rating": round(4.4 + (idx % 6) * 0.1, 2),
                    "reviews_count": 40 + (idx * 4 % 250),
                    "completed_projects_count": 150 + (idx * 8 % 800),
                    "availability_status": "Production Slots Available" if idx % 4 != 0 else "Booked 2 Weeks Ahead",
                    "certifications": profile["general_certs"],
                    "industries_served": [profile["industry"], "General OEM/ODM"],
                    "delivery_regions": ["Pan-India Delivery", "Export FOB Port", "US / Europe Ready"],
                    "capabilities": caps,
                    "machinery": machs,
                    "oem_available": True,
                    "odm_available": True if idx % 2 == 0 else False,
                    "monthly_capacity_display": f"{capacity:,} units/mo",
                    "monthly_capacity_number": capacity,
                    "manufacturer_account": mfg_account
                }
            )
            p.categories.set([cat_map["manufacturers"]])
            total_seeded += 1

        # 3. Packaging Companies (60)
        pfx_pkg = ["Alpha Pack", "ContainerPro", "EcoCarton", "FlexoPrint", "GlassineCorp", "PolyJar", "LabelWorks", "PackSynth", "BoxMaster", "SecurePack", "VibeContainers", "SealTech", "TrueWrap", "CrownPack"]
        sfx_pkg = ["Packaging Pvt Ltd", "Containers", "Print Systems", "Solutions", "Industries", "Pack Ltd"]
        pkg_names = gen_names(pfx_pkg, sfx_pkg, 60)
        
        for idx, name in enumerate(pkg_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 4) % len(locations)]
            prods = profile["pkg_prods"]
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "📦",
                    "description": f"High-speed industrial packaging manufacturer delivering premium {profile['industry']} solutions including {prods[0]}.",
                    "established_year": 2010 + (idx % 12), "employees_range": "50 - 150 Employees", "annual_turnover": "$3M - $12M",
                    "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 5000, "moq_display": "5,000 pcs", "lead_time_days": 7 + (idx % 7),
                    "rating": round(4.4 + (idx % 6) * 0.1, 2), "quality_score": 88 + (idx % 11), "ai_score": 88 + (idx % 11),
                    "certifications": profile["general_certs"],
                    "industries_served": [profile["industry"]],
                    "products_offered": prods, "capabilities": ["Custom UV Printing", "Mold Modification", "Rapid Prototyping"],
                    "oem_available": True
                }
            )
            p.categories.set([cat_map["packaging"]])
            total_seeded += 1

        # 4. Warehouses (50)
        pfx_wh = ["ColdSpace", "AgriStore", "LogiBox", "ApexWarehouse", "SafeStore", "PrimeVault", "DryStore", "BhiwandiFulfill", "WesternHub", "InlandStorage"]
        sfx_wh = ["Warehousing", "Logistics Hub", "Fulfillment Center", "3PL Park", "Storage Solutions"]
        wh_names = gen_names(pfx_wh, sfx_wh, 50)
        wh_locations_pool = ["Bhiwandi, Thane (NH-3)", "Nhava Sheva Port, Navi Mumbai", "Sanand Industrial Park, Ahmedabad", "Sriperumbudur, Chennai", "Chakan MIDC, Pune", "Gurgaon Logistics Park, NCR"]
        
        for idx, name in enumerate(wh_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 5) % len(locations)]
            wh_locs = random.Random(idx).sample(wh_locations_pool, k=2)
            sqft = 25000 * (1 + idx % 4)
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "🏪",
                    "description": profile["wh_desc"],
                    "established_year": 2012 + (idx % 10), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 500, "moq_display": "500 sq.ft minimum", "lead_time_days": 1, "response_time_hours": 2, "response_time_display": "< 2 hrs",
                    "rating": round(4.4 + (idx % 6) * 0.1, 2), "quality_score": 89 + (idx % 10), "ai_score": 88 + (idx % 10),
                    "certifications": profile["wh_certs"],
                    "industries_served": [profile["industry"]],
                    "storage_capacity_sqft": sqft,
                    "has_cold_storage": "Cold" in profile["wh_desc"] or idx % 2 == 0,
                    "is_bonded_warehouse": "Vault" in profile["wh_desc"] or idx % 3 == 0,
                    "warehouse_locations": wh_locs,
                    "availability_status": f"{sqft // 5:,} sq.ft ready for occupancy"
                }
            )
            p.categories.set([cat_map["warehouses"]])
            total_seeded += 1

        # 5. Logistics Providers (50)
        pfx_lgx = ["VRL Express", "SafeExpressways", "BlueOcean Freight", "CargoLink", "TransIndia", "RoadMaster", "AirBridge", "ColdLogi", "RapidPort", "HaulEx"]
        sfx_lgx = ["Logistics Network", "Freight Forwarders", "Transport Pvt Ltd", "Supply Carriers", "Express Delivery"]
        lgx_names = gen_names(pfx_lgx, sfx_lgx, 50)
        shipping_modes_pool = ["Road Transport (FTL/LTL)", "Reefer Cold Chain Trucks", "Air Freight Express", "Ocean FCL / LCL Shipping", "Cross-Border Multimodal"]
        
        for idx, name in enumerate(lgx_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 6) % len(locations)]
            modes = random.Random(idx).sample(shipping_modes_pool, k=3)
            fleet = (idx % 8 + 2) * 25
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "🚚",
                    "description": profile["log_desc"],
                    "established_year": 2008 + (idx % 12), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "No minimum (LTL Support)", "lead_time_days": 2 + (idx % 4), "response_time_hours": 1, "response_time_display": "< 1 hr",
                    "rating": round(4.4 + (idx % 6) * 0.1, 2), "quality_score": 89 + (idx % 10), "ai_score": 88 + (idx % 10),
                    "certifications": ["ISO 9001:2015", "GDP Compliant", "IATA Licensed Air Forwarder", "AEO Certified"],
                    "industries_served": [profile["industry"]],
                    "fleet_size": fleet, "shipping_modes": modes,
                    "delivery_regions": ["Pan-India Network", "Major Port Hubs", "GCC & Southeast Asia"]
                }
            )
            p.categories.set([cat_map["logistics"]])
            total_seeded += 1

        # 6. Quality Testing Labs (30)
        pfx_lab = ["PharmaForm", "AnkurLabs", "BioCheck", "AccuTest", "QualityValidate", "SpecAnalytical", "VibeLab", "ProAssay"]
        sfx_lab = ["Analytical Laboratories", "Testing Center", "QA Research", "Compliance Lab", "Scientific Services"]
        lab_names = gen_names(pfx_lab, sfx_lab, 30)
        
        for idx, name in enumerate(lab_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 1) % len(locations)]
            tests = profile["lab_tests"]
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "🧫",
                    "description": f"NABL accredited testing laboratory dedicated to {profile['industry']} QA verification and analytical testing.",
                    "established_year": 2011 + (idx % 10), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "1 Sample / Batch", "lead_time_days": 5 + (idx % 5),
                    "rating": round(4.5 + (idx % 5) * 0.1, 2), "quality_score": 92 + (idx % 7), "ai_score": 90 + (idx % 8),
                    "certifications": profile["lab_certs"],
                    "accreditations": profile["lab_certs"],
                    "industries_served": [profile["industry"]],
                    "testing_capabilities": tests
                }
            )
            p.categories.set([cat_map["quality_labs"]])
            total_seeded += 1

        # 7. Certification Agencies (30)
        pfx_cert = ["GlobalCert", "ApexAudit", "StandardReg", "ISOInspect", "ComplianceShield", "RegulaCorp", "Verispec"]
        sfx_cert = ["Certification Agency", "Auditors", "Regulatory Consultants", "International Certifications", "Services"]
        cert_names = gen_names(pfx_cert, sfx_cert, 30)
        
        for idx, name in enumerate(cert_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 3) % len(locations)]
            stds = profile["cert_stds"]
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "🏅",
                    "description": f"Authorized auditing agency specializing in regulatory compliance and certification for {profile['industry']} facilities.",
                    "established_year": 2006 + (idx % 15), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "1 Facility Audit", "lead_time_days": 21 + (idx % 14),
                    "rating": round(4.5 + (idx % 5) * 0.1, 2), "quality_score": 91 + (idx % 8), "ai_score": 89 + (idx % 9),
                    "certifications": ["Accredited Certification Body (IAF)", "Government Authorized Auditor"],
                    "industries_served": [profile["industry"]],
                    "standards_certified": stds
                }
            )
            p.categories.set([cat_map["certifications"]])
            total_seeded += 1

        # 8. Import Export Companies (30)
        pfx_imp = ["GlobalTrade", "OceansEdge", "CrossBorder", "TariffMate", "EXIMHub", "SilkRoute", "TransWorld", "MaritimePact"]
        sfx_imp = ["Import Export Pvt Ltd", "Trading Corp", "Global Merchants", "Customs Brokerage", "Trade Partners"]
        imp_names = gen_names(pfx_imp, sfx_imp, 30)
        trade_services_pool = ["Customs Clearance & Documentation (ICEGATE)", "Ocean / Air Freight Charter Booking", "Duty Drawback & Tariff Optimization", "Letter of Credit (LC) & Export Trade Finance", "Bonded Port Storage Facilitation"]
        
        for idx, name in enumerate(imp_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 7) % len(locations)]
            srvs = random.Random(idx).sample(trade_services_pool, k=3)
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "🌐",
                    "description": f"Expert customs brokerage and import/export trade agency handling global trade tariffs for {profile['industry']}.",
                    "established_year": 2009 + (idx % 12), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "1 Container / Shipment", "lead_time_days": 3 + (idx % 5),
                    "rating": round(4.5 + (idx % 5) * 0.1, 2), "quality_score": 88 + (idx % 10), "ai_score": 89 + (idx % 8),
                    "certifications": ["Licensed Customs House Agent (CHA)", "AEO Certified Trade Broker"],
                    "industries_served": [profile["industry"]],
                    "trade_services": srvs, "shipping_modes": ["Ocean FCL", "Air Cargo Customs"]
                }
            )
            p.categories.set([cat_map["import_export"]])
            total_seeded += 1

        # 9. Business Consultants (20)
        pfx_cons = ["StratSupply", "LeanOps", "FactoryTurnkey", "RegulatoryMind", "GrowthPartners", "ApexAdvisors"]
        sfx_cons = ["Consulting Group", "Advisors Pvt Ltd", "Strategy Firm", "Solutions", "Associates"]
        cons_names = gen_names(pfx_cons, sfx_cons, 20)
        
        for idx, name in enumerate(cons_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 8) % len(locations)]
            specs = profile["cons_specs"]
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "💼",
                    "description": f"Executive supply chain consulting firm dedicated to {profile['industry']} operational excellence and factory scale-up.",
                    "established_year": 2013 + (idx % 9), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "Project Basis / Retainer", "lead_time_days": 14,
                    "rating": round(4.6 + (idx % 4) * 0.1, 2), "quality_score": 93 + (idx % 6), "ai_score": 91 + (idx % 8),
                    "certifications": ["Master Black Belt Certified", "Supply Chain Professionals (CSCP)"],
                    "industries_served": [profile["industry"]],
                    "consulting_specialities": specs
                }
            )
            p.categories.set([cat_map["consultants"]])
            total_seeded += 1

        # 10. Machinery Suppliers (20)
        pfx_mach = ["MechPro", "FormuTech Mach", "PrecisionWorks", "PackMech", "SpeedPress", "AutomataEng"]
        sfx_mach = ["Machinery Pvt Ltd", "Engineering Corp", "Equipment Suppliers", "Systems", "Automation"]
        mach_names = gen_names(pfx_mach, sfx_mach, 20)
        
        for idx, name in enumerate(mach_names):
            profile = industry_profiles[idx % len(industry_profiles)]
            loc = locations[(idx + 9) % len(locations)]
            eqs = profile["machs_offered"]
            p, created = MarketplacePartner.objects.update_or_create(
                organization=org,
                name=name,
                defaults={
                    "slug": slugify(name), "logo": "⚙️",
                    "description": f"Industrial automation and machinery specialist supplying advanced processing equipment for {profile['industry']}.",
                    "established_year": 2004 + (idx % 15), "city": loc[0], "state": loc[1], "country": loc[2],
                    "moq_number": 1, "moq_display": "1 Machine / Line", "lead_time_days": 30 + (idx % 30),
                    "rating": round(4.6 + (idx % 4) * 0.1, 2), "quality_score": 91 + (idx % 8), "ai_score": 90 + (idx % 8),
                    "certifications": profile["general_certs"],
                    "industries_served": [profile["industry"]],
                    "machinery": eqs, "products_offered": eqs, "oem_available": True
                }
            )
            p.categories.set([cat_map["machinery"]])
            total_seeded += 1

        self.stdout.write(f"-> Seeded {total_seeded} Marketplace partners across 10 categories for {org.name}.")

