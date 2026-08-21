import { useState } from "react";
import { Plus } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";
import { toast } from "sonner";

export function SuppliersPage() {
  const { data: suppliers, loading, refetch } = useApi("/suppliers/");

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Suppliers</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Manage your raw material and packaging suppliers.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => toast.info("Coming soon: Supplier Modal")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Plus size={14}/> Add Supplier
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
                    {["Name", "Location", "Rating", "Lead Time", "Status"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(suppliers || []).map(s => (
                    <tr key={s.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{s.name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.city ? `${s.city}, ${s.country}` : s.country || "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.rating || "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.lead_time_days ? `${s.lead_time_days} days` : "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{s.status}</td>
                    </tr>
                  ))}

                  {!loading && suppliers?.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No suppliers found.</td></tr>}
                  {loading && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">Loading...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-16" />
        </div>
      </main>
    </div>
  );
}
