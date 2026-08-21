import { toast } from "sonner";
import { X, Send, Building2 } from "lucide-react";
import { Badge } from "../common/Badge";
import { ModalOverlay } from "../common/Modal";
import { I, M } from "../../constants/fonts";

export function FindManufacturerModal({ onClose }) {
    const suppliers = [
        { name: "Nutraceutix Labs", location: "Pune, MH", score: 94, lead: "28 days", price: "₹18/kg", tag: "Recommended" },
        { name: "BioSynth India", location: "Hyderabad, TS", score: 88, lead: "35 days", price: "₹16/kg", tag: null },
        { name: "PharmaForm Co.", location: "Ahmedabad, GJ", score: 82, lead: "21 days", price: "₹21/kg", tag: null },
    ];
    return (<ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[580px] overflow-hidden">
        <div className="px-8 py-6 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <div>
            <p className="text-[#1b1c1c] font-bold text-xl" style={{ fontFamily: M }}>Find Manufacturer</p>
            <p className="text-[#4d4634] text-sm mt-0.5" style={{ fontFamily: I }}>AI-matched results for Protein Powder</p>
          </div>
          <button onClick={onClose} className="text-[#4d4634]/40 hover:text-[#1b1c1c] transition"><X size={18}/></button>
        </div>
        <div className="p-6 flex flex-col gap-3">
          {suppliers.map((s, i) => (<div key={i} className="border border-[rgba(208,198,174,0.25)] rounded-xl p-5 flex items-center justify-between hover:border-[rgba(255,213,74,0.5)] hover:bg-[rgba(255,249,230,0.3)] transition-all cursor-pointer group" onClick={() => { toast.success(`RFQ sent to ${s.name}`); onClose(); }}>
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-[#efeded] flex items-center justify-center text-xl shrink-0">
                  <Building2 size={18} className="text-[#4d4634]"/>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>{s.name}</p>
                    {s.tag && <Badge label={s.tag} color="#16a34a" bg="rgba(22,163,74,0.1)"/>}
                  </div>
                  <p className="text-[#4d4634] text-sm mt-0.5" style={{ fontFamily: I }}>{s.location} · {s.lead} lead · {s.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-[#4d4634] font-bold tracking-widest uppercase" style={{ fontFamily: I }}>AI Score</p>
                  <p className="text-[#16a34a] font-bold text-lg" style={{ fontFamily: M }}>{s.score}%</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <div className="px-4 py-2 bg-[#303031] text-white text-sm font-bold rounded-xl" style={{ fontFamily: M }}>Send RFQ</div>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </ModalOverlay>);
}
