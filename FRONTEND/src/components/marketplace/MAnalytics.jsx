import { Brain, FileText, Clock, Shield } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { CHART_PALETTE } from "../../constants/colors";
import { I, M } from "../../constants/fonts";
import { MKT_ANALYTICS } from "../../constants/marketplace";

export function MAnalytics() {
    return (<div className="flex flex-col gap-4">
      <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>Marketplace Analytics</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Category distribution */}
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[14px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Partners by Category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={MKT_ANALYTICS.categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {MKT_ANALYTICS.categories.map((_, i) => <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]}/>)}
              </Pie>
              <RTooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {MKT_ANALYTICS.categories.map((c, i) => (<div key={c.name} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full shrink-0" style={{ background: CHART_PALETTE[i % CHART_PALETTE.length] }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{c.name} {c.value}%</span>
              </div>))}
          </div>
        </div>

        {/* Growth trend */}
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
          <p className="font-bold text-[14px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Partner Growth (2024)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MKT_ANALYTICS.growth} barSize={24}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fill: "#4d4634", fontFamily: I }} axisLine={false} tickLine={false} width={30}/>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
            { label: "Verified Partners", value: "1,470+", icon: Shield, color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
            { label: "Avg. Response Time", value: "4.2 hrs", icon: Clock, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
            { label: "Active RFQs Today", value: "1,847", icon: FileText, color: "#f97316", bg: "rgba(249,115,22,0.08)" },
            { label: "Avg. AI Match Score", value: "91%", icon: Brain, color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
        ].map((k, i) => (<div key={i} className="bg-white rounded-2xl p-4 border border-[rgba(208,198,174,0.2)] flex items-center gap-3">
            <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.bg }}>
              <k.icon size={18} style={{ color: k.color }}/>
            </div>
            <div>
              <p className="font-bold text-[18px] text-[#1b1c1c]" style={{ fontFamily: M }}>{k.value}</p>
              <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{k.label}</p>
            </div>
          </div>))}
      </div>
    </div>);
}
