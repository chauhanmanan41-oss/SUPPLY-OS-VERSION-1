import { useState } from "react";
import { X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { useApi } from "../../hooks/useApi";

export function CreateShipmentModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: "inbound",
    referenceId: "",
    courier: "",
    trackingNumber: "",
    eta: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: pos } = useApi("/procurement/purchase-orders/");
  const { data: sos } = useApi("/orders/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        shipment_type: formData.type,
        courier: formData.courier,
        tracking_number: formData.trackingNumber,
        eta: formData.eta || null,
      };

      if (formData.type === "inbound") {
        payload.purchase_order = formData.referenceId;
      } else {
        payload.sales_order = formData.referenceId;
      }
      
      await api.post("/logistics/", payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create Shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between bg-[#fbf9f9]">
          <h2 className="text-lg font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Create Shipment</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          
          <div className="flex bg-[#efeded] p-1 rounded-xl">
            <button type="button" onClick={() => setFormData({ ...formData, type: "inbound", referenceId: "" })} className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition ${formData.type === "inbound" ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4d4634] hover:text-[#1b1c1c]"}`} style={{ fontFamily: M }}>Inbound (PO)</button>
            <button type="button" onClick={() => setFormData({ ...formData, type: "outbound", referenceId: "" })} className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition ${formData.type === "outbound" ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4d4634] hover:text-[#1b1c1c]"}`} style={{ fontFamily: M }}>Outbound (SO)</button>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>
              {formData.type === "inbound" ? "Purchase Order" : "Sales Order"}
            </label>
            <select required value={formData.referenceId} onChange={e => setFormData({ ...formData, referenceId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none">
              <option value="">-- Select Order --</option>
              {formData.type === "inbound" 
                ? (pos || []).map(o => <option key={o.id} value={o.id}>{o.po_number}</option>)
                : (sos || []).map(o => <option key={o.id} value={o.id}>{o.order_number}</option>)
              }
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Courier / Carrier</label>
              <input required type="text" value={formData.courier} onChange={e => setFormData({ ...formData, courier: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Tracking #</label>
              <input type="text" value={formData.trackingNumber} onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#4d4634] mb-1.5" style={{ fontFamily: I }}>Expected Time of Arrival (ETA)</label>
            <input type="datetime-local" value={formData.eta} onChange={e => setFormData({ ...formData, eta: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] outline-none" style={{ fontFamily: I }} />
          </div>

          <div className="mt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Cancel</button>
            <button type="submit" disabled={loading || !formData.referenceId} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition disabled:opacity-50" style={{ background: "#303031", fontFamily: M }}>
              {loading ? "Saving..." : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
