import { useState } from "react";
import { toast } from "sonner";
import { Plus, Filter, List, Sparkles } from "lucide-react";
import { AIPortfolioSidebar } from "../../components/projects/AIPortfolioSidebar";
import { PortfolioAnalytics } from "../../components/projects/PortfolioAnalytics";
import { ProductTimeline } from "../../components/projects/ProductTimeline";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { ProjectListRow } from "../../components/projects/ProjectListRow";
import { ProjectsEmptyState } from "../../components/projects/ProjectsEmptyState";
import { ProjectsFilterBar } from "../../components/projects/ProjectsFilterBar";
import { ProjectsKPIRow } from "../../components/projects/ProjectsKPIRow";
import { I, M } from "../../constants/fonts";
import { STAGE_COLORS } from "../../constants/projects";
import { useApi } from "../../hooks/useApi";

function mapBackendProduct(p) {
    const stageInfo = STAGE_COLORS[p.stage] || STAGE_COLORS["Planning"];
    return {
        id: p.id,
        emoji: p.emoji || "📦",
        name: p.name,
        category: "Product", // the backend does not return category currently
        stage: p.stage || "Planning",
        stageColor: stageInfo?.color || "#3b82f6",
        stageBg: stageInfo?.bg || "rgba(59,130,246,0.1)",
        progress: p.progress_pct || 0,
        health: p.health_score || 100,
        healthColor: p.health_score >= 80 ? "#16a34a" : p.health_score >= 60 ? "#eab308" : "#ba1a1a",
        budget: p.budget_total || 0,
        spent: (p.budget_total * (p.budget_used_pct / 100)) || 0,
        profit: 0,
        launch: p.estimated_launch || "TBD",
        risk: p.risk_level || "low",
        riskLabel: p.risk_level === "high" ? "High Risk" : p.risk_level === "medium" ? "Medium Risk" : "Low Risk",
        suppliers: 0,
        manufacturer: "Not Assigned",
        warehouse: "Not Assigned",
        transport: "Not Assigned",
        milestone: p.current_milestone || "Project Setup",
        aiInsight: "AI Insights will be generated as you progress.",
        priority: "medium",
        model: "N/A",
    };
}

export function ProjectsPage({ onOpenWorkspace, onCreateProduct }) {
    const { data, loading, error } = useApi("/products/");
    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Recently Updated");
    const [viewMode, setViewMode] = useState("grid");
    
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="size-8 border-[3px] border-[#303031]/20 border-t-[#303031] rounded-full animate-spin" />
            </div>
        );
    }
    
    const backendProjects = (data || []).map(mapBackendProduct);
    
    const filtered = backendProjects.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === "All" || p.stage === stageFilter;
        const matchPriority = priorityFilter === "All" || p.priority === priorityFilter.toLowerCase();
        return matchSearch && matchStage && matchPriority;
    });
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Health Score")
            return b.health - a.health;
        if (sortBy === "Budget")
            return b.budget - a.budget;
        if (sortBy === "Launch Date")
            return a.launch.localeCompare(b.launch);
        return 0;
    });
    return (<div className="flex h-full">
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="px-8 py-8 flex flex-col gap-8 max-w-[1100px]">
          {/* Page header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[#1b1c1c] font-bold text-2xl" style={{ fontFamily: M }}>Projects</h1>
              <p className="text-[#4d4634] text-[14px] mt-1" style={{ fontFamily: I }}>
                Manage and monitor every product workspace from one place.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => toast.info("Import project…")} className="px-4 py-2.5 border border-[rgba(208,198,174,0.3)] bg-white text-[#1b1c1c] font-semibold text-[13px] rounded-xl hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Import Project</button>
              <button onClick={() => toast("Generating AI strategy…")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] border transition hover:brightness-105" style={{ background: "#ffd54a", color: "#735c00", borderColor: "#e6bf00", fontFamily: M }}>
                <Sparkles size={14}/> AI Strategy
              </button>
              <button onClick={onCreateProduct} className="flex items-center gap-2 px-5 py-2.5 bg-[#303031] text-white rounded-xl font-bold text-[13px] hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
                <Plus size={14}/> Create Product
              </button>
            </div>
          </div>

          {/* KPI row */}
          <ProjectsKPIRow />

          {/* Filter bar */}
          <ProjectsFilterBar search={search} setSearch={setSearch} stageFilter={stageFilter} setStageFilter={setStageFilter} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} sortBy={sortBy} setSortBy={setSortBy} viewMode={viewMode} setViewMode={setViewMode}/>

          {/* Product cards */}
          {sorted.length === 0 ? (<ProjectsEmptyState onAction={onCreateProduct}/>) : viewMode === "grid" ? (<div className="grid grid-cols-3 gap-5">
              {sorted.map(p => <ProjectCard key={p.id} p={p} onOpenWorkspace={onOpenWorkspace}/>)}
            </div>) : (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* List header */}
              <div className="flex items-center gap-5 px-6 py-3 border-b border-[rgba(208,198,174,0.2)] bg-[rgba(251,249,249,0.8)]">
                {["Product", "", "Stage & Progress", "Health", "Budget", "Launch", "Risk", ""].map((h, i) => (<div key={i} className={`text-[10px] font-bold uppercase tracking-[0.55px] text-[#4d4634] ${i === 0 ? "flex-1" : i === 1 ? "w-40 shrink-0" : i === 2 ? "w-[130px] shrink-0" : i === 3 ? "w-14 text-center" : i === 4 ? "w-20 text-right" : i === 5 ? "w-24 text-right" : i === 6 ? "w-6" : ""}`} style={{ fontFamily: I }}>{h}</div>))}
              </div>
              {sorted.map(p => <ProjectListRow key={p.id} p={p} onOpenWorkspace={onOpenWorkspace}/>)}
            </div>)}

          {/* Timeline */}
          <ProductTimeline projects={sorted}/>

          {/* Analytics */}
          <PortfolioAnalytics projects={sorted}/>

          <div className="h-8"/>
        </div>
      </main>

      {/* Right sidebar */}
      <AIPortfolioSidebar projects={sorted} onOpenWorkspace={onOpenWorkspace}/>
    </div>);
}
