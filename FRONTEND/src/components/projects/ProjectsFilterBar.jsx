import { Search, LayoutGrid, List } from "lucide-react";
import { I } from "../../constants/fonts";

export function ProjectsFilterBar({ search, setSearch, stageFilter, setStageFilter, priorityFilter, setPriorityFilter, sortBy, setSortBy, viewMode, setViewMode, }) {
    const stages = ["All", "Planning", "Supplier Selection", "Manufacturing", "Packaging", "Logistics", "Completed", "Delayed"];
    const prios = ["All", "High", "Medium", "Low"];
    const sorts = ["Recently Updated", "Launch Date", "Health Score", "Budget", "AI Recommendation"];
    const Sel = ({ val, opts, onChange }) => (<select value={val} onChange={e => onChange(e.target.value)} className="h-9 px-3 pr-8 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[#1b1c1c] text-[13px] font-semibold appearance-none cursor-pointer hover:border-[rgba(208,198,174,0.6)] focus:outline-none focus:ring-2 focus:ring-[#ffd54a]" style={{ fontFamily: I }}>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>);
    return (<div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-[280px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4d4634]/60"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="w-full h-9 pl-9 pr-3 rounded-xl border border-[rgba(208,198,174,0.3)] bg-white text-[13px] text-[#1b1c1c] placeholder:text-[rgba(77,70,52,0.4)] focus:outline-none focus:ring-2 focus:ring-[#ffd54a]" style={{ fontFamily: I }}/>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Sel val={stageFilter} opts={stages} onChange={setStageFilter}/>
        <Sel val={priorityFilter} opts={prios} onChange={setPriorityFilter}/>
        <Sel val={sortBy} opts={sorts} onChange={setSortBy}/>
      </div>

      {/* Grid / List toggle */}
      <div className="flex items-center h-9 border border-[rgba(208,198,174,0.3)] rounded-xl overflow-hidden bg-white ml-auto">
        {["grid", "list"].map(v => {
            const Icon = v === "grid" ? LayoutGrid : List;
            return (<button key={v} onClick={() => setViewMode(v)} className="w-9 h-full flex items-center justify-center transition" style={{ background: viewMode === v ? "#1b1c1c" : "transparent" }}>
              <Icon size={15} color={viewMode === v ? "white" : "#4d4634"}/>
            </button>);
        })}
      </div>
    </div>);
}
/* Individual project card (grid view) */
