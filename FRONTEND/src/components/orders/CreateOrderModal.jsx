import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreateOrderModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    warehouse: "",
  });
  const [lines, setLines] = useState([{ product: "", quantity: "", unit_price: "" }]);
  const [loading, setLoading] = useState(false);

  const { data: products } = useApi("/products/");
  const { data: warehouses } = useApi("/warehouses/");

  const addLine = () => setLines([...lines, { product: "", quantity: "", unit_price: "" }]);
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
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        warehouse: formData.warehouse || null,
        lines: lines.map(l => ({
            product: l.product,
            quantity: l.quantity,
            unit_price: l.unit_price
        }))
      };
      
      await api.post("/orders/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create Order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Create Sales Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Customer Name</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Customer Email</label>
              <input type="email" value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
            </div>
          </div>
          
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Fulfill from Warehouse</label>
            <select value={formData.warehouse} onChange={e => setFormData({ ...formData, warehouse: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
              <option value="">-- Auto-select --</option>
              {(warehouses || []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
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
                <select required value={line.product} onChange={e => updateLine(idx, "product", e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }}>
                  <option value="">-- Select Product --</option>
                  {(products || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input required type="number" min="1" placeholder="Qty" value={line.quantity} onChange={e => updateLine(idx, "quantity", e.target.value)} className="w-20 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
                <input required type="number" step="0.01" min="0.01" placeholder="Price" value={line.unit_price} onChange={e => updateLine(idx, "unit_price", e.target.value)} className="w-24 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
                <button type="button" onClick={() => removeLine(idx)} disabled={lines.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-30">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading || lines.some(l => !l.product || !l.quantity || !l.unit_price)} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
