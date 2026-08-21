import { useState } from "react";
import { CheckCircle, X, Send } from "lucide-react";
import { ModalOverlay } from "../common/Modal";
import { I, M } from "../../constants/fonts";

export function CreateRFQModal({ onClose }) {
    const [done, setDone] = useState(false);
    return (<ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden">
        <div className="px-8 py-6 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <p className="text-[#1b1c1c] font-bold text-xl" style={{ fontFamily: M }}>Create RFQ</p>
          <button onClick={onClose} className="text-[#4d4634]/40 hover:text-[#1b1c1c] transition"><X size={18}/></button>
        </div>
        {done ? (<div className="p-12 flex flex-col items-center gap-4 text-center">
            <div className="size-16 bg-[rgba(22,163,74,0.1)] rounded-full flex items-center justify-center">
              <CheckCircle size={28} className="text-[#16a34a]"/>
            </div>
            <p className="text-[#1b1c1c] font-bold text-xl" style={{ fontFamily: M }}>RFQ Submitted!</p>
            <p className="text-[#4d4634] text-sm" style={{ fontFamily: I }}>Sent to 3 qualified suppliers. Responses expected in 48 hours.</p>
            <button onClick={onClose} className="mt-2 bg-[#303031] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>Done</button>
          </div>) : (<div className="p-8 flex flex-col gap-4">
            {[
                { label: "Material / Product", defaultValue: "Whey Protein Isolate 80%", type: "text" },
                { label: "Quantity (kg)", defaultValue: "500", type: "number" },
            ].map(f => (<div key={f.label} className="flex flex-col gap-2">
                <label className="text-[#4d4634] text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: I }}>{f.label}</label>
                <input type={f.type} defaultValue={f.defaultValue} className="border border-[rgba(208,198,174,0.4)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd54a] transition text-[#1b1c1c]" style={{ fontFamily: I }}/>
              </div>))}
            <div className="flex flex-col gap-2">
              <label className="text-[#4d4634] text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: I }}>Delivery Required By</label>
              <input type="date" className="border border-[rgba(208,198,174,0.4)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ffd54a] transition" style={{ fontFamily: I }}/>
            </div>
            <button onClick={() => setDone(true)} className="mt-2 bg-[#303031] text-white font-bold py-3.5 rounded-xl hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
              Send to Suppliers
            </button>
          </div>)}
      </div>
    </ModalOverlay>);
}
