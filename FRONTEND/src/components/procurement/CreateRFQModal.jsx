import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreateRFQModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    dueDate: "",
    suppliers: [],
    notes: "",
  });
  const [lines, setLines] = useState([{ material: "", quantity: "" }]);
  const [loading, setLoading] = useState(false);

  const { data: materials } = useApi("/materials/");
  const { data: suppliers } = useApi("/suppliers/");

  const addLine = () => setLines([...lines, { material: "", quantity: "" }]);
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
        due_date: formData.dueDate,
        suppliers: formData.suppliers,
        notes: formData.notes,
        lines: lines.map(l => ({ material: l.material, quantity: l.quantity }))
      };
      
      await api.post("/procurement/rfqs/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create RFQ");
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers.includes(id) 
        ? prev.suppliers.filter(x => x !== id) 
        : [...prev.suppliers, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Create Request for Quote (RFQ)</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          
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
                <input required type="number" placeholder="Qty" value={line.quantity} onChange={e => updateLine(idx, "quantity", e.target.value)} className="w-24 px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
                <button type="button" onClick={() => removeLine(idx)} disabled={lines.length === 1} className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-30">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Due Date</label>
            <input required type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Select Suppliers to Invite</label>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto border p-2 rounded-xl" style={{ borderColor: "rgba(208,198,174,0.3)" }}>
              {(suppliers || []).map(s => (
                <label key={s.id} className="flex items-center gap-2 text-[13px]" style={{ fontFamily: I }}>
                  <input type="checkbox" checked={formData.suppliers.includes(s.id)} onChange={() => handleSupplierToggle(s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} rows={2}></textarea>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading || lines.some(l => !l.material || !l.quantity) || formData.suppliers.length === 0} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Creating..." : "Send RFQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
