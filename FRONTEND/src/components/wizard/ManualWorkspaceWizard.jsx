import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Shield, Box, Truck, FileText, Users, Layers, AlertCircle } from "lucide-react";
import { createProductFromWizard } from "../../services/productService";
import { I, M } from "../../constants/fonts";

const STEP_TITLES = [
  "Basic Information",
  "Commercial Planning",
  "Manufacturing",
  "Raw Materials",
  "Packaging",
  "Warehouse",
  "Logistics",
  "Quality",
  "Inventory Planning",
  "Documents",
  "Team",
  "Review & Create"
];

export function ManualWorkspaceWizard({ onBack, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed for 12 steps
  const [submitting, setSubmitting] = useState(false);

  // Form State covering all 12 enterprise specifications
  const [formData, setFormData] = useState({
    productName: "",
    category: "Nutrition & Supplements",
    subCategory: "Sports Nutrition",
    brandName: "",
    sku: "SKU-MAN-" + Math.floor(1000 + Math.random() * 9000),
    version: "v1.0",
    productType: "Finished Product",
    description: "",
    targetIndustry: "FMCG",
    targetCountry: "India",
    priority: "medium",
    creationMethod: "manual",
    commercialData: {
      budget: "5000000",
      targetCost: "250",
      sellingPrice: "499",
      margin: "49.8%",
      currency: "INR (₹)",
      moq: "1000 units",
      timeline: "60 days",
      capacity: "10000 units/mo"
    },
    manufacturingData: {
      needManufacturer: true,
      oem: true,
      odm: false,
      region: "Western India / Gujarat",
      certifications: ["WHO-GMP", "ISO 9001:2015", "FSSAI"]
    },
    rawMaterialsData: [
      { material: "Primary Whey Concentrate 80%", quantity: "800", unit: "kg", supplier: "Open Market Vendor", status: "Required" },
      { material: "Cocoa Flavor Enhancer", quantity: "150", unit: "kg", supplier: "Specialized Ingredients Co.", status: "Required" }
    ],
    packagingData: {
      type: "HDPE Container & Moisture Proof Cap",
      needSupplier: true,
      material: "Food-grade Recyclable Polymer",
      printing: "High Gloss Waterproof Labeling"
    },
    warehouseData: {
      needWarehouse: true,
      type: "Ambient & Cleanroom Certified",
      location: "Mumbai Distribution Hub",
      capacity: "5,000 sq.ft",
      aiRecommend: true
    },
    logisticsData: {
      needTransport: true,
      modes: ["Road Transport", "Reefer Express"],
      scope: "Pan-India Domestic & Export",
      sla: "48 Hours Guaranteed",
      insurance: true,
      tracking: true
    },
    qualityData: {
      testingLab: true,
      stabilityTesting: true,
      shelfLife: "24 Months",
      microbiology: true,
      certificationAgency: true
    },
    inventoryData: {
      initialStock: 2500,
      safetyStock: 500,
      reorderPoint: 750,
      batchSize: 1000,
      lotTracking: true,
      serialTracking: false
    },
    documentsData: [
      { type: "Specification", name: "Master Product Specification Sheet.pdf", status: "Ready" },
      { type: "COA Draft", name: "Standard Certificate of Analysis.doc", status: "Template" }
    ],
    teamData: {
      projectManager: "Manan Chauhan (Lead Architect)",
      procurementManager: "Enterprise Procurement AI",
      qa: "Quality Assurance Lead",
      production: "Operations Director"
    }
  });

  const handleFieldChange = (field, val, section = null) => {
    setFormData(prev => {
      const copy = { ...prev };
      if (section) {
        copy[section] = { ...copy[section], [field]: val };
      } else {
        copy[field] = val;
      }
      return copy;
    });
  };

  const addMaterialRow = () => {
    setFormData(prev => ({
      ...prev,
      rawMaterialsData: [
        ...prev.rawMaterialsData,
        { material: "", quantity: "100", unit: "kg", supplier: "Any verified vendor", status: "Draft" }
      ]
    }));
  };

  const removeMaterialRow = (index) => {
    setFormData(prev => ({
      ...prev,
      rawMaterialsData: prev.rawMaterialsData.filter((_, idx) => idx !== index)
    }));
  };

  const updateMaterialRow = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.rawMaterialsData];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, rawMaterialsData: updated };
    });
  };

  const toggleCert = (cert) => {
    const list = [...(formData.manufacturingData?.certifications || [])];
    const idx = list.indexOf(cert);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(cert);
    handleFieldChange("certifications", list, "manufacturingData");
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.productName.trim()) {
      toast.error("Product Name is required to advance.");
      return;
    }
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    } else {
      onBack();
    }
  };

  const handleFinalCreate = async () => {
    if (!formData.productName.trim()) {
      toast.error("Please ensure Product Name is specified.");
      setCurrentStep(0);
      return;
    }
    setSubmitting(true);
    try {
      const res = await createProductFromWizard(formData);
      const newId = res?.id || res?.data?.id;
      toast.success(`Manual workspace "${formData.productName}" created successfully!`);
      if (onClose) onClose();
      if (newId) {
        navigate(`/workspace/${newId}`);
      } else {
        navigate(`/projects`);
      }
    } catch (err) {
      toast.error(err?.message || "Workspace creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfbf9] text-[#1b1c1c]">
      {/* Top Bar with Step Indicators */}
      <div className="bg-[#1b1c1c] text-white px-8 py-5 flex flex-col gap-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-bold" style={{ fontFamily: M }}>
                Manual Workspace Wizard
              </h2>
              <p className="text-xs text-[#ffd54a]" style={{ fontFamily: I }}>
                Step {currentStep + 1} of {STEP_TITLES.length}: {STEP_TITLES[currentStep]}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentStep(STEP_TITLES.length - 1)}
            disabled={!formData.productName.trim()}
            className="text-xs text-white/70 hover:text-[#ffd54a] transition underline"
            style={{ fontFamily: I }}
          >
            Skip to Final Review →
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {STEP_TITLES.map((title, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (idx === 0 || formData.productName.trim()) setCurrentStep(idx);
                  else toast.error("Enter Product Name first!");
                }}
                className={`flex-1 min-w-[70px] h-2 rounded-full transition-all relative ${
                  isCurrent ? "bg-[#ffd54a] shadow-sm scale-y-125" : isCompleted ? "bg-[#16a34a]" : "bg-white/20"
                }`}
                title={`Step ${idx + 1}: ${title}`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Step Body */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[rgba(208,198,174,0.4)] rounded-2xl p-8 shadow-sm">
          
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step 1: Core Identity & Classification
              </h3>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Product Name *</label>
                  <input
                    value={formData.productName}
                    onChange={e => handleFieldChange("productName", e.target.value)}
                    placeholder="e.g. Organic Whey Protein Isolate"
                    className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ffd54a]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => handleFieldChange("category", e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-[#ffd54a]"
                  >
                    {["Nutrition & Supplements", "Electronics & Gadgets", "Apparel & Textiles", "Personal Care & Beauty", "Automotive & Mobility", "General Industrial"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Brand / Trademark</label>
                  <input
                    value={formData.brandName}
                    onChange={e => handleFieldChange("brandName", e.target.value)}
                    placeholder="e.g. SupplyPro Elite"
                    className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ffd54a]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">SKU Code</label>
                  <input
                    value={formData.sku}
                    onChange={e => handleFieldChange("sku", e.target.value)}
                    className="border border-gray-300 rounded-xl p-3 font-mono text-xs outline-none"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Detailed Specification / Purpose</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => handleFieldChange("description", e.target.value)}
                    placeholder="Describe target market, product dimensions, functional characteristics..."
                    className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#ffd54a]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Commercial Planning */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step 2: Commercial Planning & Unit Economics
              </h3>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Total Project Budget (₹ / $)</label>
                  <input
                    type="number"
                    value={formData.commercialData.budget}
                    onChange={e => handleFieldChange("budget", e.target.value, "commercialData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Target Launch Timeline</label>
                  <input
                    value={formData.commercialData.timeline}
                    onChange={e => handleFieldChange("timeline", e.target.value, "commercialData")}
                    placeholder="e.g. 60 Days / Nov 2026"
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Minimum Order Quantity (MOQ)</label>
                  <input
                    value={formData.commercialData.moq}
                    onChange={e => handleFieldChange("moq", e.target.value, "commercialData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Monthly Production Capacity Needed</label>
                  <input
                    value={formData.commercialData.capacity}
                    onChange={e => handleFieldChange("capacity", e.target.value, "commercialData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Manufacturing */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step 3: Manufacturing Capabilities & Compliance
              </h3>
              <div className="flex flex-col gap-4 text-sm">
                <label className="flex items-center gap-3 font-semibold text-base cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.manufacturingData.needManufacturer}
                    onChange={e => handleFieldChange("needManufacturer", e.target.checked, "manufacturingData")}
                    className="size-5 rounded text-[#ffd54a]"
                  />
                  Need external OEM / Contract Manufacturer Matching from Marketplace?
                </label>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="font-bold text-gray-700">Preferred Manufacturing Region / State</label>
                  <input
                    value={formData.manufacturingData.region}
                    onChange={e => handleFieldChange("region", e.target.value, "manufacturingData")}
                    placeholder="e.g. Western India, Gujarat, Maharashtra"
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="font-bold text-gray-700">Required Factory Certifications & Quality Norms:</span>
                  <div className="flex flex-wrap gap-2">
                    {["WHO-GMP", "ISO 9001:2015", "FSSAI", "FDA Certified", "ISO 22000", "Halal Certified", "Kosher", "CE Certified", "NABL Verified"].map(cert => {
                      const active = formData.manufacturingData.certifications?.includes(cert);
                      return (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => toggleCert(cert)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                            active
                              ? "bg-[#1b1c1c] text-[#ffd54a] border-[#1b1c1c] shadow-xs"
                              : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {active ? "✓ " : "+ "}{cert}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Raw Materials (BOM Table) */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                <h3 className="text-lg font-black text-[#1b1c1c]" style={{ fontFamily: M }}>
                  Step 4: Raw Materials & Bill of Materials (BOM)
                </h3>
                <button
                  type="button"
                  onClick={addMaterialRow}
                  className="bg-[#1b1c1c] text-white hover:bg-[#303031] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus size={14} className="text-[#ffd54a]" /> Add Material Row
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Enter ingredients, components, or sub-assemblies. Real ERP BOM records will be generated automatically upon workspace setup.
              </p>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">Material / Ingredient</th>
                      <th className="py-3 px-4 w-28">Qty</th>
                      <th className="py-3 px-4 w-24">Unit</th>
                      <th className="py-3 px-4 w-44">Supplier Target</th>
                      <th className="py-3 px-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.rawMaterialsData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/40">
                        <td className="p-2.5">
                          <input
                            value={row.material}
                            onChange={e => updateMaterialRow(idx, "material", e.target.value)}
                            placeholder="e.g. Whey Protein Isolate"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-amber-400"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={e => updateMaterialRow(idx, "quantity", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={row.unit}
                            onChange={e => updateMaterialRow(idx, "unit", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                          >
                            {["kg", "g", "l", "ml", "unit", "box", "ton", "m"].map(u => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="p-2.5">
                          <input
                            value={row.supplier}
                            onChange={e => updateMaterialRow(idx, "supplier", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-600"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeMaterialRow(idx)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {formData.rawMaterialsData.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-400 font-medium">
                    No material rows yet. Click "Add Material Row" above to specify BOM items.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Packaging */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step 5: Packaging & Labeling Specifications
              </h3>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Primary Packaging Type</label>
                  <input
                    value={formData.packagingData.type}
                    onChange={e => handleFieldChange("type", e.target.value, "packagingData")}
                    placeholder="e.g. HDPE Container, Pouch, Glass Bottle, Outer Box"
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Material & Protective Coating</label>
                  <input
                    value={formData.packagingData.material}
                    onChange={e => handleFieldChange("material", e.target.value, "packagingData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Printing & Labeling Requirements</label>
                  <input
                    value={formData.packagingData.printing}
                    onChange={e => handleFieldChange("printing", e.target.value, "packagingData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Warehouse */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step 6: Warehousing & Storage Environment
              </h3>
              <div className="grid grid-cols-2 gap-5 text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Storage Environment Type</label>
                  <select
                    value={formData.warehouseData.type}
                    onChange={e => handleFieldChange("type", e.target.value, "warehouseData")}
                    className="border border-gray-300 rounded-xl p-3 bg-white"
                  >
                    {["Ambient / Dry", "Cold Storage (Refrigerated)", "Bonded Warehouse", "Cleanroom ISO Class 8", "Export Staging Terminal"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-700">Target Fulfillment Location / City</label>
                  <input
                    value={formData.warehouseData.location}
                    onChange={e => handleFieldChange("location", e.target.value, "warehouseData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-bold text-gray-700">Storage Capacity Needed (sq.ft / pallets)</label>
                  <input
                    value={formData.warehouseData.capacity}
                    onChange={e => handleFieldChange("capacity", e.target.value, "warehouseData")}
                    className="border border-gray-300 rounded-xl p-3"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7 to 11 Summary cards for brief rendering */}
          {currentStep >= 6 && currentStep <= 10 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-black text-[#1b1c1c] border-b pb-3 border-gray-200" style={{ fontFamily: M }}>
                Step {currentStep + 1}: {STEP_TITLES[currentStep]} Configuration
              </h3>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col gap-4 text-sm">
                {currentStep === 6 && (
                  <>
                    <p className="font-bold text-gray-700">Transport Scope & SLA Target:</p>
                    <input value={formData.logisticsData.scope} onChange={e => handleFieldChange("scope", e.target.value, "logisticsData")} className="border p-3 rounded-xl bg-white" />
                    <input value={formData.logisticsData.sla} onChange={e => handleFieldChange("sla", e.target.value, "logisticsData")} className="border p-3 rounded-xl bg-white" />
                  </>
                )}
                {currentStep === 7 && (
                  <>
                    <p className="font-bold text-gray-700">Target Shelf Life & Quality Inspection Standard:</p>
                    <input value={formData.qualityData.shelfLife} onChange={e => handleFieldChange("shelfLife", e.target.value, "qualityData")} className="border p-3 rounded-xl bg-white" />
                  </>
                )}
                {currentStep === 8 && (
                  <>
                    <p className="font-bold text-gray-700">Inventory Thresholds (Initial Stock & Reorder Point):</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" value={formData.inventoryData.initialStock} onChange={e => handleFieldChange("initialStock", e.target.value, "inventoryData")} placeholder="Initial Stock" className="border p-3 rounded-xl bg-white" />
                      <input type="number" value={formData.inventoryData.reorderPoint} onChange={e => handleFieldChange("reorderPoint", e.target.value, "inventoryData")} placeholder="Reorder Threshold" className="border p-3 rounded-xl bg-white" />
                    </div>
                  </>
                )}
                {currentStep === 9 && (
                  <p className="text-gray-600">Standard Specification & COA templates will be generated inside the workspace documents library upon initialization.</p>
                )}
                {currentStep === 10 && (
                  <div className="flex flex-col gap-3">
                    <p className="font-bold text-gray-700">Assign Project Roles:</p>
                    <input value={formData.teamData.projectManager} onChange={e => handleFieldChange("projectManager", e.target.value, "teamData")} placeholder="Project Manager" className="border p-3 rounded-xl bg-white" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 12: Review & Create */}
          {currentStep === 11 && (
            <div className="flex flex-col gap-6">
              <div className="border-b pb-3 border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#1b1c1c]" style={{ fontFamily: M }}>
                    Step 12: Review & Create Workspace
                  </h3>
                  <p className="text-xs text-gray-500" style={{ fontFamily: I }}>
                    All 11 operational modules are configured. Ready to deploy your independent database workspace.
                  </p>
                </div>
                <button
                  onClick={handleFinalCreate}
                  disabled={submitting}
                  className="bg-[#1b1c1c] hover:bg-[#303031] text-[#ffd54a] px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition"
                  style={{ fontFamily: M }}
                >
                  {submitting ? "Deploying ERP Records..." : "🚀 Launch Workspace Now →"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-sm text-[#1b1c1c] mb-1">Core Product Identity</strong>
                  <p><strong>Name:</strong> {formData.productName}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>SKU:</strong> {formData.sku}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-sm text-[#1b1c1c] mb-1">Commercial Parameters</strong>
                  <p><strong>Budget:</strong> ₹ / $ {formData.commercialData.budget}</p>
                  <p><strong>Timeline:</strong> {formData.commercialData.timeline}</p>
                  <p><strong>MOQ:</strong> {formData.commercialData.moq}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-sm text-[#1b1c1c] mb-1">Raw Materials (BOM)</strong>
                  <p>{formData.rawMaterialsData.length} items configured for relational seeding.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-sm text-[#1b1c1c] mb-1">Warehouse & Inventory</strong>
                  <p><strong>Initial Stock:</strong> {formData.inventoryData.initialStock} units</p>
                  <p><strong>Reorder Threshold:</strong> {formData.inventoryData.reorderPoint} units</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
            >
              <ArrowLeft size={16} /> {currentStep === 0 ? "Back to Mode Choice" : "Previous Step"}
            </button>

            {currentStep < STEP_TITLES.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#1b1c1c] text-white hover:bg-[#303031] px-7 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition"
                style={{ fontFamily: M }}
              >
                Next Step <ArrowRight size={16} className="text-[#ffd54a]" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
