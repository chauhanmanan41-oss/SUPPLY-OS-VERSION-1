import { Brain } from "lucide-react";
import { TagRow, WF, WIn, WSel } from "./FormFields";
import { I, M } from "../../constants/fonts";

export function WStep3({ data, update }) {
    const PKG = ["Plastic Bottles", "Glass Jars", "Pouches", "Sachets", "Blister Packs", "Cartons", "Custom"];
    const TRANS = ["Road (FTL/LTL)", "Rail Freight", "Air Cargo", "Sea Freight", "Cold Chain Express"];
    const STO = ["Ambient (15–30°C)", "Cool (8–15°C)", "Refrigerated (2–8°C)", "Frozen (<0°C)"];
    const Tog = ({ label, value, onChange }) => (<div className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-[rgba(208,198,174,0.25)] hover:border-[rgba(208,198,174,0.5)] transition">
      <span className="text-[14px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{label}</span>
      <button onClick={onChange} className="w-11 h-6 relative rounded-full transition-all duration-200" style={{ background: value ? "#303031" : "#efeded" }}>
        <div className="absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all duration-200" style={{ left: value ? "calc(100% - 20px)" : "4px" }}/>
      </button>
    </div>);
    return (<div className="max-w-[740px] flex flex-col gap-8">
      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Materials & Packaging</p>
        <div className="grid grid-cols-2 gap-4">
          <WF label="Raw Materials Needed"><WIn value={data.rawMaterials} onChange={e => update({ rawMaterials: e.target.value })} placeholder="e.g. Whey Protein, Cocoa Powder, Stevia"/></WF>
          <WF label="Packaging Type">
            <WSel value={data.packagingType} onChange={e => update({ packagingType: e.target.value })}>
              <option value="">Select packaging…</option>{PKG.map(p => <option key={p}>{p}</option>)}
            </WSel>
          </WF>
          <WF label="Storage Conditions">
            <WSel value={data.storageConditions} onChange={e => update({ storageConditions: e.target.value })}>
              {STO.map(s => <option key={s}>{s}</option>)}
            </WSel>
          </WF>
          <WF label="MOQ (Min. Order Qty.)"><WIn type="number" value={data.moq} onChange={e => update({ moq: e.target.value })} placeholder="e.g. 500 units"/></WF>
        </div>
      </div>
      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Logistics & Distribution</p>
        <div className="grid grid-cols-2 gap-4">
          <WF label="Warehouse City"><WIn value={data.warehouseCity} onChange={e => update({ warehouseCity: e.target.value })} placeholder="e.g. Mumbai, Delhi, Bangalore"/></WF>
          <WF label="Expected Supplier Count"><WIn type="number" value={data.supplierCount} onChange={e => update({ supplierCount: e.target.value })} placeholder="e.g. 3"/></WF>
          <WF label="Transport Preferences" required={false}><TagRow options={TRANS} selected={data.transport} onToggle={t => update({ transport: data.transport.includes(t) ? data.transport.filter(x => x !== t) : [...data.transport, t] })}/></WF>
        </div>
      </div>
      <div>
        <p className="text-[#1b1c1c] font-bold text-[15px] mb-4" style={{ fontFamily: M }}>Compliance & Special Requirements</p>
        <div className="grid grid-cols-2 gap-3">
          <Tog label="Cold Chain Required" value={data.coldChain} onChange={() => update({ coldChain: !data.coldChain })}/>
          <Tog label="Import / Export Involved" value={data.importExport} onChange={() => update({ importExport: !data.importExport })}/>
          <Tog label="Quality Testing Labs" value={data.qualityLabs} onChange={() => update({ qualityLabs: !data.qualityLabs })}/>
        </div>
        {data.coldChain && (<div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
            <Brain size={13} className="text-[#3b82f6]"/>
            <p className="text-[12px] text-[#3b82f6]" style={{ fontFamily: I }}>
              AI note: Cold chain adds ~15% to logistics costs — this is reflected in your AI blueprint.
            </p>
          </div>)}
      </div>
    </div>);
}
/* ── Step 4: AI Blueprint ── */
