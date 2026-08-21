/**
 * AppRoutes — React Router-based routing with auth protection.
 *
 * Public routes:  /login, /register, /forgot-password
 * Protected:      / (dashboard), /projects, /marketplace, /procurement,
 *                 /orders, /inventory, /settings
 *
 * The ProtectedRoute wrapper redirects to /login if not authenticated.
 * All existing page logic is preserved — only the navigation mechanism changed
 * from useState("Dashboard") → URL paths.
 */

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router";
import { useState, useCallback } from "react";
import { toast } from "sonner";

import { useAuth } from "../hooks/useAuth";
import { useModal } from "../hooks/useModal";
import { useWorkspace } from "../hooks/useWorkspace";
import { useSearch } from "../hooks/useSearch";
import { useWorkflowLock } from "../context/WorkflowLockContext";

import { MainLayout } from "../layouts/MainLayout";

import { Dashboard } from "../pages/Dashboard/Dashboard";
import { ProjectsPage } from "../pages/Projects/Projects";
import { MarketplacePage } from "../pages/Marketplace/Marketplace";
import { ProcurementPage } from "../pages/Procurement/Procurement";
import { OrdersPage } from "../pages/Orders/Orders";
import { InventoryPage } from "../pages/Inventory/Inventory";
import { OnboardingPage } from "../pages/Onboarding/OnboardingPage";
import { ProductWorkspacePage } from "../pages/ProductWorkspace/ProductWorkspace";
import { ProductWizard } from "../pages/Projects/ProductWizard";
import { SettingsPage } from "../pages/Settings/SettingsPage";
import { ProductionPage } from "../pages/Production/Production";
import { QualityPage } from "../pages/Quality/Quality";
import { LogisticsPage } from "../pages/Logistics/Logistics";
import { ComingSoonPage } from "../pages/ComingSoon/ComingSoonPage";

import { LoginPage } from "../pages/Auth/LoginPage";
import { RegisterPage } from "../pages/Auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/Auth/ForgotPasswordPage";

import { CreateProductModal } from "../components/modals/CreateProductModal";
import { AskAIModal } from "../components/modals/AskAIModal";
import { FindManufacturerModal } from "../components/modals/FindManufacturerModal";
import { CreateRFQModal } from "../components/modals/CreateRFQModal";

// New Master Data pages
import { SuppliersPage } from "../pages/MasterData/Suppliers";
import { ManufacturersPage } from "../pages/MasterData/Manufacturers";
import { MaterialsPage } from "../pages/MasterData/Materials";
import { WarehousesPage } from "../pages/MasterData/Warehouses";


/* ── Auth-aware route wrappers ─────────────────────────────── */

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a minimal loading state while checking token
    return (
      <div className="flex items-center justify-center h-screen bg-[#fbf9f9]">
        <div className="size-8 border-[3px] border-[#303031]/20 border-t-[#303031] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force users without an organization to complete onboarding
  if (!user?.default_organization && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Prevent users WITH an organization from accessing onboarding
  if (user?.default_organization && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}

/* ── Main dashboard shell (shared layout + modals + wizard/workspace overlays) */

function DashboardShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchFilter, setSearchFilter } = useSearch("All");
  const { modal, openModal, closeModal } = useModal();
  const {
    showWizard, openWizard, closeWizard,
    showWorkspace, workspaceProductId, openWorkspace, closeWorkspace,
  } = useWorkspace();
  const { isLocked, requestNavigation } = useWorkflowLock();

  /* Map URL path → nav label for sidebar highlighting */
  const pathToNav = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/marketplace": "Marketplace",
    "/procurement": "Procurement",
    "/orders": "Orders",
    "/inventory": "Inventory",
    "/production": "Production",
    "/quality": "Quality",
    "/logistics": "Logistics",
    "/suppliers": "Suppliers",
    "/manufacturers": "Manufacturers",
    "/materials": "Materials",
    "/warehouses": "Warehouses",
    "/settings": "Settings",
  };

  const activeNav = location.pathname.startsWith("/workspace/") || location.pathname.startsWith("/projects")
    ? "Projects"
    : (pathToNav[location.pathname] || "Dashboard");

  const safeNavigate = useCallback((path) => {
    requestNavigation(() => navigate(path));
  }, [requestNavigation, navigate]);

  const handleAction = useCallback((action) => {
    if (action === "create-product")    openWizard();
    else if (action === "find-manufacturer") openModal("find-manufacturer");
    else if (action === "create-rfq")   openModal("create-rfq");
    else if (action === "ai-strategy")  toast("Generating AI strategy…", { description: "Analyzing market conditions and supplier data." });
    else if (action === "marketplace")  safeNavigate("/marketplace");
    else if (action === "analytics")    safeNavigate("/analytics");
  }, [openWizard, openModal, safeNavigate]);

  return (
    <MainLayout
      activeNav={activeNav}
      safeNavigate={safeNavigate}
      isLocked={isLocked}
      searchFilter={searchFilter}
      setSearchFilter={setSearchFilter}
      overlays={
        <>
          {modal === "create-product"    && <CreateProductModal onClose={closeModal} />}
          {modal === "ask-ai"            && <AskAIModal onClose={closeModal} />}
          {modal === "find-manufacturer" && <FindManufacturerModal onClose={closeModal} />}
          {modal === "create-rfq"        && <CreateRFQModal onClose={closeModal} />}
        </>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard onAction={handleAction} onOpenWorkspace={openWorkspace} />} />
        <Route path="/projects" element={<ProjectsPage onOpenWorkspace={openWorkspace} onCreateProduct={openWizard} />} />
        <Route path="/projects/create" element={<ProductWizard onClose={closeWizard} />} />
        <Route path="/workspace/:workspaceId" element={<ProductWorkspacePage onClose={closeWorkspace} />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/procurement" element={<ProcurementPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/quality" element={<QualityPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        
        {/* Master Data */}
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/manufacturers" element={<ManufacturersPage />} />
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </MainLayout>
  );

}

/* ── Top-level routes ──────────────────────────────────────── */

export function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

      {/* Protected onboarding route (no sidebar) */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* Protected dashboard routes */}
      <Route path="/*" element={<ProtectedRoute><DashboardShell /></ProtectedRoute>} />
    </Routes>
  );
}
