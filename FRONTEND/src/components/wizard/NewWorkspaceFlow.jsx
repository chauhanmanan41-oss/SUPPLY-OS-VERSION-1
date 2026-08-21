import React, { useState } from "react";
import { Sparkles, Settings, ArrowRight, X, Layers, CheckCircle2 } from "lucide-react";
import { AIAssistedCreation } from "./AIAssistedCreation";
import { ManualWorkspaceWizard } from "./ManualWorkspaceWizard";
import { I, M } from "../../constants/fonts";

export function NewWorkspaceFlow({ onClose }) {
  const [selectedMode, setSelectedMode] = useState(null); // 'ai' | 'manual' | null

  if (selectedMode === "ai") {
    return <AIAssistedCreation onBack={() => setSelectedMode(null)} onClose={onClose} />;
  }

  if (selectedMode === "manual") {
    return <ManualWorkspaceWizard onBack={() => setSelectedMode(null)} onClose={onClose} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f5ef] p-6 text-[#1b1c1c]">
      <div className="bg-white rounded-3xl border border-[rgba(208,198,174,0.5)] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#1b1c1c] text-white px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: M }}>
              Deploy New Enterprise Product Workspace
            </h2>
            <p className="text-xs text-white/60 mt-1" style={{ fontFamily: I }}>
              Both pathways generate an identical 12-module independent database architecture. Choose how to input specifications:
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white/80 hover:text-white"
              title="Cancel"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Mode Selector Cards */}
        <div className="p-10 grid grid-cols-2 gap-8 bg-[#fffcf3]">
          
          {/* Option A: AI Assisted */}
          <div
            onClick={() => setSelectedMode("ai")}
            className="group relative bg-white border-2 border-[rgba(208,198,174,0.4)] hover:border-[#e5b300] rounded-2xl p-7 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ffd54a] to-[#e5b300] text-[#1b1c1c] text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs" style={{ fontFamily: M }}>
              Recommended
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="size-14 rounded-2xl bg-[rgba(255,213,74,0.15)] group-hover:bg-[#1b1c1c] text-[#e5b300] group-hover:text-[#ffd54a] flex items-center justify-center transition duration-300">
                <Sparkles size={30} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#1b1c1c] group-hover:text-[#b38600] transition" style={{ fontFamily: M }}>
                  AI Assisted
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium" style={{ fontFamily: I }}>
                  Intelligent specification extraction from normal words.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-2.5 my-2 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" /> Auto-extracts raw material BOMs
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" /> Generates compliance & testing requirements
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" /> Aligns top verified marketplace partners
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" /> Editable preview before workspace creation
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-[#1b1c1c] group-hover:text-[#e5b300] transition" style={{ fontFamily: M }}>
              <span>Launch AI Builder</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Option B: Manual Workspace */}
          <div
            onClick={() => setSelectedMode("manual")}
            className="group relative bg-white border-2 border-[rgba(208,198,174,0.4)] hover:border-[#1b1c1c] rounded-2xl p-7 shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4">
              <div className="size-14 rounded-2xl bg-gray-100 group-hover:bg-[#1b1c1c] text-gray-600 group-hover:text-white flex items-center justify-center transition duration-300">
                <Settings size={28} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#1b1c1c] transition" style={{ fontFamily: M }}>
                  Manual Workspace
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium" style={{ fontFamily: I }}>
                  Full granular control across all 12 enterprise steps.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-2.5 my-2 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-gray-500 shrink-0" /> Complete 12-Step Guided Wizard
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-gray-500 shrink-0" /> Manually configure BOMs, MOQ & economics
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-gray-500 shrink-0" /> Specify exact warehousing & transport SLAs
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-gray-500 shrink-0" /> Direct database commitment without AI defaults
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-gray-700 group-hover:text-[#1b1c1c] transition" style={{ fontFamily: M }}>
              <span>Start 12-Step Wizard</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-[#f7f5ef] px-8 py-4 border-t border-[rgba(208,198,174,0.3)] text-center text-xs text-gray-500" style={{ fontFamily: I }}>
          🔒 Both creation methods atomically provision isolated database parent entities with unique URL routing (<code className="bg-white px-1.5 py-0.5 rounded font-mono">/workspace/:uuid</code>).
        </div>
      </div>
    </div>
  );
}
