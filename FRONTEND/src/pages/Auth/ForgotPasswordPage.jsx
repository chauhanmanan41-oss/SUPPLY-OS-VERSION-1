/**
 * ForgotPasswordPage
 * ────────────────────
 * Placeholder for password reset flow.
 * Backend doesn't have a reset endpoint yet — this page collects
 * the email and shows a success message (UI-only for now).
 */

import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { AuthLayout } from "../../layouts/AuthLayout";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    // TODO: Call password reset API when backend implements it
    // await api.post("/auth/forgot-password/", { email });
    await new Promise((r) => setTimeout(r, 1200));

    setIsLoading(false);
    setIsSent(true);
    toast.success("Reset instructions sent!");
  }

  if (isSent) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center gap-5 py-8">
          <div
            className="size-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(22,163,74,0.08)" }}
          >
            <Send size={28} className="text-[#16a34a]" />
          </div>
          <h2 className="text-[#1b1c1c] font-bold text-xl" style={{ fontFamily: fontManrope }}>
            Check your inbox
          </h2>
          <p className="text-[#4d4634] text-sm max-w-xs" style={{ fontFamily: fontInter }}>
            We've sent password reset instructions to <strong>{email}</strong>.
            The link will expire in 30 minutes.
          </p>
          <Link
            to="/login"
            className="text-sm font-bold text-[#303031] hover:underline flex items-center gap-1.5 mt-2"
            style={{ fontFamily: fontInter }}
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <Link
          to="/login"
          className="text-sm text-[#4d4634] hover:text-[#1b1c1c] flex items-center gap-1 w-fit"
          style={{ fontFamily: fontInter }}
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>

        <div>
          <h2 className="text-[#1b1c1c] font-bold text-2xl" style={{ fontFamily: fontManrope }}>
            Reset your password
          </h2>
          <p className="text-[#4d4634] text-sm mt-1" style={{ fontFamily: fontInter }}>
            Enter the email associated with your account and we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="forgot-email"
              className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]"
              style={{ fontFamily: fontInter }}
            >
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full h-12 pl-10 pr-4 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] outline-none transition-all duration-150 ${
                  error
                    ? "border-[1.5px] border-red-500 bg-red-50/40"
                    : "border border-[rgba(0,0,0,0.08)] bg-[#f3f3f5] focus:border-[#303031] focus:bg-white focus:shadow-[0_0_0_3px_rgba(48,48,49,0.08)]"
                }`}
                style={{ fontFamily: fontInter }}
              />
            </div>
            {error && <p role="alert" className="text-xs text-red-600" style={{ fontFamily: fontInter }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send reset link"
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
                <Send size={16} />
                Send Reset Link
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
