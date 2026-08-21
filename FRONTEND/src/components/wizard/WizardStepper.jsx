import { CheckCircle, Clock } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { W_STEPS } from "../../constants/wizard";

export function WizardStepper({ step }) {
    return (<div className="bg-white border-b border-[rgba(208,198,174,0.2)] px-8 py-5 shrink-0">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[#1b1c1c] font-bold text-[22px]" style={{ fontFamily: M }}>Create New Product</h1>
          <p className="text-[#4d4634] text-[13px] mt-1" style={{ fontFamily: I }}>
            Let's configure your product before AI builds the optimal supply chain.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ background: "rgba(255,213,74,0.1)", borderColor: "rgba(255,213,74,0.3)" }}>
            <Clock size={13} className="text-[#735c00]"/>
            <span className="text-[#735c00] text-[12px] font-semibold" style={{ fontFamily: I }}>~5 minutes</span>
          </div>
          <span className="text-[#4d4634] text-[13px]" style={{ fontFamily: I }}>
            Step <strong className="text-[#1b1c1c]">{step}</strong> of {W_STEPS.length}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        {W_STEPS.map(({ n, label, Icon }, idx) => {
            const done = step > n;
            const active = step === n;
            return (<div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <div className="size-10 rounded-full flex items-center justify-center transition-all duration-300" style={{
                    background: done ? "#303031" : active ? "#ffd54a" : "#efeded",
                    boxShadow: active ? "0 0 0 5px rgba(255,213,74,0.18)" : "none",
                }}>
                  {done
                    ? <CheckCircle size={17} color="white"/>
                    : <Icon size={17} color={active ? "#735c00" : "#9a8f7a"}/>}
                </div>
                <p className="text-[12px] font-bold whitespace-nowrap leading-tight text-center" style={{ fontFamily: M, color: done ? "#303031" : active ? "#1b1c1c" : "rgba(77,70,52,0.4)" }}>
                  {label}
                </p>
              </div>
              {idx < W_STEPS.length - 1 && (<div className="flex-1 mx-3 mb-6">
                  <div className="h-[2px] rounded-full transition-all duration-500" style={{ background: done ? "#303031" : "rgba(208,198,174,0.3)" }}/>
                </div>)}
            </div>);
        })}
      </div>
    </div>);
}
/* ── Step 1: Product Details ── */
