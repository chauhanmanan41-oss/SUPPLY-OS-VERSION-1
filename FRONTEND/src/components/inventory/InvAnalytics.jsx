import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { CHART_PALETTE } from "../../constants/colors";
import { I, M } from "../../constants/fonts";
import { INV_CAT_DATA, INV_MOVE_DATA } from "../../constants/inventory";

export function InvAnalytics() {
    return (<div className="flex flex-col gap-4">
      <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Inventory Analytics</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[13px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Inventory Value by Category</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={INV_CAT_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={66} innerRadius={36}>
                {INV_CAT_DATA.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]}/>)}
              </Pie>
              <RTooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {INV_CAT_DATA.map((c, i) => (<div key={c.name} className="flex items-center gap-1">
                <div className="size-2 rounded-full shrink-0" style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{c.name} {c.value}%</span>
              </div>))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[13px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Stock Movement (₹L)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={INV_MOVE_DATA} barSize={18} barGap={4}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false} width={25}/>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
              <Bar dataKey="received" fill="#16a34a" radius={[4, 4, 0, 0]} name="Received"/>
              <Bar dataKey="consumed" fill="#f97316" radius={[4, 4, 0, 0]} name="Consumed"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[{ col: "#16a34a", l: "Received" }, { col: "#f97316", l: "Consumed" }].map((d, i) => (<div key={i} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: d.col }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
