import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreateInspectionModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productionBatch: "",
    result: "pass",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: batches } = useApi("/production/batches/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        production_batch: formData.productionBatch,
        result: formData.result,
        checks: { visual: "ok" }, // mock basic checks
        notes: formData.notes,
      };
      
      await api.post("/quality/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create inspection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Log Quality Inspection</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Production Batch</label>
            <select required value={formData.productionBatch} onChange={e => setFormData({ ...formData, productionBatch: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="">-- Select Batch --</option>
              {(batches || []).map(b => <option key={b.id} value={b.id}>{b.batch_number}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Overall Result</label>
            <select value={formData.result} onChange={e => setFormData({ ...formData, result: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="rework">Needs Rework</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Notes & Defects</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} rows={2}></textarea>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Saving..." : "Log Inspection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
