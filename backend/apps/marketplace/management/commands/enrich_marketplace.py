import random
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.marketplace.models import MarketplacePartner, MarketplaceCategory

# Reusable Enterprise B2B Industry Templates (Phase 4 & 3)
INDUSTRY_TEMPLATES = {
    "sports_nutrition": {
        "primary_industry": "Sports Nutrition & Dietary Supplements",
        "sub_industry": "Nutraceutical & Supplement Manufacturing",
        "specialization": "Sports Nutrition & Dietary Supplements OEM/ODM",
        "products": [
            "Whey Protein Isolate 90%", "Whey Concentrate 80%", "Creatine Monohydrate",
            "BCAA 2:1:1 Micro-Instantized", "Micellar Casein", "Alkalized Cocoa Powder",
            "Stevia Leaf Sweetener Extract", "Sunflower Emulsifying Lecithin", "Sucralose", "DigeZyme Multi-Enzyme Complex"
        ],
        "capabilities": [
            "Bulk Ingredient Supply", "Export Logistics Clearance", "Technical COA & MSDS Documentation",
            "Global Ingredient Sourcing", "Private Label Custom Blending", "Nitrogen Flush Tub & Jar Packaging",
            "Powder Flavor Formulation & De-risking"
        ],
        "certifications": [
            "ISO 22000:2018 Food Safety", "WHO-GMP Certified", "FSSAI Approved License Type A",
            "Halal Food Standard", "Kosher Certified", "HACCP Safety Protocol", "FSSC 22000 Accredited"
        ],
        "machinery": [
            "Ribbon Blender 2000L Capacity", "High-Speed Rotary Jar & Tub Filling Line",
            "Induction Cap Heat Sealing Machine", "V-Shaped Dry Powder Homogenizer", "Automated Nitrogen Packaging Cell"
        ],
        "services": [
            "Protein Content Kjeldahl Laboratory Assay", "Heavy Metals ICP-MS Screening Panel",
            "Microbiological E.Coli/Salmonella Batch Release Test", "Accelerated Shelf Life Stability Chamber",
            "FSSAI Regulatory & Labeling Consultation", "Custom Gym Sports Formulation & Taste Testing"
        ],
        "keywords": [
            "whey", "protein", "isolate", "creatine", "bcaa", "nutrition", "supplement", "fssai",
            "cocoa", "stevia", "blender", "powder", "dietary", "gym", "nutraceutical", "shake", "gmp"
        ],
        "warehouse_types": ["Ambient Food-Grade Pallet Racking", "Temperature Controlled Dry Facility (<25°C)", "Humidity Controlled Storage (<50% RH)"],
        "logistics": ["Road Freight Fast Express", "Cold Chain Reefer Support", "Dedicated Food-Grade Container Logistics"]
    },
    "pharma": {
        "primary_industry": "Healthcare & Drug Formulation",
        "sub_industry": "Pharmaceutical API & Medicinal Packaging",
        "specialization": "WHO-GMP Pharmaceutical API & Dosage Formulation",
        "products": [
            "Pharmaceutical Grade API (Active Pharmaceutical Ingredients)", "Microcrystalline Cellulose High-Purity Excipients",
            "Pediatric Cough Syrup Liquid Suspension Base", "Gelatin & Plant HPMC Vegetable Capsules",
            "Sterile Type-1 Borosilicate Injectable Vials", "USP Medical Grade Glucose & Saline Solutes"
        ],
        "capabilities": [
            "Cleanroom Grade A/B Rotary Tablet Pressing", "Liquid Syrup High-Speed Bottling & Capping",
            "Lyophilization (Freeze Drying) Sterile Processing", "Automated Alu-Alu Blister Packaging Line",
            "Barcode Serialisation & Track-and-Trace Compliance", "Mandatory 14-Day Quarantine Hold Verification"
        ],
        "certifications": [
            "WHO-GMP Certified Pharma Facility", "US-FDA Registered Manufacturing Plant", "EU-GMP Approved Production Site",
            "ISO 13485 Medical Devices Standard", "NABL Accredited Chemical & Micro Lab", "GLP Good Laboratory Practice"
        ],
        "machinery": [
            "High-Speed Rotary Pharmaceutical Tablet Press", "Fluid Bed Dryer & Sugar Coating Pan (FBD)",
            "Automatic Rotary Liquid Syrup Capping & Filling Line", "High-Speed Rotary Blister Packaging Machine", "Industrial Steam Autoclave Sterilization Suite"
        ],
        "services": [
            "HPLC Purity & Assay Chromatography Analysis", "Tablet Dissolution & Disintegration Lab Panel",
            "Microbial Limit Test (MLT) & Sterility Verification", "ICH Accelerated 6-Month Shelf Life Stability Study",
            "WHO-GMP Dossier Preparation & FDA Regulatory Validation", "Pharma Cleanroom HVAC Validation Consulting"
        ],
        "keywords": [
            "pharma", "medicine", "syrup", "tablet", "capsule", "who-gmp", "fda", "api",
            "healthcare", "drug", "pediatric", "liquid", "medical", "clinical", "pharmaceutical", "sterile", "dosage"
        ],
        "warehouse_types": ["Pharma Temperature & Humidity Controlled (<20°C)", "Cold Storage Refrigerated Locker (2°C - 8°C)", "Quarantine Bonded Controlled Drug Warehouse"],
        "logistics": ["Refrigerated Pharma Cold Chain Reefer Fleet", "Express Air Medevac Transit", "Temperature-Monitored Tracked Container"]
    },
    "food": {
        "primary_industry": "Food & Beverage Processing",
        "sub_industry": "Packaged Foods & Culinary Ingredients",
        "specialization": "Industrial Food Processing & Ingredient Formulation",
        "products": [
            "Dehydrated Vegetable & Spice Extracts", "Organic Extra Virgin Cold-Pressed Oils",
            "Spray-Dried Natural Milk Powder & Dairy Solutes", "Multi-Grain Flours & Extruded Snack Pellets",
            "Tomato Paste Bix 36-38% Drum Concentrate", "Natural Antioxidant Roslyn Extracts & Citric Acid"
        ],
        "capabilities": [
            "FSSAI Grade-A Cleanroom Food Packaging", "Automated Aseptic Liquid Drum Filling",
            "High-Shear Dry Blending & Nitrogen Flushed Pouching", "Retort Canning & Thermal Pasteurization",
            "Private Label Custom Recipe Scaling & De-risking"
        ],
        "certifications": [
            "FSSAI Approved License Type A", "ISO 22000:2018 Food Safety", "FSSC 22000 GFSI Accredited",
            "Halal & Kosher Food Standards", "HACCP Certified Food Facility", "FDA Food Facility Registration"
        ],
        "machinery": [
            "Continuous Rotary Retort Canning Sterilizer", "High-Capacity Spray Drying Machine Tower",
            "Automated Aseptic Liquid Packaging & Tetra Fill Line", "Industrial Multi-Deck Vibration Sifting Equipment"
        ],
        "services": [
            "Microbiological E.Coli, Listeria & Salmonella Screening Panel", "Nutritional Panel Calorimetric Chromatography Assay",
            "Shelf-Life & Packaging Barrier Vapor Transmission Study", "FSSAI Food Law Regulatory & Label Evaluation"
        ],
        "keywords": [
            "food", "beverage", "culinary", "snack", "spice", "oil", "dairy", "milk",
            "ingredient", "canning", "aseptic", "fssai", "pasteurization", "organic", "flour", "grain", "sauce"
        ],
        "warehouse_types": ["Ambient Clean Food-Grade Racking", "Refrigerated Cold Chain Depot (2°C - 8°C)", "Deep Freeze Locker (-18°C)"],
        "logistics": ["Refrigerated Reefer Truck Network", "Sanitary Tanker Express Hauling", "Food-Grade Container Shipping"]
    },
    "electronics": {
        "primary_industry": "Telecommunications & Computing Hardware",
        "sub_industry": "Electronics Assembly & SMT Fabrication",
        "specialization": "SMT PCB Assembly & Telecommunications Hardware",
        "products": [
            "5G AMOLED High-Resolution Display Panels", "Octa-Core ARM Snapdragon SOCs",
            "Lithium Polymer Battery Cells 5000mAh", "LPDDR5 RAM IC RAMs", "UFS 3.1 High-Speed Flash Storage",
            "High-Density PCB Multilayer Assemblies", "Optical Image Stabilizer Camera Modules", "USB-C Power Management Controllers"
        ],
        "capabilities": [
            "SMT Pick & Place High-Speed PCB Assembly", "Cleanroom Class 1000 OEM/ODM Assembly",
            "Automated Optical Inspection (AOI) & X-Ray Testing", "High-Frequency Radio RF Antenna Calibration",
            "Environmental Thermal Burn-in & Drop Stress Testing", "CNC Aluminum Alloy Enclosure Machining"
        ],
        "certifications": [
            "ISO 9001:2015 Quality Management", "ISO 14001:2015 Environmental Standard", "RoHS Compliant Lead-Free",
            "CE Electronic Safety Marking", "FCC Class B Telecommunications", "IEC 62133 Battery Safety Standard", "BIS Registered Electronic Lab"
        ],
        "machinery": [
            "High-Speed Surface Mount Technology (SMT) Line", "10-Zone Nitrogen Reflow Soldering Oven",
            "Automated Optical & Inline X-Ray Inspection Machine", "CNC Aluminum Enclosure 5-Axis Mill", "Ultrasonic PCB Wave Soldering System"
        ],
        "services": [
            "Electromagnetic Compatibility (EMC/EMI) Anechoic Lab Testing", "Thermal Chamber Environmental Burn-in Assay",
            "RoHS Lead-Free XRF Spectrometer Screening", "Embedded Firmware Flashing & Hardware Debugging",
            "CE/FCC/BIS Electronic Regulatory Dossier Submission", "Supply Chain Component Obsolescence De-risking"
        ],
        "keywords": [
            "smartphone", "laptop", "oled", "display", "smt", "pcb", "electronics", "rohs",
            "chip", "battery", "processor", "ram", "circuit", "computing", "device", "hardware", "hypervision", "telecom"
        ],
        "warehouse_types": ["ESD (Electrostatic Discharge) Safe Ambient Racking", "Automated High-Bay WMS Pallet Storage", "Bonded Secure High-Value Tech Locker"],
        "logistics": ["Air Express High-Value Security Courier", "Dedicated GPS Tracked Road Transit", "Global Container Air Freight"]
    },
    "furniture": {
        "primary_industry": "Woodworking, Interior & Ergonomics",
        "sub_industry": "Furniture, Seating & Architectural Fixtures",
        "specialization": "BIFMA Ergonomic Seating & CNC Woodworking",
        "products": [
            "Kiln-Dried Seasoned Teak Hardwood Timber (Moisture < 10%)", "High-Resilence Molded Polyurethane Foam Seating Cushions",
            "Powder-Coated Heavy Gauge Tubular Steel Chair Leg Frames", "Premium Genuine & Top-Grain Synthetic Upholstery Leather Rolls",
            "High-Load SGS Tested Casters & Pneumatic Gas Lift Actuators", "Zero-VOC Polyurethane UV Cured Protective Wood Varnish"
        ],
        "capabilities": [
            "5-Axis CNC Precision Timber Routing & Milling", "Automated Mortise & Tenon Joint Doweling Assembly",
            "Robotic Tubular Steel Frame MIG Soldering & Bending", "CAM Laser Fabric & Upholstery Cutting & Stitching",
            "KD (Knock-Down) Flat-Pack Cardboard Box Cartoning & Foam Bracing", "Ergonomic Custom Lumbar Contour Design Support"
        ],
        "certifications": [
            "FSC (Forest Stewardship Council) Certified Timber Origin", "ISO 9001:2015 Quality Assembly",
            "BIFMA Commercial Ergonomic Furniture Standards Compliant", "EN 1335 Office Seating Structural Safety Approved",
            "CAL 117 Upholstery Fire Retardant Safety Standard", "Greenguard Low VOC Emissions Certified"
        ],
        "machinery": [
            "5-Axis CNC Routing & Timber Engraving Machining Center", "Automated High-Speed Edge Banding & Double End Tenoner",
            "Robotic Tubular Welding & Tube Bending Work cell", "High-Accuracy CNC Fabric & Upholstery Cutting Table", "Inline Infrared Timber Moisture Calibration Rig"
        ],
        "services": [
            "BIFMA Structural Seat Load & Durability Cycling Test", "Timber Equilibrium Moisture Content Lab Calibration",
            "Upholstery Martindale Abrasion & Flex Scrub Resistance Assay", "VOC & Formaldehyde Emission Chamber Smut Analysis",
            "FSC Sustainable Timber Supply Chain Audit & Lean Factory Setup", "Flat-Pack Logistics Optimization Consulting"
        ],
        "keywords": [
            "furniture", "chair", "teak", "wood", "timber", "hardwood", "dining", "ergonomic",
            "bifma", "fsc", "upholstery", "table", "cabinet", "interior", "seating", "woodworking", "office"
        ],
        "warehouse_types": ["Dry Timber & Furniture Racking Facility (Moisture < 45% RH)", "High-Ceiling Bulk Pallet Storage", "Automated WMS Furniture Hub"],
        "logistics": ["Heavy Container Road Freight", "Furniture Protective Pad-Wrap Delivery", "Global Container Shipping"]
    },
    "cosmetics": {
        "primary_industry": "Hair & Skin Hygiene Care",
        "sub_industry": "Cosmetics, Botanicals & Personal Care",
        "specialization": "Botanical Personal Care & Sulfate-Free Cosmetics",
        "products": [
            "Sodium Laureth Sulfate (SLES 70%) Foaming Surfactant", "Cocamidopropyl Betaine (CAPB)",
            "Botanical Herbal Extracts (Argan Oil, Tea Tree, Aloe Vera, Keratin)", "Cetearyl Alcohol Emulsifying Wax Base",
            "Pure Fragrance & Essential Oil Customized Blends", "USP Cosmetic Grade Vegetable Glycerin"
        ],
        "capabilities": [
            "Sulfate-Free & Paraben-Free Botanical Formulation", "High-Shear Vacuum Emulsification Homogenization",
            "Automated Shampoo & Conditioner Rotary Bottle Filling", "Lotion Tube Filling & Ultrasonic End Sealing",
            "Custom Scent & Viscosity Rheological Profiling", "Biodegradable & Eco-Friendly Surfactant Blends"
        ],
        "certifications": [
            "ISO 22716 Cosmetics Good Manufacturing Practice (CGMP)", "Cruelty-Free / Leaping Bunny Certified",
            "Ecocert Organic & Natural Cosmetics Standard", "FDA Cosmetics OTC Registered Facility", "FSSAI Safety Approved"
        ],
        "machinery": [
            "Vacuum Emulsifying Homogenizer Mixer 1000L", "High-Speed Automatic Liquid Rotary Bottle Filling Line",
            "Inline Double-Sided Automated Label Applicator", "Shrink Sleeve Heat Tunnel & Bundler", "Ultrasonic Tube Filling & Sealing Cell"
        ],
        "services": [
            "Viscosity & Rheological Centrifuge Stability Analysis", "Dermal Irritation & Human Skin Patch Safety Panel",
            "Microbial Preservative Challenge Efficacy Testing", "pH Stability & Emulsion Phase Separation Assay",
            "Cosmetics CGMP Compliance Audit & Labeling Review", "Brand Packaging Touch & Feel Ergonomics Consulting"
        ],
        "keywords": [
            "shampoo", "cosmetics", "herbal", "botanical", "surfactant", "hair", "skin", "lotion",
            "cream", "viscosity", "emulsion", "hygiene", "beauty", "soap", "conditioner", "fragrance", "personal care"
        ],
        "warehouse_types": ["Ambient Dry Cosmetic Pallet Racking", "Temperature Stabilized Liquid Drum Storage (<25°C)", "Automated WMS Multi-Tier Warehouse"],
        "logistics": ["Express Road Container Shipping", "Palletized Drum Transit", "Temperature Regulated Dry Box Transport"]
    },
    "textile": {
        "primary_industry": "Garment Manufacturing & Fashion",
        "sub_industry": "Textile Weaving, Dyeing & Apparel Production",
        "specialization": "GOTS Certified Garment Manufacturing & Textile Weaving",
        "products": [
            "100% Organic Combed Ring-Spun Cotton Yarn", "Heavier 220 GSM Single Jersey Combed Cotton Fabric",
            "Eco-Friendly Reactive & Pigment Color Textile Dyes", "Polyester Core Spun High-Tenacity Sewing Threads",
            "Custom Woven Neck Labels & Recycled Cardboard Hangtags", "YKK Zippers, Brass Buttons & Snap Fasteners"
        ],
        "capabilities": [
            "High-Gauge Circular & Flatbed Rotary Knitting", "Precision Dye House with Automated Spectrophotometer Color Matching",
            "CAM Laser Fabric Overlap Spreading & Precision Cutting", "Modular Overlock & Lockstitch Sewing Assembly Lines",
            "Garment Enzyme Softening & Shrink Preshrunk Wash Processes", "Automatic Steam Ironing, Folding & Bag Poly Pack"
        ],
        "certifications": [
            "GOTS (Global Organic Textile Standard) Certified", "OEKO-TEX Standard 100 Eco Safety",
            "WRAP (Worldwide Responsible Accredited Production) Approved", "ISO 9001:2015 Quality Assurance",
            "Fair Trade Certified Textile Mill", "Sedex SMETA Ethical Factory Audit Passed"
        ],
        "machinery": [
            "High-Speed Circular & Flatbed Knitting Machines", "Automated CAM Fabric Spreading & Laser Cutting Cell",
            "Multi-Head Computerized Embroidery & Stitching Machine", "Continuous Hot Air Drying & Fabric Stenter Frame", "Rotary Automatic Garment Screen Printing Press"
        ],
        "services": [
            "Color Fastness to Washing, Rubbing & Light (Spectrophotometer Assay)", "Tensile Bursting Strength & Fabric Tear Resistance Test",
            "Dimensional Shrinkage Wash & Pilling Resistance Protocol", "Azo Dye Heavy Metal Trace Chromatography Screening",
            "WRAP & SMETA Ethical Social Accountability Factory Audit", "Apparel Sourcing & Cost Optimization Consulting"
        ],
        "keywords": [
            "shirt", "apparel", "garment", "cotton", "textile", "yarn", "fabric", "gots",
            "oeko-tex", "knitting", "clothing", "fashion", "weave", "jersey", "sewing", "t-shirt", "t shirt", "cloth"
        ],
        "warehouse_types": ["Clean Ambient Garment Box Racking", "Humidity Controlled Textile Storage", "Automated Garment Hanging & Pallet Warehouse"],
        "logistics": ["Container Road Transit", "Express Air Fashion Logistics", "Last-Mile Carton Delivery"]
    },
    "automotive": {
        "primary_industry": "Micro-Mobility & Bicycles",
        "sub_industry": "Electric E-Bikes, Lithium Power & Automotive Assembly",
        "specialization": "UN 38.3 Lithium Battery Systems & E-Bike Mobility",
        "products": [
            "Lithium Nickel Manganese Cobalt (NMC) 48V 15Ah Battery Packs", "Brushless DC (BLDC) Rear Hub 500W Motors & Motor Controllers",
            "Heat-Treated Aluminum Alloy T6-6061 Bicycle Frame Sets", "Hydraulic Disc Brakes & Regenerative Calipers",
            "High-Impact ABS Outer Body Fairings & LED Lighting Modules", "High-Load Waterproof Electric Wiring Harnesses"
        ],
        "capabilities": [
            "Robotic TIG/MIG Aluminum Chassis Assembly Welding", "Automated Lithium Battery Cell Spot-Welding & BMS Balancing",
            "Chassis Powder Coating & Anti-Corrosive Electro-Dip Treatment", "Conveyor-Based E-Bike Final Sub-Assembly & Wheel Tuning",
            "Chassis Dyno Roller & Simulated Road Load Burn-In Testing", "OEM Custom Frame Engineering & Rapid Prototype Tooling"
        ],
        "certifications": [
            "ISO/TS 16949 (Automotive Quality Management System)", "CE / EN 15194 (European Electrically Power Assisted Cycles Standard)",
            "UN 38.3 Lithium Battery Transport Safety Certified", "ISO 9001:2015 Quality Assurance", "IP67 Weather & Waterproof Resistance Rated"
        ],
        "machinery": [
            "Automated Laser Spot Welding Machine for Lithium Battery Cells", "Robotic CNC Frame Tube Benders & Pulse TIG Welders",
            "Automated Wheel Truing & Spoke Tensioning Machine", "Chassis Dyno & Motor Efficiency Test Roller Rig", "Automated Conveyor Final Assembly Production Line"
        ],
        "services": [
            "UN 38.3 Battery Crush, Short Circuit & Thermal Runaway Chamber Test", "Frame Fatigue & Handlebar Impact Load Testing (EN 15194 Protocol)",
            "IP67 Water Immersion & Dust Resistance Chamber Assessment", "Motor Thermal Dissipation & Dyno Torque Curve Test",
            "Class 9 Dangerous Goods Battery Logistics Clearance Consulting", "Lean Automotive Assembly Factory Layout Setup"
        ],
        "keywords": [
            "e-bike", "cycle", "bicycle", "battery", "lithium", "motor", "commuter", "automotive",
            "mobility", "vehicle", "scooter", "un 38.3", "chassis", "electric", "bike", "transport", "bms", "electric scooter"
        ],
        "warehouse_types": ["Hazardous Goods Bonded Battery Warehouse (UN 38.3 Rated)", "Ambient Automotive Pallet & Racking Depot", "Automated WMS Vehicle Storage Hub"],
        "logistics": ["Class 9 Dangerous Goods Certified Transport", "Automotive Specialized Container Shipping", "Express GPS Tracked Road Transit"]
    },
    "chemical": {
        "primary_industry": "Industrial & Specialty Chemicals",
        "sub_industry": "Polymer Synthesis & Reagent Formulation",
        "specialization": "High-Purity Specialty Industrial & Electronic Chemicals",
        "products": [
            "High-Purity Sulfuric Acid (98%) & Hydrochloric Acid (37%)", "Industrial Grade Sodium Hydroxide Flakes & Lye",
            "Polyether Polyols & Isocyanates for Urethane Foams", "Electronic Grade Acetone & Isopropanol Solvent",
            "Titanium Dioxide (TiO2) Rutile Pigment Powder", "Synthetic Epoxy Resins & Hardener Systems"
        ],
        "capabilities": [
            "Glass-Lined Stainless Steel Batch Synthesis Reactions", "Hazardous Material Class 8 Liquid Bulk Drumming",
            "Vacuum Fractional Distillation & Purity Refined Scrubbing", "Ex-Proof Flameproof Controlled Atmosphere Mixing",
            "Custom Polymer Blending & MSDS Regulatory Compilation"
        ],
        "certifications": [
            "ISO 9001:2015 Quality Management", "ISO 14001 Environmental Standard", "ISO 45001 Health & Safety",
            "REACH EU Chemical Compliance Approved", "UN Hazardous Materials Packaging Certified"
        ],
        "machinery": [
            "Glass-Lined Reactor Vessels (2000L - 10000L)", "High-Vacuum Fractional Distillation Columns",
            "Explosion-Proof Continuous Rotary Drum Filler", "High-Efficiency Centrifugal Separation Suite"
        ],
        "services": [
            "Gas Chromatography Mass Spectrometry (GC-MS) Assay", "Moisture Content Karl Fischer Titration Panel",
            "Viscosity & Epoxide Equivalent Weight Lab Determination", "REACH / EPA Chemical Safety Dossier Preparation"
        ],
        "keywords": [
            "chemical", "acid", "reagent", "solvent", "polymer", "resin", "epoxy", "pigment",
            "synthesis", "reactor", "distillation", "reach", "msds", "hazardous", "surfactant", "industrial chemical"
        ],
        "warehouse_types": ["Hazmat Class 3 & Class 8 Bonded Chemical Bunker", "Ventilated Flameproof Bulk Storage", "Spill Containment Pallet Depot"],
        "logistics": ["ADR Hazardous Materials Tanker Transport", "Class 8 Chem-Grade ISO Container Hauling", "Tracked Chemical Escrow Transit"]
    },
    "plastic": {
        "primary_industry": "Hydration, Packaging & Plastics",
        "sub_industry": "Bottle Forming, Injection Molding & Packaging Containers",
        "specialization": "Food-Grade Blow Molding & Precision Plastics Packaging",
        "products": [
            "Food-Grade Virgin Polycarbonate & BPA-Free Tritan Resin", "Stainless Steel 304/316 Food Grade Double-Wall Coils",
            "Food-Safe Silicone O-Ring Sealing Rings & Lid Valves", "UV Curable Screen Printing & Laser Etching Inks",
            "Corrugated 5-Ply Shipping Master Cartons & Divider Inserts", "HDPE & PET Preforms for Bottle Blowing"
        ],
        "capabilities": [
            "Two-Stage High-Speed Stretch Blow Molding (PET & Polycarbonate)", "Precision Double-Wall Stainless Vacuum Insulation Drawing",
            "Automated Laser Welding & Electrolytic Interior Polishing", "Continuous UV Screen & Powder Coated Outer Spray Painting",
            "High-Pressure Hydrostatic Vacuum Leak & Drop Proofing", "Custom Bottle Mold Design & Rapid Tooling"
        ],
        "certifications": [
            "ISO 9001:2015 Quality Management", "FDA Food Contact Compliant (BPA-Free Verified)",
            "ISO 14001 Environmental Standard", "CE Safe Food Contact Marking", "LFGB German Food Grade Certified", "FSSAI Packaging Safety Approved"
        ],
        "machinery": [
            "High-Tonnage Hydraulic Injection Molding Machine (400T)", "Two-Stage High-Speed Stretch Blow Molding Line",
            "Automated Vacuum Laser Welding & Polishing Cell", "Continuous Powder Coating & Spray Drying Booth", "Hydrostatic Inline Leak Detection Test Rig"
        ],
        "services": [
            "Hydrostatic High-Pressure Burst & Vacuum Retention Lab Assay", "BPA & Phthalate Chemical Migration Chromatography Test",
            "Coating Adhesion & Cross-Hatch Drop Impact Resistance Test", "Dimensional Cap Thread & Seal Precision Metrology",
            "FDA & LFGB Food Contact Materials Regulatory Certification", "Eco-Friendly Sustainable Packaging Design Consulting"
        ],
        "keywords": [
            "bottle", "water", "stainless", "vacuum", "plastic", "plastics", "hdpe", "pet", "packaging",
            "hydration", "molding", "container", "flask", "pouch", "jar", "sachet", "carton", "bpa-free"
        ],
        "warehouse_types": ["Ambient Clean Plastic Container Pallet Racking", "Automated High-Capacity Bulk WMS Warehouse", "Dust-Free Food Grade Packaging Depot"],
        "logistics": ["High-Cube Container Road Freight", "Bulk Palletized Container Shipping", "Express Packaging Distribution"]
    },
    "packaging": {
        "primary_industry": "Packaging Solutions & Materials",
        "sub_industry": "Flexible & Rigid Industrial Containers",
        "specialization": "High-Speed Commercial Barrier Packaging & Custom Molding",
        "products": [
            "Multi-Layer Barrier Foil Standup Resealable Pouches", "Pharmaceutical Grade Type-1 Amber Glass Vials",
            "HDPE Wide-Mouth Protein Jars (500ml - 3000ml)", "Heavy-Duty 7-Ply Corrugated Exporter Master Cartons",
            "Tamper-Evident Holographic Induction Sealing Wads", "High-Tensile Stretch Wrap & BOPP Self-Adhesive Tapes"
        ],
        "capabilities": [
            "9-Color High-Speed Rotogravure Flexible Pouch Printing", "High-Accuracy PET & HDPE Extrusion Stretch Blow Molding",
            "Corrugated Die-Cutting & Heavy Edge Box Gluing", "Inline Deflection & Vacuum Burst Seal Testing",
            "Custom Bottle & Cap 3D Mold Tooling Fabrication"
        ],
        "certifications": [
            "ISO 9001:2015 Quality Management", "ISO 22000 Food Contact Safety Approved", "FSSAI Food Grade Packaging Certified",
            "FSC Certified Sustainable Wood / Cardboard Source", "BRC Global Packaging Standard Grade A"
        ],
        "machinery": [
            "9-Color Rotogravure High-Speed Printing Press", "Multi-Cavity Automatic Blow Molding Station (600 BPH)",
            "High-Speed Automatic Corrugated Carton Folder & Gluer", "Inline Infrared Seal Integrity Verification Sensor"
        ],
        "services": [
            "Oxygen & Water Vapor Transmission Rate (OTR/WVTR) Barrier Study", "Drop Impact & Edge Crush Test (ECT) Cardboard Panel",
            "Chemical Migration Chromatography Assay for Food Safety", "Sustainable Biodegradable Packaging Transition Consulting"
        ],
        "keywords": [
            "packaging", "box", "carton", "pouch", "bottle", "jar", "sachet", "label",
            "corrugated", "flexible", "rigid", "foil", "container", "fsc", "wrapper", "vial", "plastic wrap"
        ],
        "warehouse_types": ["Dry Dust-Free Packaging Finished Goods Racking", "Humidity Controlled Paper & Cardboard Storage", "High-Cube Pallet Depot"],
        "logistics": ["High-Cube Clean Container Road Transport", "Volume Optimized Pallet Freight", "Express Packaging Supplies Delivery"]
    },
    "fmcg": {
        "primary_industry": "Fast-Moving Consumer Goods (FMCG)",
        "sub_industry": "Household Care & Retail Confectionery",
        "specialization": "High-Volume FMCG Contract Manufacturing & Packaged Retail Goods",
        "products": [
            "Concentrated Laundry Liquid Detergent & Fabric Softener", "Multi-Purpose Surface Cleaning Antibacterial Spray",
            "Personal Hygiene Menthol & Glycerin Bathing Soaps", "Aerosol Room Deodorizing & Air Freshener Sprays",
            "Ready-to-Drink (RTD) Flavored Electrolyte Sports Beverages", "Packaged Digestive Whole-Wheat Biscuits & Wafers"
        ],
        "capabilities": [
            "High-Volume Continuous Bottling & Rotary Labeling (200 BPM)", "Automated Aerosol Propellant Gas Charging & Sealing Line",
            "Continuous Bar Soap Saponification, Stamping & Flow Wrapping", "High-Speed Biscuit Baking Tunnel Oven & Cartoning Cell",
            "Retail Shelf-Ready Packaging & Multipack Shrink Bundling"
        ],
        "certifications": [
            "ISO 9001:2015 Quality Systems", "ISO 22716 CGMP Personal Care Certified", "FSSAI Approved Food & Hygiene License",
            "HACCP & BRC Global Retail Consumer Standard", "ISO 14001 Eco-Safe Operations"
        ],
        "machinery": [
            "High-Speed Automatic Rotary Liquid Bottling & Capping Line (200 BPM)", "Continuous Industrial Biscuit Baking Tunnel Oven (50m)",
            "Automated Aerosol Can Propellant Filling & Crimping Station", "High-Efficiency Multi-Pack Shrink Sleeve Heat Tunnel"
        ],
        "services": [
            "Surface Disinfection Microbial Kill Rate Efficacy Assay", "Shelf-Life Accelerated Sensory & Texture Retention Panel",
            "Packaging Seal Integrity & Leak Proof Transit Stress Study", "FMCG High-Speed Supply Chain Bottlenecks Reduction Consulting"
        ],
        "keywords": [
            "fmcg", "detergent", "soap", "cleaner", "biscuit", "beverage", "consumer", "retail",
            "aerosol", "household", "packaged", "spray", "drink", "confectionery", "washing", "shampoo", "hygiene"
        ],
        "warehouse_types": ["High-Velocity Automated Cross-Docking Hub", "High-Bay Pallet WMS Retail Distribution Depot", "Ambient Food & Hygiene Segregated Storage"],
        "logistics": ["Pan-India Retail Cross-Dock Express Transport", "FMCG Fast Turnover Fleet", "Multi-Drop Retail Logistics"]
    },
    "agriculture": {
        "primary_industry": "Agriculture & Farm Inputs",
        "sub_industry": "Agri-Chemicals, Fertilizers & Crop Protection",
        "specialization": "Organic Fertilizers, Soil Nutrients & Sustainable Agri-Inputs",
        "products": [
            "Water-Soluble NPK (19-19-19) Drip Irrigation Fertilizer", "Chelated Micronutrient Zinc & Boron Foliar Spray",
            "Organic Azadirachtin (Neem Oil) Pest Repellent Emulsion", "Bio-Organic Humic Acid & Seaweed Extract Granules",
            "Certified Hybrid Maize, Wheat & Vegetable Soy Seeds", "Drip Irrigation Polyolefin Tubes & Emitting Emitters"
        ],
        "capabilities": [
            "Automated Granulation, Drying & Poly-Sack Valve Stitching", "High-Capacity Bio-Pesticide Emulsified Liquid Formulating",
            "Nitrogen Protected Seed Preservation & Hermetic Packaging", "Precision Soil Nutrient Chelating & Solubilization Process",
            "Large-Scale Bulk Bag (Jumbo FIBC) Packing System"
        ],
        "certifications": [
            "FCO (Fertilizer Control Order) Approved Facility", "ISO 9001:2015 Quality Management", "Ecocert Organic Agriculture Input Approved",
            "APEDA Certified Agricultural Export Vendor", "ISO 14001 Environmental Eco Standard"
        ],
        "machinery": [
            "Continuous Rotary Fertilizer Drum Granulator & Dryer", "High-Capacity Automated 50kg Sack Weighing & Stitching Line",
            "Stainless Steel High-Shear Liquid Agro-Chemical Blender", "Hermetic Automatic Seed Packet Packing Machine"
        ],
        "services": [
            "Soil pH, Macronutrient NPK & Organic Carbon Laboratory Evaluation", "Pesticide Residue & Heavy Metal Screening Chromatography",
            "Seed Germination Percentage & Vigor Efficacy Test Chamber", "Organic Agriculture Regulatory Field Compliance Consulting"
        ],
        "keywords": [
            "agriculture", "fertilizer", "crop", "seed", "pesticide", "organic", "npk", "farm",
            "agri", "humic", "irrigation", "soil", "harvest", "foliar", "neem", "granule", "pest control"
        ],
        "warehouse_types": ["Ventilated Bulk Fertilizer & Chemical Storage Bunker", "Temperature Regulated Seed Preservation Vault (<15°C)", "FIBC Jumbo Bag Stacked Depot"],
        "logistics": ["Agricultural Heavy Pallet Trucking", "Bulk FIBC Flatbed Road Transport", "Rural Farm Container Delivery Network"]
    },
    "medical_devices": {
        "primary_industry": "Medical Devices & Diagnostic Equipment",
        "sub_industry": "Surgical Instruments & Biomedical Systems",
        "specialization": "Class I & IIb Surgical Implants, Disposables & Diagnostic Equipment",
        "products": [
            "Sterile Disposable Polychloroprene Surgical Gloves (Powder-Free)", "Stainless Steel 316L Orthopedic Traumatology Bone Screws & Plates",
            "Digital Infra-Red Thermometers & Blood Pressure Pulse Monitors", "Polycarbonate IV Fluid Infusion Sets with Precision Flow Dial",
            "Ultra-Sharp Sterile Surgical Steel Hilt & Scalpel Blades", "Disposable Polypropylene Hypodermic Syringes & Luer Lock Needles"
        ],
        "capabilities": [
            "ISO Class 7 (10,000) Cleanroom Assembly & Blister Packaging", "Ethylene Oxide (EtO) & Gamma Radiation Terminal Sterilization",
            "Precision Micro-Machining of 316L Titanium & Implant Alloys", "Automated Optical Inspection of Hypodermic Syringe Needles",
            "Cleanroom Sonic Washing, Passivation & Laser Marking"
        ],
        "certifications": [
            "ISO 13485:2016 Medical Device Quality Standard", "US-FDA 510(k) Registered Device Facility",
            "EU MDR Medical Device Regulation CE Mark (Class IIb)", "WHO-GMP Sterile Medical Disposables Approved",
            "EN 455 Medical Gloves Safety Standard Compliant"
        ],
        "machinery": [
            "ISO Class 7 Cleanroom Automated Syringe Assembly & Printing Cell", "Precision Swiss-Type CNC Micro-Lathe for Implant Screws",
            "Ethylene Oxide (EtO) Chamber Terminal Sterilized Suite", "Automatic Tyvek Pouch & Rigid Thermoform Packaging Rig"
        ],
        "services": [
            "Bio-Compatibility Cytotoxicity & Skin Sensitization Medical Panel (ISO 10993)", "Sterility & Bacterial Endotoxin (LAL) Cleanroom Lab Validation",
            "Needle Puncture Force & Mechanical Fracture Strength Testing", "CE MDR & FDA 510(k) Regulatory Filing & Clinical Verification"
        ],
        "keywords": [
            "medical", "device", "surgical", "syringe", "needle", "implant", "orthopedic", "iso 13485",
            "sterility", "diagnostic", "glove", "scalpel", "biomedical", "eto", "cleanroom", "clinical device", "hospital"
        ],
        "warehouse_types": ["ISO 13485 Controlled Temperature Medical Storage (<22°C)", "Sterile Quarantine & Finished Goods Vault", "Automated High-Security Healthcare Depot"],
        "logistics": ["Express Healthcare Courier Service", "Temperature Tracked sterile Transit", "Priority Air Medevac Container Delivery"]
    },
    "chocolate": {
        "primary_industry": "Confectionery & Snack Processing",
        "sub_industry": "Chocolate, Cocoa & Edible Confectionery",
        "specialization": "FSSAI Single-Origin Confectionery & Chocolate Tempering",
        "products": [
            "70% Single-Origin Ivory Coast Cocoa Liquor & Mass", "Deodorized Pure Cocoa Butter",
            "Raw Organic Cane Sugar & Invert Syrup", "Bourbon Vanilla Pod Extracts & Natural Flavorings",
            "Sunflower Emulsifying Lecithin (Non-GMO)", "Food-Grade Aluminum Foil Wrapper Rolls & Cardboard Cartons"
        ],
        "capabilities": [
            "Multi-Stage Cocoa Nib Grinding & Refiner Milling", "Continuous 72-Hour Conching & Flavor Aroma Development",
            "Precision Automated Chocolate Tempering & Bar Molding", "High-Speed Flow Wrap & Foil Bundling Packaging Line",
            "Strict Allergen-Free & Nut-Free Cleanroom Processing", "Private Label Custom Mold Engraving"
        ],
        "certifications": [
            "ISO 22000:2018 Food Safety", "FSSC 22000 GFSI Accredited", "Rainforest Alliance Sustainable Cocoa Certified",
            "FSSAI Food License Type A", "Halal & Kosher Food Standards Compliant", "BRC Global Food Safety Grade A"
        ],
        "machinery": [
            "Three-Stage Ball Mill Cocoa Paste Grinder", "Continuous Automated Chocolate Tempering Machine",
            "Cooling Tunnel & Rotary Depositor Bar Molding Line", "Automatic High-Speed Flow-Wrap Packaging Cell", "Inline Metal Detector & Automated Checkweigher"
        ],
        "services": [
            "FSSAI Microbiological Screen & Aflatoxin HPLC Assay", "Fat Bloom Resistance & Tempering Polymorphic Crystal Test",
            "Moisture & Particle Size Micron Distribution Scan", "Accelerated Rancidity & Oxidation Shelf Life Panel",
            "Rainforest Alliance Sustainable Supply Chain Traceability Audit", "Confectionery Taste Profile Consulting"
        ],
        "keywords": [
            "chocolate", "cocoa", "confectionery", "snack", "butter", "tempering", "molding", "food",
            "sweet", "candy", "bar", "edible", "cacao", "fssai", "sugar", "wrapper"
        ],
        "warehouse_types": ["Refrigerated Confectionery Cold Storage (16°C - 18°C)", "Humidity Controlled Dry Racking (<45% RH)", "Food-Grade Automated WMS Hub"],
        "logistics": ["Refrigerated Cold Chain Reefer Fleet (16°C maintained)", "Express Food Container Transit", "Dedicated Confectionery Courier"]
    },
    "solar": {
        "primary_industry": "Renewable Energy & Photovoltaics",
        "sub_industry": "Solar PV Modules & Power Electronics",
        "specialization": "Monocrystalline Solar PV Modules & Inverter Assembly",
        "products": [
            "Bifacial Monocrystalline PERC Solar PV Modules (550W - 670W)", "Grid-Tied & Hybrid Solar String Inverters (5kW - 100kW)",
            "Anodized Aluminum Solar Mounting & Tracking Structures", "Lithium Iron Phosphate (LFP) Solar Storage Batteries 10kWh",
            "Solar Photovoltaic Combiner Boxes & Surge Protection Devices (SPD)", "Weatherproof Solar Junction Boxes & MC4 Connectors"
        ],
        "capabilities": [
            "Automated Dual-Glass Solar PV Stringing & Lamination Line", "Inline Triple Class A+ Sun Simulator Flasher & EL Testing",
            "Automatic Aluminum Frame Pressing & Silicone Edge Sealing", "Inverter PCB Surface Mount Assembly & Burn-in Chamber",
            "Turnkey Commercial Solar Engineering, Procurement & Construction (EPC)"
        ],
        "certifications": [
            "IEC 61215 Solar PV Design Qualification", "IEC 61730 PV Module Safety Standard",
            "ISO 9001:2015 & ISO 14001 Renewable Facility", "BIS (Bureau of Indian Standards) Solar Approved", "TUV Rheinland Certified Solar PV"
        ],
        "machinery": [
            "Fully Automated Solar Module PV Stringer Machine", "Double Stage Multi-Chamber Vacuum PV Laminator",
            "Inline A+A+A+ Solar PV Sun Simulator Flasher", "Automated Optical & Electromigration EL Testing Cell", "CNC Aluminum Solar Framing Workstation"
        ],
        "services": [
            "Standard Test Conditions (STC) & Low Irradiance Efficiency Assay", "Electroluminescence (EL) Micro-Crack Imaging Diagnosis",
            "Accelerated Damp Heat & Thermal Cycling Degradation Study", "Solar Inverter Grid Interconnection & Islanding Verification",
            "BOS Component Lifespan & Warranty Performance Validation", "Custom Commercial PV Array Layout Consulting"
        ],
        "keywords": [
            "solar", "photovoltaic", "inverter", "pv", "renewable", "module", "bifacial", "energy",
            "monocrystalline", "battery", "lfp", "grid", "sun", "laminator", "iec", "panel"
        ],
        "warehouse_types": ["Weatherproof Ambient Heavy Pallet Racking", "Automated WMS Heavy PV Module Vault", "ESD Protected Inverter Components Storage"],
        "logistics": ["Heavy-Duty Air-Suspension Road Transit", "Reinforced Wooden Crate Container Freight", "Pan-India Renewable Logistics Network"]
    },
    "industrial": {
        "primary_industry": "Specialized Industrial Manufacturing & Assembly Operations",
        "sub_industry": "Heavy Machinery, Automation & Metal Fabrication",
        "specialization": "Heavy Industrial CNC Fabrication & Hydraulic Automation",
        "products": [
            "High-Tensile Structural Alloy Steel & Ductile Iron Castings", "Hydraulic Pumps, Proportional Solenoid Valves & Cylinders",
            "PLC Automation Control Panels (Siemens/Allen-Bradley Components)", "High-Torque Heavy Industrial Gearboxes & Spindles",
            "Hardened D2 Tool Steel Stamping & Punch Dies", "Heavy-Duty Ball Screws & Linear Guide Rails", "Solar Panel Monocrystalline PV Cells & Inverters"
        ],
        "capabilities": [
            "Heavy-Duty CNC Boring, Turning & Vertical Gantry Milling", "High-Capacity Foundry Casting & Induction Heat Treatment",
            "Precision Hydraulic & Pneumatic System Piping Assembly", "Automated PLC Software Ladder Logic Programming",
            "On-Site Turnkey Installation, Calibration & Annual Maintenance Contracts (AMC)", "Custom Tool & Die Rapid Manufacturing"
        ],
        "certifications": [
            "ISO 9001:2015 Quality System", "ISO 45001 (Occupational Health & Safety Certified)",
            "CE Machinery Directive 2006/42/EC Compliant", "ASME Section VIII Div 1 Pressure Vessel Stamp", "UL Certified Electrical Control Assemblies"
        ],
        "machinery": [
            "Large Gantry CNC 5-Axis Milling Center", "Heavy Horizontal Boring & Machining Center",
            "Induction Quenching & Annealing Furnace Suite", "High-Tonnage Hydraulic Assembly & Test Press", "3D Coordinate Measuring Machine (CMM)"
        ],
        "services": [
            "Laser Interferometer Alignment & Geometric Spindle Accuracy Test", "Ultrasonic & Magnetic Particle NDT (Non-Destructive Testing)",
            "Hydraulic Overpressure Proof & Oil Cleanliness Verification", "Turnkey Factory Automation Setup & Lean Layout Consulting",
            "Annual Maintenance Contracts (AMC) & Operator Technical Training", "Custom Machinery CE Compliance & Safety Auditing"
        ],
        "keywords": [
            "machine", "stamping", "press", "hydraulic", "industrial", "cnc", "equipment", "metal",
            "steel", "automation", "plc", "assembly", "heavy", "fabrication", "lathe", "milling", "die", "solar panel", "solar"
        ],
        "warehouse_types": ["Heavy Equipment Crane-Assisted Industrial Warehouse", "Ambient High-Capacity Floor Storage Depot", "Secure WMS Tooling Depot"],
        "logistics": ["Heavy Equipment Low-Boy Flatbed Transport", "Specialized Industrial Shipping & Rigging", "Express Air Parts Dispatch"]
    }
}

