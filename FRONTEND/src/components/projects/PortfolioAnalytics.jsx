import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { I, M } from "../../constants/fonts";
import { STAGE_COLORS } from "../../constants/projects";

export function PortfolioAnalytics({ projects }) {
    const statusCount = Object.entries(projects.reduce((acc, p) => {
        acc[p.stage] = (acc[p.stage] || 0) + 1;
        return acc;
    }, {})).map(([name, value]) => ({ name, value, color: STAGE_COLORS[name]?.color ?? "#6b7280" }));
    const budgetData = projects.map(p => ({
        name: p.emoji + " " + p.name.split(" ")[0],
        budget: p.budget / 100000,
        spent: p.spent / 100000,
    }));
    const healthData = projects.map(p => ({
        name: p.emoji + " " + p.name.split(" ")[0],
        health: p.health,
        fill: p.healthColor,
    }));
    return (<div>
      <h3 className="text-[#1b1c1c] font-bold text-base mb-5" style={{ fontFamily: M }}>Portfolio Analytics</h3>
      <div className="grid grid-cols-3 gap-5">
        {/* Products by Status */}
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-1" style={{ fontFamily: M }}>Products by Stage</p>
          <p className="text-[#4d4634] text-[12px] mb-4" style={{ fontFamily: I }}>Current distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusCount} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {statusCount.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Pie>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
            {statusCount.map(s => (<div key={s.name} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: s.color }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{s.name} ({s.value})</span>
              </div>))}
          </div>
        </div>

        {/* Budget vs Spent */}
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-1" style={{ fontFamily: M }}>Budget vs Spent</p>
          <p className="text-[#4d4634] text-[12px] mb-4" style={{ fontFamily: I }}>In lakhs (₹L)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={budgetData} barGap={2}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: I, fill: "#4d4634" }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }} formatter={(v) => [`₹${v.toFixed(0)}L`]}/>
              <Bar dataKey="budget" fill="rgba(208,198,174,0.3)" radius={[4, 4, 0, 0]} name="Budget"/>
              <Bar dataKey="spent" fill="#ffd54a" radius={[4, 4, 0, 0]} name="Spent"/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[{ color: "rgba(208,198,174,0.5)", label: "Budget" }, { color: "#ffd54a", label: "Spent" }].map(l => (<div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm" style={{ background: l.color }}/>
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{l.label}</span>
              </div>))}
          </div>
        </div>

        {/* AI Health Scores */}
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-1" style={{ fontFamily: M }}>AI Health Scores</p>
          <p className="text-[#4d4634] text-[12px] mb-4" style={{ fontFamily: I }}>Per product</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={healthData} layout="vertical" barGap={2}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fontFamily: I, fill: "#4d4634" }} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontFamily: I, fill: "#4d4634" }} axisLine={false} tickLine={false} width={60}/>
              <RTooltip contentStyle={{ fontFamily: I, fontSize: 12, borderRadius: 8, border: "1px solid rgba(208,198,174,0.3)" }} formatter={(v) => [`${v}%`, "AI Health"]}/>
              <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                {healthData.map((d, i) => <Cell key={i} fill={d.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
/* Empty state */
