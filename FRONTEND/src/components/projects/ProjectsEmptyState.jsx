import { Plus } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function ProjectsEmptyState({ onAction }) {
    return (<div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="text-7xl">🏭</div>
      <div className="text-center">
        <p className="text-[#1b1c1c] font-bold text-2xl" style={{ fontFamily: M }}>Create your first product</p>
        <p className="text-[#4d4634] text-base mt-2 max-w-sm" style={{ fontFamily: I }}>
          Start building your manufacturing ecosystem with AI-powered supply chain intelligence.
        </p>
      </div>
      <button onClick={onAction} className="flex items-center gap-2 px-7 py-3.5 bg-[#303031] text-white font-bold rounded-xl hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
        <Plus size={16}/> Create Product
      </button>
    </div>);
}
/* AI Portfolio Insights — right sidebar for Projects page */
