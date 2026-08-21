import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";

export function CreatePartnerModal({ onClose, onSuccess }) {
  const categories = [
    { code: "raw_materials", label: "Raw Materials" },
    { code: "manufacturers", label: "Manufacturer" },
    { code: "packaging", label: "Packaging" },
    { code: "warehouses", label: "Warehouse" },
    { code: "logistics", label: "Logistics" },
    { code: "quality_labs", label: "Testing Lab" },
  ];
  const [categoryCode, setCategoryCode] = useState("raw_materials");
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    city: "",
    email: "",
    phone: "",
    rating: 4.5,
    leadTime: 14,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = "/marketplace/partners/";
      const payload = {
        name: formData.name,
        country: formData.country || "India",
        city: formData.city || "Industrial Hub",
        contact_email: formData.email,
        contact_phone: formData.phone,
        rating: parseFloat(formData.rating) || 4.5,
        lead_time_days: parseInt(formData.leadTime, 10) || 14,
        category_code: categoryCode,
        verified_status: true,
        status: "active"
      };
      
      await api.post(endpoint, payload);
      onSuccess(formData.name);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create marketplace partner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Add Enterprise Partner</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Business Domain</label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#efeded] p-1.5 rounded-xl">
              {categories.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCategoryCode(c.code)}
                  className={`py-2 px-2 text-[12px] font-bold rounded-lg transition truncate ${categoryCode === c.code ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4d4634] hover:text-[#1b1c1c]"}`}
                  style={{ fontFamily: M }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Enterprise Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none focus:border-[#ffd54a]" style={{ fontFamily: I }} placeholder="Partner Name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Country</label>
              <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none focus:border-[#ffd54a]" style={{ fontFamily: I }} placeholder="e.g. India" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>City</label>
              <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none focus:border-[#ffd54a]" style={{ fontFamily: I }} placeholder="e.g. Mumbai" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Lead Time (Days)</label>
              <input type="number" value={formData.leadTime} onChange={e => setFormData({ ...formData, leadTime: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none focus:border-[#ffd54a]" style={{ fontFamily: I }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Initial Rating</label>
              <input type="number" step="0.1" max="5" min="1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none focus:border-[#ffd54a]" style={{ fontFamily: I }} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Saving..." : "Add Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
