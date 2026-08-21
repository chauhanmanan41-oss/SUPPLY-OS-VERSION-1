import { useState, useRef } from "react";
import { Brain, X, Send } from "lucide-react";
import { ModalOverlay } from "../common/Modal";
import { I, M } from "../../constants/fonts";

export function AskAIModal({ onClose }) {
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello Manan! I'm your AI Supply Chain Advisor. I have real-time visibility into your orders, suppliers, and procurement pipeline. What would you like to know?" }
    ]);
    const [input, setInput] = useState("");
    const messagesRef = useRef(null);
    const send = () => {
        if (!input.trim())
            return;
        const userMsg = input.trim();
        setMessages(m => [...m, { role: "user", text: userMsg }]);
        setInput("");
        const lower = userMsg.toLowerCase();
        const resp = lower.includes("risk") ? "Highest risk right now: PO-8915 from Swift Logistics is 4 days late. Re-routing to local networks can avoid ₹1.2L production loss."
            : lower.includes("supplier") ? "Alpha Packaging Corp has the best AI health score at 92%. Consider consolidating PO-8921 and PO-8922 to save ₹45,000."
                : lower.includes("save") || lower.includes("saving") ? "3 savings opportunities identified: (1) Consolidate PO-8921 & 8922 — ₹45,000 (2) Bulk Whey discount — ₹18,000 (3) Switch logistics provider — ₹2.3L. Total potential: ₹2.93L."
                    : lower.includes("rfq") ? "You have 12 pending RFQs. 3 require immediate review, especially the Alpha Packaging quote expiring in 24h. BioSynth India responded with 12% lower pricing."
                        : "Based on current data, your top priority is re-routing PO-8915 to avoid a 4-day production halt. I can generate a full supplier comparison in 30 seconds if needed.";
        setTimeout(() => {
            setMessages(m => [...m, { role: "ai", text: resp }]);
            if (messagesRef.current)
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }, 600);
    };
    return (<ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[420px] h-[580px] flex flex-col overflow-hidden">
        <div className="bg-[#ffd54a] px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="size-8 bg-[rgba(115,92,0,0.15)] rounded-xl flex items-center justify-center">
            <Brain size={16} className="text-[#735c00]"/>
          </div>
          <div className="flex-1">
            <p className="text-[#735c00] font-bold" style={{ fontFamily: M }}>AI Advisor</p>
            <p className="text-[#735c00]/60 text-xs" style={{ fontFamily: I }}>SupplyOS Intelligence · Always on</p>
          </div>
          <button onClick={onClose} className="text-[#735c00]/50 hover:text-[#735c00] transition"><X size={18}/></button>
        </div>
        <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
          {messages.map((m, i) => (<div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${m.role === "user" ? "bg-[#303031] text-white rounded-br-sm" : "bg-white border border-[rgba(208,198,174,0.3)] text-[#1b1c1c] rounded-bl-sm shadow-sm"}`} style={{ fontFamily: I }}>
                {m.text}
              </div>
            </div>))}
        </div>
        <div className="p-4 border-t border-[rgba(208,198,174,0.2)] flex gap-2 bg-white shrink-0">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about risks, savings, suppliers…" className="flex-1 bg-[#efeded] rounded-xl px-4 py-2.5 text-sm outline-none text-[#1b1c1c] placeholder:text-[rgba(77,70,52,0.5)]" style={{ fontFamily: I }}/>
          <button onClick={send} className="bg-[#ffd54a] text-[#735c00] font-bold rounded-xl px-4 py-2.5 hover:brightness-105 transition text-sm" style={{ fontFamily: M }}>
            <Send size={14}/>
          </button>
        </div>
      </div>
    </ModalOverlay>);
}
