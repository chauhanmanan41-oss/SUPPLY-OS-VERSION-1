import { useState } from "react";
import { motion } from "motion/react";
import { MoreHorizontal } from "lucide-react";
import { TagRow, WF, WIn, WSel } from "./FormFields";
import { I, M } from "../../constants/fonts";
import { W_PRIORITIES } from "../../constants/wizard";

export function WStep2({ data, update }) {
    const [dragIdx, setDragIdx] = useState(null);
    const prios = data.priorities;
    const setPrios = (p) => update({ priorities: p });
    const NUMS = ["①", "②", "③", "④", "⑤", "⑥", "⑦"];
    const MKTS = ["B2C Retail", "B2B Wholesale", "D2C Online", "Export", "Institutional", "Government"];
    const REGS = ["Pan India", "West India", "North India", "South India", "East India", "Southeast Asia", "Middle East"];
    const CERTS = ["FSSAI", "ISO 9001", "FDA", "BIS", "HACCP", "Organic", "Halal", "NABL"];
    const TLS = ["1–3 Months", "3–6 Months", "6–12 Months", "12–18 Months", "18+ Months"];
    const toggle = (id) => prios.includes(id) ? setPrios(prios.filter(p => p !== id)) : setPrios([...prios, id]);
    const onDragOver = (e, idx) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx)
            return;
        const arr = [...prios];
        const [m] = arr.splice(dragIdx, 1);
        arr.splice(idx, 0, m);
        setPrios(arr);
        setDragIdx(idx);
    };
    return (<div className="max-w-[740px] flex flex-col gap-8">
      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Financial & Production</p>
        <div className="grid grid-cols-3 gap-4">
          <WF label="Total Budget (₹)" required><WIn type="number" value={data.budget} onChange={e => update({ budget: e.target.value })} placeholder="e.g. 5000000"/></WF>
          <WF label="Monthly Volume"><WIn type="number" value={data.monthlyProduction} onChange={e => update({ monthlyProduction: e.target.value })} placeholder="e.g. 1000 units"/></WF>
          <WF label="Launch Timeline">
            <WSel value={data.launchTimeline} onChange={e => update({ launchTimeline: e.target.value })}>
              <option value="">Select…</option>{TLS.map(t => <option key={t}>{t}</option>)}
            </WSel>
          </WF>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <p className="text-[#1b1c1c] font-bold text-[15px]" style={{ fontFamily: M }}>Business Priority Ranking</p>
          <p className="text-[#4d4634] text-[12px]" style={{ fontFamily: I }}>Click to select · drag ranked items to reorder</p>
        </div>
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {W_PRIORITIES.map(({ id, label, desc, Icon: PIcon }) => {
            const idx = prios.indexOf(id);
            const sel = idx !== -1;
            return (<motion.button key={id} onClick={() => toggle(id)} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="relative p-4 rounded-xl border text-left transition-all" style={{ background: sel ? "#303031" : "white", borderColor: sel ? "#303031" : "rgba(208,198,174,0.3)", boxShadow: sel ? "0 4px 12px rgba(0,0,0,0.12)" : "0 1px 2px rgba(0,0,0,0.04)" }}>
                {sel && (<div className="absolute top-2.5 right-2.5 size-[22px] rounded-full bg-[#ffd54a] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#735c00]">{idx + 1}</span>
                  </div>)}
                <PIcon size={16} color={sel ? "rgba(255,255,255,0.7)" : "#4d4634"}/>
                <p className="text-[12px] font-bold mt-2 leading-tight" style={{ fontFamily: M, color: sel ? "white" : "#1b1c1c" }}>{label}</p>
                <p className="text-[10px] mt-0.5 leading-snug" style={{ fontFamily: I, color: sel ? "rgba(255,255,255,0.5)" : "#4d4634" }}>{desc}</p>
              </motion.button>);
        })}
        </div>
        {prios.length > 0 && (<div className="bg-[#fbf9f9] rounded-2xl border border-[rgba(208,198,174,0.2)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-3" style={{ fontFamily: I }}>Ranked order · drag to reorder</p>
            <div className="flex flex-col gap-2">
              {prios.map((id, idx) => {
                const prio = W_PRIORITIES.find(p => p.id === id);
                return (<div key={id} draggable onDragStart={() => setDragIdx(idx)} onDragOver={e => onDragOver(e, idx)} onDragEnd={() => setDragIdx(null)} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[rgba(208,198,174,0.2)] cursor-grab hover:border-[rgba(208,198,174,0.5)] transition select-none">
                    <span className="text-[#ffd54a] font-bold text-[15px] w-6 text-center shrink-0" style={{ fontFamily: M }}>{NUMS[idx]}</span>
                    <prio.Icon size={14} className="text-[#4d4634] shrink-0"/>
                    <p className="text-[13px] font-semibold text-[#1b1c1c] flex-1" style={{ fontFamily: I }}>{prio.label}</p>
                    <MoreHorizontal size={14} className="text-[rgba(77,70,52,0.35)]"/>
                  </div>);
            })}
            </div>
          </div>)}
      </div>

      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Market & Compliance</p>
        <div className="grid grid-cols-2 gap-4">
          <WF label="Target Market"><TagRow options={MKTS} selected={data.targetMarket} onToggle={m => update({ targetMarket: data.targetMarket.includes(m) ? data.targetMarket.filter(x => x !== m) : [...data.targetMarket, m] })}/></WF>
          <WF label="Manufacturing Region">
            <WSel value={data.manufacturingRegion} onChange={e => update({ manufacturingRegion: e.target.value })}>
              <option value="">Any region</option>{REGS.map(r => <option key={r}>{r}</option>)}
            </WSel>
          </WF>
          <WF label="Required Certifications"><TagRow options={CERTS} selected={data.certifications} activeColor="#3b82f6" onToggle={c => update({ certifications: data.certifications.includes(c) ? data.certifications.filter(x => x !== c) : [...data.certifications, c] })}/></WF>
          <WF label="Risk Preference">
            <div className="flex border border-[rgba(208,198,174,0.4)] rounded-xl overflow-hidden h-11">
              {["Low", "Medium", "High"].map(r => (<button key={r} onClick={() => update({ riskPreference: r })} className="flex-1 text-[13px] font-semibold transition" style={{ background: data.riskPreference === r ? (r === "Low" ? "#16a34a" : r === "Medium" ? "#eab308" : "#ba1a1a") : "white", color: data.riskPreference === r ? "white" : "#4d4634", fontFamily: I }}>
                  {r}
                </button>))}
            </div>
          </WF>
        </div>
      </div>
    </div>);
}
/* ── Step 3: Supply Chain Requirements ── */
