import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Building2, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import * as organizationService from "../../services/organizationService";
import { AuthLayout } from "../../layouts/AuthLayout";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function OnboardingPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await organizationService.createOrganization({ name, industry });
      toast.success("Organization created!");
      
      // Refresh the user profile to pick up the new default_organization
      await refreshUser();
      
      // Redirect to dashboard
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create organization");
      toast.error("Organization creation failed");
    } finally {
      setIsLoading(false);
    }
  }

  const inputBase = "w-full h-12 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] outline-none transition-all duration-150 px-4";
  const inputOk   = "border border-[rgba(0,0,0,0.08)] bg-[#f3f3f5] focus:border-[#303031] focus:bg-white focus:shadow-[0_0_0_3px_rgba(48,48,49,0.08)]";
  const inputErr  = "border-[1.5px] border-red-500 bg-red-50/40";

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: "#ffd54a" }}>
            <span className="text-[#735c00] font-extrabold text-sm" style={{ fontFamily: fontManrope }}>S</span>
          </div>
          <span className="text-[#1b1c1c] font-bold text-lg" style={{ fontFamily: fontManrope }}>SupplyOS</span>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-[#1b1c1c] font-bold text-2xl" style={{ fontFamily: fontManrope }}>
            Welcome, {user?.first_name || "there"}!
          </h2>
          <p className="text-[#4d4634] text-sm mt-1" style={{ fontFamily: fontInter }}>
            Let's set up your first organization to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-name" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
              Organization Name
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="org-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Acme Corp"
                className={`${inputBase} pl-10 ${error ? inputErr : inputOk}`}
                style={{ fontFamily: fontInter }}
              />
            </div>
            {error && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{error}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-industry" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
              Industry (Optional)
            </label>
            <input
              id="org-industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Manufacturing, Logistics..."
              className={`${inputBase} ${inputOk}`}
              style={{ fontFamily: fontInter }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-white font-bold text-sm uppercase tracking-[0.04em] flex items-center justify-center gap-2 transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            style={{
              background: "#303031",
              fontFamily: fontManrope,
              boxShadow: "0px 4px 16px rgba(48,48,49,0.20)",
            }}
          >
            {isLoading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Organization
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
