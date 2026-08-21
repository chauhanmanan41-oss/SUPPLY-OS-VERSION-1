/**
 * LoginPage
 * ──────────
 * Email + password login with JWT authentication.
 * Calls the Django backend POST /api/v1/auth/login/
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../hooks/useAuth";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]           = useState({});
  const [isLoading, setIsLoading]     = useState(false);

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.data?.detail || err.message || "Login failed";
      if (msg.toLowerCase().includes("credential") || msg.toLowerCase().includes("password")) {
        setErrors({ password: "Invalid email or password" });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }

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
            Welcome back
          </h2>
          <p className="text-[#4d4634] text-sm mt-1" style={{ fontFamily: fontInter }}>
            Sign in to your SupplyOS account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]"
              style={{ fontFamily: fontInter }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full h-12 pl-10 pr-4 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] outline-none transition-all duration-150 ${
                  errors.email
                    ? "border-[1.5px] border-red-500 bg-red-50/40"
                    : "border border-[rgba(0,0,0,0.08)] bg-[#f3f3f5] focus:border-[#303031] focus:bg-white focus:shadow-[0_0_0_3px_rgba(48,48,49,0.08)]"
                }`}
                style={{ fontFamily: fontInter }}
              />
            </div>
            {errors.email && (
              <p role="alert" className="text-xs text-red-600 mt-0.5" style={{ fontFamily: fontInter }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]"
              style={{ fontFamily: fontInter }}
            >
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`w-full h-12 pl-10 pr-11 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] outline-none transition-all duration-150 ${
                  errors.password
                    ? "border-[1.5px] border-red-500 bg-red-50/40"
                    : "border border-[rgba(0,0,0,0.08)] bg-[#f3f3f5] focus:border-[#303031] focus:bg-white focus:shadow-[0_0_0_3px_rgba(48,48,49,0.08)]"
                }`}
                style={{ fontFamily: fontInter }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] hover:text-[#303031] transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p role="alert" className="text-xs text-red-600 mt-0.5" style={{ fontFamily: fontInter }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot link */}
          <div className="flex justify-end -mt-2">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#303031] hover:underline"
              style={{ fontFamily: fontInter }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Sign in"
            className="w-full h-12 rounded-xl text-white font-bold text-sm uppercase tracking-[0.04em] flex items-center justify-center gap-2 transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
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
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
          <span className="text-xs text-[#9a9689] whitespace-nowrap" style={{ fontFamily: fontInter }}>
            or
          </span>
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-[#4d4634]" style={{ fontFamily: fontInter }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#303031] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
