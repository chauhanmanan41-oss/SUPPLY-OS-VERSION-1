import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreatePOModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    supplier: "",
    warehouse: "",
    expectedDelivery: "",
  });
  const [lines, setLines] = useState([{ material: "", quantity: "", unit_price: "" }]);
  const [loading, setLoading] = useState(false);

  const { data: materials } = useApi("/materials/");
  const { data: suppliers } = useApi("/suppliers/");
  const { data: warehouses } = useApi("/warehouses/");

  const addLine = () => setLines([...lines, { material: "", quantity: "", unit_price: "" }]);
  const removeLine = (idx) => setLines(lines.filter((_, i) => i !== idx));
  const updateLine = (idx, field, val) => {
    const newLines = [...lines];
    newLines[idx][field] = val;
    setLines(newLines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        supplier: formData.supplier || null,
        warehouse: formData.warehouse || null,
        expected_delivery: formData.expectedDelivery || null,
        lines: lines.map(l => ({
            material: l.material,
            quantity: l.quantity,
            unit_price: l.unit_price
        }))
      };
      
      await api.post("/procurement/purchase-orders/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create PO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Create Purchase Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Supplier</label>
            <select required value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
              <option value="">-- Select Supplier --</option>
              {(suppliers || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Destination Warehouse</label>
            <select value={formData.warehouse} onChange={e => setFormData({ ...formData, warehouse: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
              <option value="">-- None --</option>
              {(warehouses || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Expected Delivery</label>
            <input type="date" value={formData.expectedDelivery} onChange={e => setFormData({ ...formData, expectedDelivery: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold text-[#4d4634]" style={{ fontFamily: I }}>Line Items</label>
              <button type="button" onClick={addLine} className="text-[11px] font-bold text-[#4d4634] hover:text-[#1b1c1c] flex items-center gap-1" style={{ fontFamily: M }}>
                <Plus size={12} /> Add Item
              </button>
            </div>
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select required value={line.material} onChange={e => updateLine(idx, "material", e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
                  <option value="">-- Select Material --</option>
                  {(materials || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input required type="number" placeholder="Qty" value={line.quantity} onChange={e => updateLine(idx, "quantity", e.target.value)} className="w-20 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
                <input required type="number" step="0.01" placeholder="Price" value={line.unit_price} onChange={e => updateLine(idx, "unit_price", e.target.value)} className="w-24 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
                <button type="button" onClick={() => removeLine(idx)} disabled={lines.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-30">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading || !formData.supplier || lines.some(l => !l.material || !l.quantity || !l.unit_price)} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Creating..." : "Create PO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
