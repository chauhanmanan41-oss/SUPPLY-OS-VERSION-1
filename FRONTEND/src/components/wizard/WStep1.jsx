import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, Sparkles } from "lucide-react";
import { WF, WIn, WSel, WTA } from "./FormFields";
import { I, M } from "../../constants/fonts";
import { W_BIZ_MODELS } from "../../constants/wizard";
import { AIProductBuilder } from "../ai/AIProductBuilder";

export function WStep1({ data, update }) {
    const [imgDrop, setImgDrop] = useState(false);
    const [imgAttached, setImgAttached] = useState(false);
    const CATS = ["Nutrition & Supplements", "Beverages", "Food & Snacks", "Cosmetics & Beauty", "Electronics", "Furniture", "Pharmaceuticals", "Apparel", "Homeware", "Industrial"];
    const INDS = ["FMCG", "Healthcare", "Consumer Electronics", "Fashion", "Agriculture", "Chemical", "Automotive"];
    const CTRS = ["India", "USA", "UAE", "UK", "Germany", "Singapore", "Australia"];
    return (<div className="max-w-[740px] flex flex-col gap-8">
      <AIProductBuilder currentData={data} onApply={(newFields) => update(newFields)} />
      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-5" style={{ fontFamily: M }}>Product Information</p>
        <div className="grid grid-cols-2 gap-4">
          <WF label="Product Name" required><WIn value={data.productName} onChange={e => update({ productName: e.target.value })} placeholder="e.g. Whey Protein Isolate 80%"/></WF>
          <WF label="Brand Name" required><WIn value={data.brandName} onChange={e => update({ brandName: e.target.value })} placeholder="e.g. MANAN Nutrition"/></WF>
          <WF label="Product Category" required>
            <WSel value={data.category} onChange={e => update({ category: e.target.value })}>
              <option value="">Select category…</option>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </WSel>
          </WF>
          <WF label="Industry">
            <WSel value={data.industry} onChange={e => update({ industry: e.target.value })}>
              <option value="">Select industry…</option>
              {INDS.map(c => <option key={c}>{c}</option>)}
            </WSel>
          </WF>
        </div>
        {data.category && (<div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "rgba(255,249,230,0.7)", borderColor: "rgba(255,213,74,0.3)" }}>
            <Sparkles size={13} className="text-[#735c00]"/>
            <p className="text-[12px] text-[#735c00]" style={{ fontFamily: I }}>
              AI suggests: <strong>{data.category}</strong> — FSSAI certification is likely required.
            </p>
          </div>)}
      </div>

      <WF label="Product Description">
        <WTA rows={4} value={data.description} onChange={e => update({ description: e.target.value })} placeholder="Describe your product — ingredients, USP, target customer, key differentiators…"/>
        <p className="text-[11px] text-[#4d4634]/55 -mt-0.5" style={{ fontFamily: I }}>Richer descriptions improve AI supply chain accuracy by up to 40%.</p>
      </WF>

      <div className="grid grid-cols-2 gap-4">
        <WF label="Target Country">
          <WSel value={data.targetCountry} onChange={e => update({ targetCountry: e.target.value })}>
            {CTRS.map(c => <option key={c}>{c}</option>)}
          </WSel>
        </WF>
        <WF label="Product Image (optional)">
          <div onDragOver={e => { e.preventDefault(); setImgDrop(true); }} onDragLeave={() => setImgDrop(false)} onDrop={e => { e.preventDefault(); setImgDrop(false); setImgAttached(true); }} onClick={() => setImgAttached(true)} className="h-11 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all" style={{ borderColor: imgDrop ? "#ffd54a" : imgAttached ? "#16a34a" : "rgba(208,198,174,0.4)", background: imgDrop ? "rgba(255,213,74,0.05)" : "transparent" }}>
            <span className="text-[13px] font-semibold" style={{ fontFamily: I, color: imgAttached ? "#16a34a" : "rgba(77,70,52,0.5)" }}>
              {imgAttached ? "✓ Image attached" : "Click or drag to upload"}
            </span>
          </div>
        </WF>
      </div>

      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Business Model</p>
        <div className="grid grid-cols-2 gap-3">
          {W_BIZ_MODELS.map(({ id, label, desc, Icon: BIcon }) => {
            const sel = data.businessModel === id;
            return (<motion.button key={id} onClick={() => update({ businessModel: id })} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="flex items-start gap-4 p-4 rounded-2xl border text-left transition-all" style={{ background: sel ? "#303031" : "white", borderColor: sel ? "#303031" : "rgba(208,198,174,0.3)", boxShadow: sel ? "0 4px 14px rgba(0,0,0,0.13)" : "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: sel ? "rgba(255,255,255,0.1)" : "rgba(208,198,174,0.12)" }}>
                  <BIcon size={17} color={sel ? "white" : "#4d4634"}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] mb-0.5" style={{ fontFamily: M, color: sel ? "white" : "#1b1c1c" }}>{label}</p>
                  <p className="text-[12px] leading-snug" style={{ fontFamily: I, color: sel ? "rgba(255,255,255,0.55)" : "#4d4634" }}>{desc}</p>
                </div>
                {sel && <CheckCircle size={16} color="rgba(255,255,255,0.65)" className="shrink-0 mt-0.5"/>}
              </motion.button>);
        })}
        </div>
      </div>
    </div>);
}
/* ── Step 2: Business Strategy ── */
