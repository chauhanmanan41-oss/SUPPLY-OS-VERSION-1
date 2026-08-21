import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";
import { Badge } from "../../components/common/Badge";
import { CreateShipmentModal } from "./CreateShipmentModal";
import { toast } from "sonner";

export function LogisticsPage() {
  const [modal, setModal] = useState(false);
  const { data: shipments, refetch } = useApi("/logistics/");

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Logistics & Shipments</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Manage inbound deliveries from suppliers and outbound shipments to customers.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Plus size={14}/> Create Shipment
              </button>
              <button onClick={() => toast.info("Exporting report...")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Download size={14}/> Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
                    {["Tracking #", "Type", "Ref", "Courier", "Status", "ETA"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(shipments || []).map(s => (
                    <tr key={s.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{s.tracking_number || "N/A"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.shipment_type === "inbound" ? "Inbound (PO)" : "Outbound (SO)"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.po_number || s.order_number || "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.courier || "-"}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ fontFamily: I }}>
                        <Badge label={s.shipment_status} color={s.shipment_status === "delivered" ? "#16a34a" : "#3b82f6"} bg={s.shipment_status === "delivered" ? "rgba(22,163,74,0.1)" : "rgba(59,130,246,0.1)"} />
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.eta || "-"}</td>
                    </tr>
                  ))}
                  {shipments?.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No shipments found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-16" />
        </div>
      </main>
      
      {modal && <CreateShipmentModal onClose={() => setModal(false)} onSuccess={() => { toast.success("Shipment created!"); refetch(); }} />}
    </div>
  );
}
