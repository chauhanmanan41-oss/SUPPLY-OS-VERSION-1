/**
 * RegisterPage
 * ─────────────
 * New user registration.
 * Calls POST /api/v1/auth/register/ then auto-logs in.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useAuth } from "../../hooks/useAuth";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]           = useState({});
  const [isLoading, setIsLoading]     = useState(false);

  function getStrength(pw) {
    if (!pw) return { label: "", width: "0%", color: "transparent" };
    if (pw.length < 4)  return { label: "Weak", width: "25%", color: "#ba1a1a" };
    if (pw.length < 8)  return { label: "Fair", width: "50%", color: "#eab308" };
    if (pw.length >= 8 && /[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw))
      return { label: "Strong", width: "100%", color: "#16a34a" };
    return { label: "Good", width: "75%", color: "#3b82f6" };
  }

  const strength = getStrength(password);

  function validate() {
    const errs = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim())  errs.lastName = "Last name is required";
    if (!email.trim())     errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password)         errs.password = "Password is required";
    else if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    try {
      await register({ email, password, firstName, lastName });
      toast.success("Account created!");
      navigate("/", { replace: true });
    } catch (err) {
      const data = err?.data;
      if (data?.email) setErrors(prev => ({ ...prev, email: data.email[0] || data.email }));
      else if (data?.password) setErrors(prev => ({ ...prev, password: data.password[0] || data.password }));
      else toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  function clearError(field) {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  const inputBase = "w-full h-12 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] outline-none transition-all duration-150";
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
            Create your account
          </h2>
          <p className="text-[#4d4634] text-sm mt-1" style={{ fontFamily: fontInter }}>
            Start managing your supply chain with AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-first" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                First name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
                <input
                  id="reg-first"
                  type="text"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                  placeholder="Manan"
                  autoComplete="given-name"
                  className={`${inputBase} pl-10 pr-4 ${errors.firstName ? inputErr : inputOk}`}
                  style={{ fontFamily: fontInter }}
                />
              </div>
              {errors.firstName && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{errors.firstName}</p>}
            </div>
            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-last" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                Last name
              </label>
              <input
                id="reg-last"
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                placeholder="Chauhan"
                autoComplete="family-name"
                className={`${inputBase} px-4 ${errors.lastName ? inputErr : inputOk}`}
                style={{ fontFamily: fontInter }}
              />
              {errors.lastName && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-email" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="you@company.com"
                autoComplete="email"
                className={`${inputBase} pl-10 pr-4 ${errors.email ? inputErr : inputOk}`}
                style={{ fontFamily: fontInter }}
              />
            </div>
            {errors.email && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className={`${inputBase} pl-10 pr-11 ${errors.password ? inputErr : inputOk}`}
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
            {errors.password && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{errors.password}</p>}

            {/* Strength bar */}
            {password && (
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: strength.color, fontFamily: fontInter }}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Create account"
            className="w-full h-12 rounded-xl text-white font-bold text-sm uppercase tracking-[0.04em] flex items-center justify-center gap-2 transition-all duration-150 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-1"
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
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
          <span className="text-xs text-[#9a9689] whitespace-nowrap" style={{ fontFamily: fontInter }}>or</span>
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)]" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-[#4d4634]" style={{ fontFamily: fontInter }}>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#303031] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
