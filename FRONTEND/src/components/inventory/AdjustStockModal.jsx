import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function AdjustStockModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    inventoryItem: "",
    quantityDelta: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: inventoryItems } = useApi("/inventory/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        quantity_delta: formData.quantityDelta,
        notes: formData.notes,
      };
      
      await api.post(`/inventory/${formData.inventoryItem}/adjust/`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to adjust stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Adjust Stock (Receive/Write-off)</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Inventory Item</label>
            <select required value={formData.inventoryItem} onChange={e => setFormData({ ...formData, inventoryItem: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="">-- Select Item --</option>
              {(inventoryItems || []).map(i => (
                <option key={i.id} value={i.id}>
                  {i.product_name || i.material_name} @ {i.warehouse_name} (Current: {i.quantity_on_hand})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Quantity Adjustment (+ or -)</label>
            <input required type="number" value={formData.quantityDelta} onChange={e => setFormData({ ...formData, quantityDelta: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} placeholder="e.g. 50 or -10" />
            <p className="text-[10px] text-[#4d4634] mt-1" style={{ fontFamily: I }}>Use positive numbers to receive stock, negative to write-off.</p>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Reason / Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} rows={2}></textarea>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Saving..." : "Confirm Adjustment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
