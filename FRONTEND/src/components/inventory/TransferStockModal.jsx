import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function TransferStockModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fromWarehouse: "",
    toWarehouse: "",
    product: "",
    material: "",
    quantity: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: warehouses } = useApi("/warehouses/");
  const { data: products } = useApi("/products/");
  const { data: materials } = useApi("/materials/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        from_warehouse: formData.fromWarehouse,
        to_warehouse: formData.toWarehouse,
        quantity: formData.quantity,
        notes: formData.notes,
      };
      if (formData.product) payload.finished_product = formData.product;
      if (formData.material) payload.material = formData.material;
      
      await api.post("/inventory/transfer/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to transfer stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Transfer Stock</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>From Warehouse</label>
              <select required value={formData.fromWarehouse} onChange={e => setFormData({ ...formData, fromWarehouse: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
                <option value="">-- Select --</option>
                {(warehouses || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>To Warehouse</label>
              <select required value={formData.toWarehouse} onChange={e => setFormData({ ...formData, toWarehouse: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
                <option value="">-- Select --</option>
                {(warehouses || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Product (Optional)</label>
            <select value={formData.product} onChange={e => setFormData({ ...formData, product: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
              <option value="">-- None --</option>
              {(products || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Material (Optional)</label>
            <select value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
              <option value="">-- None --</option>
              {(materials || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Quantity</label>
            <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading || (!formData.product && !formData.material) || formData.fromWarehouse === formData.toWarehouse} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Transferring..." : "Confirm Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
