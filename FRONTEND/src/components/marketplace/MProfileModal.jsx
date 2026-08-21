import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Brain, Factory, CheckCircle, Shield, X, Send } from "lucide-react";
import { MAIRing } from "./MAIRing";
import { MStars } from "./MStars";
import { I, M } from "../../constants/fonts";

export function MProfileModal({ p = {}, onClose }) {
    const sections = ["Overview", "Certifications", "Production", "Past Clients", "Reviews", "Contact"];
    const [activeSection, setActiveSection] = useState("Overview");
    const projectsNum = typeof p.projects === "number" ? p.projects : (parseInt(p.projects) || 0);
    const certsList = Array.isArray(p.certs) && p.certs.length > 0 ? p.certs : ["ISO 9001", "Verified Compliance"];
    const reasonsList = Array.isArray(p.reasons) && p.reasons.length > 0 ? p.reasons : ["Highly rated industry supplier"];
    const ratingNum = typeof p.rating === "number" ? p.rating : (parseFloat(p.rating) || 4.5);
    const reviewsNum = p.reviews || 24;

    return (<div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40" onClick={onClose}>
      <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.22, ease: "easeOut" }} className="w-[560px] h-full bg-white flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Sticky header */}
        <div className="shrink-0 px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-white">
          <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>Partner Profile</p>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }}/>
          </button>
        </div>
        {/* Tab nav */}
        <div className="shrink-0 flex items-center gap-1 px-6 py-2 border-b border-[rgba(208,198,174,0.12)] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {sections.map(s => (<button key={s} onClick={() => setActiveSection(s)} className="px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition shrink-0" style={{ background: activeSection === s ? "#303031" : "transparent", color: activeSection === s ? "white" : "#4d4634", fontFamily: I }}>
              {s}
            </button>))}
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5" style={{ scrollbarWidth: "none" }}>
          {/* Company hero */}
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: p.bg || "rgba(59,130,246,0.1)", border: `1px solid ${p.col || "#3b82f6"}33` }}>{p.logo || "🏭"}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-[20px] text-[#1b1c1c]" style={{ fontFamily: M }}>{p.name || "Partner Name"}</h2>
                {p.verified && <CheckCircle size={16} style={{ color: "#16a34a" }}/>}
              </div>
              <p className="font-semibold text-[14px]" style={{ color: p.col || "#3b82f6", fontFamily: I }}>{p.type || "Partner"}</p>
              <p className="text-[13px] text-[#4d4634] mt-1" style={{ fontFamily: I }}>{p.location || "Global"} · {p.years || 10} yrs in business</p>
              <div className="flex items-center gap-2 mt-2">
                <MStars r={ratingNum}/>
                <span className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{ratingNum.toFixed(1)}</span>
                <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>({reviewsNum} reviews)</span>
              </div>
            </div>
            <MAIRing score={p.match || 90}/>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
            { l: "Projects Done", v: projectsNum.toLocaleString() },
            { l: "Response Time", v: p.response || "< 24 hrs" },
            { l: "Capacity", v: p.capacity || "High" },
            { l: "Lead Time", v: p.lead || "14 days" },
            { l: "Min. Order", v: p.moq || "Flexible" },
            { l: "Price Range", v: p.price || "$$" },
        ].map((m, i) => (<div key={i} className="p-3 rounded-xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.2)]">
                <p className="text-[10px] text-[#4d4634] uppercase tracking-wide mb-1" style={{ fontFamily: I }}>{m.l}</p>
                <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{m.v}</p>
              </div>))}
          </div>

          {/* Factory images placeholder */}
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Factory Overview</p>
            <div className="grid grid-cols-3 gap-2">
              {["Manufacturing Floor", "Quality Lab", "Packaging Unit"].map((label, i) => (<div key={i} className="rounded-xl overflow-hidden aspect-video flex items-center justify-center flex-col gap-1" style={{ background: `${p.bg || "rgba(59,130,246,0.1)"}`, border: `1px solid ${p.col || "#3b82f6"}22` }}>
                  <span className="text-2xl">{p.logo || "🏭"}</span>
                  <span className="text-[10px] text-[#4d4634] font-medium" style={{ fontFamily: I }}>{label}</span>
                </div>))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Certifications & Compliance</p>
            <div className="flex flex-wrap gap-2">
              {certsList.map(c => (<div key={c} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(22,163,74,0.2)]" style={{ background: "rgba(22,163,74,0.06)" }}>
                  <Shield size={13} style={{ color: "#16a34a" }}/>
                  <span className="text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{c}</span>
                </div>))}
            </div>
          </div>

          {/* AI reasons */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,213,74,0.06)", border: "1px solid rgba(255,213,74,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain size={14} style={{ color: "#735c00" }}/>
              <p className="font-bold text-[13px] text-[#735c00]" style={{ fontFamily: M }}>Why AI Recommends This Partner</p>
            </div>
            {reasonsList.map((r, i) => (<div key={i} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <CheckCircle size={13} style={{ color: "#16a34a" }}/>
                <span className="text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{r}</span>
              </div>))}
          </div>

          {/* Past clients */}
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Past Clients</p>
            <div className="flex flex-wrap gap-2">
              {["NutriLife India", "WellFit Co.", "PureForm Labs", "HealthPlus", "VitaMax", "FitBrand"].map(c => (<span key={c} className="px-3 py-1.5 rounded-lg text-[12px] font-medium" style={{ background: "#efeded", color: "#4d4634", fontFamily: I }}>{c}</span>))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 px-6 py-4 border-t border-[rgba(208,198,174,0.2)] flex gap-3">
          <button onClick={() => { toast.success(`RFQ sent to ${p.name}`); onClose(); }} className="flex-1 py-3 rounded-xl font-bold text-[14px] hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Send RFQ</button>
          <button onClick={() => { toast.success(`${p.name} added to project`); onClose(); }} className="flex-1 py-3 rounded-xl font-bold text-[14px] text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Add to Project</button>
        </div>
      </motion.div>
    </div>);
}
