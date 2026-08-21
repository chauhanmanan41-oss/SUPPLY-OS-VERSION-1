import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { CHART_PALETTE } from "../../constants/colors";
import { I, M } from "../../constants/fonts";
import { PRO_SPEND_DATA } from "../../constants/procurement";

export function ProAnalytics() {
    return (<div className="flex flex-col gap-4">
      <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Procurement Analytics</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[13px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Monthly Spend (₹L)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={PRO_SPEND_DATA} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false} width={25}/>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[13px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Spend by Category</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[
            { name: "Manufacturing", value: 57 },
            { name: "Raw Materials", value: 25 },
            { name: "Packaging", value: 9 },
            { name: "Logistics", value: 9 },
        ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {[0, 1, 2, 3].map(i => <Cell key={i} fill={CHART_PALETTE[i]}/>)}
              </Pie>
              <RTooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {["Manufacturing", "Raw Materials", "Packaging", "Logistics"].map((n, i) => (<div key={n} className="flex items-center gap-1">
                <div className="size-2 rounded-full shrink-0" style={{ background: CHART_PALETTE[i] }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{n}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