class Command(BaseCommand):
    help = "Enrich all existing Marketplace partner records with deep structured B2B capabilities from reusable industry templates (Phase 2, 3 & 4)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Starting Enterprise Marketplace Data Enrichment (Phase 2, 3 & 4)..."))
        
        partners = MarketplacePartner.objects.all()
        total = partners.count()
        self.stdout.write(f"Found {total} existing MarketplacePartner records to enrich without deletion.")

        template_keys = list(INDUSTRY_TEMPLATES.keys())
        updated_count = 0

        with transaction.atomic():
            for idx, partner in enumerate(partners):
                # 1. Determine best fitting industry template based on name/description or deterministic rotation
                name_lower = (partner.name + " " + partner.description).lower()
                chosen_key = None
                
                for t_key, t_val in INDUSTRY_TEMPLATES.items():
                    for kw in t_val["keywords"]:
                        if kw in name_lower:
                            chosen_key = t_key
                            break
                    if chosen_key:
                        break
                
                if not chosen_key:
                    # Deterministically distribute across templates using ID or index so every industry gets deep supplier representation
                    chosen_key = template_keys[idx % len(template_keys)]

                tmpl = INDUSTRY_TEMPLATES[chosen_key]

                # 2. Assign Common Structured Fields (Phase 3)
                partner.primary_industry = tmpl["primary_industry"]
                partner.sub_industry = tmpl["sub_industry"]
                partner.specialization = tmpl.get("specialization", f"Premium {tmpl['primary_industry']} Operations")
                partner.secondary_industry = tmpl["sub_industry"]
                partner.revenue_range = ["$1M - $5M", "$5M - $15M", "$15M - $50M", "$50M - $100M+"][idx % 4]
                partner.head_office = f"{partner.city or 'Ahmedabad'}, {partner.state or 'Gujarat'}, {partner.country or 'India'}"
                partner.cities_served = [partner.city or "Ahmedabad", "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Chennai"]
                partner.countries_served = ["India", "United States", "United Kingdom", "Germany", "United Arab Emirates", "Australia", "Singapore"]
                partner.target_market = ["Enterprise OEMs", "Global Commercial Brands", "Tier-1 Supply Chain Networks", "Export Distributors"]
                partner.export_markets = ["North America (US/Canada)", "European Union (EU)", "Middle East & North Africa (MENA)", "Southeast Asia (ASEAN)"]
                partner.daily_capacity = f"{max(15, (idx % 80) * 2):,} Tons / {max(2500, (idx % 50) * 500):,} Units"
                partner.annual_capacity = f"{max(4500, (idx % 80) * 600):,} Tons / {max(750000, (idx % 50) * 150000):,} Units"
                partner.maximum_capacity = f"{max(350, (idx % 80) * 50):,} Tons / {max(60000, (idx % 50) * 12000):,} Units/mo"
                partner.current_utilization_pct = 68 + (idx % 27)

                # Ensure enterprise services are active
                partner.custom_manufacturing_support = True
                partner.white_label_support = True
                partner.export_ready = True
                partner.technical_documentation = True
                partner.inventory_support = True
                partner.quality_inspection = True
                partner.installation_support = ("machinery" in str(partner.specialization).lower() or "industrial" in str(partner.specialization).lower() or "medical" in str(partner.specialization).lower())
                partner.maintenance_support = ("machinery" in str(partner.specialization).lower() or "industrial" in str(partner.specialization).lower() or "automotive" in str(partner.specialization).lower())
                partner.training_support = True
                
                # Combine template keywords with existing title words for rapid AI search index
                existing_words = [w.strip() for w in partner.name.lower().split() if len(w) > 2]
                partner.keywords = list(set(tmpl["keywords"] + existing_words))
                partner.certifications = list(set(partner.certifications + tmpl["certifications"][:5]))
                partner.industries_served = [tmpl["primary_industry"], tmpl["sub_industry"], "Enterprise Operations"]
                partner.delivery_regions = ["Pan-India", "Global Export Ready", "North America & EU"]
                
                # 3. Category-Specific Data Enrichment (Phase 2)
                cat_codes = [c.category_code for c in partner.categories.all()]
                cat_names = [c.name.lower() for c in partner.categories.all()]
                
                # Default checking strings if category code is empty
                is_supplier = "raw_materials" in cat_codes or any("supplier" in n or "raw" in n for n in cat_names)
                is_manufacturer = "manufacturers" in cat_codes or any("manufactur" in n or "contract" in n for n in cat_names)
                is_packaging = "packaging" in cat_codes or any("packag" in n for n in cat_names)
                is_warehouse = "warehouses" in cat_codes or any("warehouse" in n or "storage" in n for n in cat_names)
                is_logistics = "logistics" in cat_codes or any("logistics" in n or "transport" in n or "shipping" in n for n in cat_names)
                is_lab = "quality_labs" in cat_codes or any("quality" in n or "lab" in n or "test" in n for n in cat_names)
                is_machinery = "machinery" in cat_codes or any("machinery" in n or "equipment" in n for n in cat_names)
                is_cert_agency = "certifications" in cat_codes or any("certif" in n or "agency" in n for n in cat_names)
                is_consultant = "consultants" in cat_codes or any("consult" in n or "advisor" in n for n in cat_names)
                is_import_export = "import_export" in cat_codes or any("export" in n or "import" in n or "trade" in n for n in cat_names)

                # Fallback if no specific category matched
                if not any([is_supplier, is_manufacturer, is_packaging, is_warehouse, is_logistics, is_lab, is_machinery, is_cert_agency, is_consultant, is_import_export]):
                    is_manufacturer = True

                if is_supplier:
                    partner.products_offered = tmpl["products"][:8]
                    partner.materials_supplied = tmpl["products"][:6]
                    partner.capabilities = tmpl["capabilities"][:5]
                    partner.private_label_support = True
                    partner.moq_number = partner.moq_number or 500
                    partner.moq_display = f"{partner.moq_number} units / kg"
                    partner.lead_time_days = partner.lead_time_days or 14

                if is_manufacturer:
                    partner.products_offered = tmpl["products"]
                    partner.capabilities = tmpl["capabilities"]
                    partner.machinery = tmpl["machinery"]
                    partner.oem_available = True
                    partner.odm_available = True
                    partner.private_label_support = True
                    partner.production_lines_count = max(4, (idx % 12) + 2)
                    partner.monthly_capacity_number = partner.monthly_capacity_number or 150000
                    partner.monthly_capacity_display = f"{partner.monthly_capacity_number:,} units/month"
                    partner.moq_number = partner.moq_number or 1000
                    partner.moq_display = f"{partner.moq_number:,} units"

                if is_packaging:
                    partner.packaging_types = ["HDPE Bottles & Jars", "PET Preforms", "Glass Vials", "Sachets & Pouches", "Corrugated Master Cartons", "Eco-Friendly Biodegradable Tubes"]
                    partner.eco_friendly_options = True
                    partner.label_printing_available = True
                    partner.packaging_options = ["Custom UV Print Labeling", "Tamper-Evident Induction Sealing", "Recycled FSC Cardboard Boxing", "Shrink Sleeve Heat Bundling"]
                    partner.products_offered = tmpl["products"][:4] if chosen_key == "packaging" else partner.packaging_types[:4]
                    partner.capabilities = tmpl["capabilities"] if chosen_key == "packaging" else ["High-Speed Bottle Filling & Capping Support", "Custom Mold Design & Tooling", "Drop & Leak Safety Testing"]
                    partner.machinery = tmpl.get("machinery", [])

                if is_warehouse:
                    partner.warehouse_types = tmpl.get("warehouse_types", ["Ambient Dry Storage", "Temperature Controlled Facility", "High-Bay Pallet Racking"])
                    partner.wms_supported = True
                    partner.pallet_capacity = 2500 + ((idx % 10) * 500)
                    partner.storage_capacity_sqft = partner.pallet_capacity * 25
                    partner.rack_system = "Automated High-Bay WMS Pallet Racking System"
                    partner.has_cold_storage = "Cold" in str(partner.warehouse_types) or "Refrigerated" in str(partner.warehouse_types) or "Freeze" in str(partner.warehouse_types)
                    partner.is_bonded_warehouse = True
                    partner.warehouse_locations = [f"{partner.city or 'Ahmedabad'}, {partner.state or 'Gujarat'}", "Mumbai Port Logistics Hub", "Delhi NCR Distribution Center"]
                    partner.services = ["Barcode Inventory Tracking & WMS", "Pick & Pack Cross-Docking", "Quarantine & Quality Hold Area Management"]

                if is_logistics:
                    partner.shipping_modes = tmpl.get("logistics", ["Road Transport (Express & Heavy)", "Rail Freight Logistics", "Air Express Cargo", "Sea Port Container Freight", "Refrigerated Cold Chain Reefer"])
                    partner.fleet_size = 45 + (idx % 80)
                    partner.average_delivery_days = 3 + (idx % 5)
                    partner.has_cold_chain = True
                    partner.express_delivery = True
                    partner.last_mile_available = True
                    partner.delivery_regions = ["Pan-India Nationwide Highway Network", "Global Maritime Ports", "Air Express Terminal Network"]
                    partner.services = ["GPS Real-Time Fleet Telematics Tracking", "Bonded Customs Clearance", "Last-Mile Distribution & COD Support"]

                if is_lab:
                    partner.testing_capabilities = tmpl["services"][:5]
                    partner.accreditations = ["NABL Accredited Laboratory", "ISO/IEC 17025 Certified", "FSSAI Recognized Testing Facility", "GLP Good Laboratory Practice"]
                    partner.certificates_issued = ["Certificate of Analysis (COA)", "Microbiological Sterility Report", "Heavy Metal ICP-MS Clearance Certificate", "ICH Shelf Life Stability Assurance"]
                    partner.standards_certified = ["NABL / ISO 17025", "FSSAI Safety Standard", "USP / EP Monograph Compliance"]
                    partner.response_time_hours = 24
                    partner.response_time_display = "24 hrs Sample Turnaround"
                    partner.services = tmpl["services"]

                if is_machinery:
                    partner.machinery = tmpl["machinery"]
                    partner.products_offered = tmpl["machinery"]
                    partner.capabilities = ["Turnkey Factory Equipment Installation", "PLC Software Automation Ladder Logic", "Annual Maintenance Contracts (AMC)", "On-Site Technical Operator Training"]
                    partner.services = ["Geometric Precision Laser Calibration", "Ultrasonic Non-Destructive Equipment Testing", "Preventive Maintenance & Spare Parts Support"]
                    partner.moq_number = 1
                    partner.moq_display = "1 Unit / Equipment Line"

                if is_cert_agency:
                    partner.certificates_issued = ["FSSAI License Type A/B", "ISO 9001:2015", "HACCP Safety Standard", "WHO-GMP Certification", "US-FDA Registration Dossier", "CE Safety Marking", "RoHS Compliance", "BIS Registration"]
                    partner.audit_time_days = 7 + (idx % 10)
                    partner.approval_time_days = 21 + (idx % 20)
                    partner.capabilities = ["On-Site Factory GAP Compliance Audit", "Regulatory Dossier Compilation & Filing", "Mock FDA / WHO Inspection Practice", "Quality Management System (QMS) Documentation"]
                    partner.services = ["ISO & GMP Compliance Auditing", "Rapid Regulatory Dossier Approval", "Annual Surveillance Audit Review"]

                if is_consultant or is_import_export:
                    partner.consulting_areas = ["Manufacturing Efficiency & Lean Management", "End-to-End Supply Chain Architecture", "Factory Regulatory Compliance & Licensing", "Turnkey Green/Brownfield Factory Setup", "ERP Implementation & BOM Structuring", "Cost Optimization & De-risking"]
                    partner.consulting_specialities = partner.consulting_areas[:4]
                    partner.trade_services = ["Global Customs Brokerage & Import Clearance", "Letter of Credit (L/C) Trade Financing Support", "Maritime Freight Consolidation & Escrow"]
                    partner.services = partner.consulting_areas[:3] + partner.trade_services[:2]
                    partner.response_time_hours = 2
                    partner.response_time_display = "< 2 hrs Senior Advisor Consultation"

                # If general services were not explicitly set by category above, use template services
                if not partner.services:
                    partner.services = tmpl["services"][:5]

                # Ensure high quality performance metrics
                partner.verified_status = True
                partner.quality_score = max(88, min(99, partner.quality_score or 93))
                partner.performance_score = max(86, min(98, partner.performance_score or 91))
                partner.ai_score = max(89, min(99, partner.ai_score or 94))

                partner.save()
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully enriched {updated_count} Marketplace partners with structured enterprise B2B intelligence!"))
