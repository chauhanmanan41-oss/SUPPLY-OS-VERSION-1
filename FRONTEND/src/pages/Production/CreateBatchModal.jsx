import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreateBatchModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productionPlan: "",
    quantityPlanned: "",
    machine: "",
    warehouse: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: plans } = useApi("/production/plans/");
  const { data: warehouses } = useApi("/warehouses/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        production_plan: formData.productionPlan,
        quantity_planned: formData.quantityPlanned,
        machine: formData.machine,
        warehouse: formData.warehouse,
      };
      
      await api.post("/production/batches/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create Batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Start Production Batch</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Production Plan</label>
            <select required value={formData.productionPlan} onChange={e => setFormData({ ...formData, productionPlan: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="">-- Select Plan --</option>
              {(plans || []).map(p => <option key={p.id} value={p.id}>{p.name} ({p.product_name})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Batch Quantity</label>
            <input required type="number" min="1" value={formData.quantityPlanned} onChange={e => setFormData({ ...formData, quantityPlanned: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Machine / Work Center</label>
            <input required type="text" value={formData.machine} onChange={e => setFormData({ ...formData, machine: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} placeholder="e.g. Line 1" />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Output Warehouse</label>
            <select required value={formData.warehouse} onChange={e => setFormData({ ...formData, warehouse: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="">-- Select Warehouse --</option>
              {(warehouses || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Starting..." : "Start Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
