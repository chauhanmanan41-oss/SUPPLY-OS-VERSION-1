/**
 * SettingsPage
 * ─────────────
 * Profile & account settings.
 * Reads user from AuthContext, updates via PATCH /auth/me/ and POST /auth/change-password/.
 */

import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Lock, LogOut, Building, Eye, EyeOff, Save, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile form
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName]   = useState(user?.last_name || "");
  const [phone, setPhone]         = useState(user?.phone || "");

  // Password form
  const [oldPassword, setOldPassword]     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err?.data?.old_password || err.message || "Failed to change password";
      toast.error(typeof msg === "string" ? msg : msg[0]);
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    toast.info("Signed out");
  }

  const tabs = [
    { id: "profile",  label: "Profile",  icon: User },
    { id: "password", label: "Security", icon: Lock },
    { id: "org",      label: "Organization", icon: Building },
  ];

  const inputCls = "w-full h-12 px-4 rounded-xl text-sm text-[#1b1c1c] placeholder:text-[#9a9689] border border-[rgba(0,0,0,0.08)] bg-[#f3f3f5] focus:border-[#303031] focus:bg-white focus:shadow-[0_0_0_3px_rgba(48,48,49,0.08)] outline-none transition-all duration-150";

  return (
    <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="px-8 py-8 flex flex-col gap-8 max-w-[800px]">
        {/* Header */}
        <div>
          <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: fontManrope }}>Settings</h1>
          <p className="text-[14px] text-[#4d4634] mt-1" style={{ fontFamily: fontInter }}>
            Manage your account, security, and organization preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#f3f3f5] rounded-xl p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                  active
                    ? "bg-white text-[#1b1c1c] shadow-sm"
                    : "text-[#9a9689] hover:text-[#4d4634]"
                }`}
                style={{ fontFamily: fontInter }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5">
            <h3 className="text-[16px] font-bold text-[#1b1c1c]" style={{ fontFamily: fontManrope }}>
              Personal Information
            </h3>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-[#ffd54a] flex items-center justify-center shrink-0">
                <span className="text-[#735c00] font-bold text-lg" style={{ fontFamily: fontManrope }}>
                  {(firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1b1c1c]" style={{ fontFamily: fontManrope }}>
                  {firstName} {lastName}
                </p>
                <p className="text-xs text-[#9a9689]" style={{ fontFamily: fontInter }}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="settings-first" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                  First name
                </label>
                <input id="settings-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls} style={{ fontFamily: fontInter }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="settings-last" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                  Last name
                </label>
                <input id="settings-last" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls} style={{ fontFamily: fontInter }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-email" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
                <input
                  id="settings-email"
                  value={user?.email || ""}
                  disabled
                  className={`${inputCls} pl-10 opacity-60 cursor-not-allowed`}
                  style={{ fontFamily: fontInter }}
                />
              </div>
              <p className="text-[11px] text-[#9a9689]" style={{ fontFamily: fontInter }}>
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-phone" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                Phone
              </label>
              <input id="settings-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputCls} style={{ fontFamily: fontInter }} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-[13px] font-bold transition hover:brightness-110 disabled:opacity-70"
                style={{ background: "#303031", fontFamily: fontManrope }}
              >
                {profileLoading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Security tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5">
            <h3 className="text-[16px] font-bold text-[#1b1c1c]" style={{ fontFamily: fontManrope }}>
              Change Password
            </h3>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-old-pw" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                Current password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
                <input
                  id="settings-old-pw"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`${inputCls} pl-10 pr-11`}
                  style={{ fontFamily: fontInter }}
                />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] hover:text-[#303031]" aria-label="Toggle visibility">
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-new-pw" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                New password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] pointer-events-none" />
                <input
                  id="settings-new-pw"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${inputCls} pl-10 pr-11`}
                  style={{ fontFamily: fontInter }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a9689] hover:text-[#303031]" aria-label="Toggle visibility">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-confirm-pw" className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#4d4634]" style={{ fontFamily: fontInter }}>
                Confirm new password
              </label>
              <input
                id="settings-confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputCls}
                style={{ fontFamily: fontInter }}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-[13px] font-bold transition hover:brightness-110 disabled:opacity-70"
                style={{ background: "#303031", fontFamily: fontManrope }}
              >
                {passwordLoading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={14} />}
                Update Password
              </button>
            </div>
          </form>
        )}

        {/* Organization tab */}
        {activeTab === "org" && (
          <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5">
            <h3 className="text-[16px] font-bold text-[#1b1c1c]" style={{ fontFamily: fontManrope }}>
              Organization
            </h3>
            <p className="text-sm text-[#4d4634]" style={{ fontFamily: fontInter }}>
              Organization management will be available here once you create or join an organization.
            </p>
            {/* TODO: List org members, invite, switch org */}
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-[rgba(186,26,26,0.15)] p-6 flex flex-col gap-4">
          <h3 className="text-[16px] font-bold text-[#ba1a1a]" style={{ fontFamily: fontManrope }}>
            Danger Zone
          </h3>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(186,26,26,0.2)] text-[#ba1a1a] text-[13px] font-bold hover:bg-red-50 transition w-fit"
            style={{ fontFamily: fontManrope }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        <div className="h-8" />
      </div>
    </main>
  );
}
