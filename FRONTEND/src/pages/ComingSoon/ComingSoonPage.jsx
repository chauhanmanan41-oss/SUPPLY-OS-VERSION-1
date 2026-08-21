import { I, M } from "../../constants/fonts";

export function ComingSoonPage({ title }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-[#fbf9f9]">
      <div className="size-20 rounded-2xl bg-white border border-[rgba(208,198,174,0.3)] shadow-sm flex items-center justify-center mb-6">
        <span className="text-3xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold text-[#1b1c1c] mb-2" style={{ fontFamily: M }}>
        {title} — Coming Soon
      </h1>
      <p className="text-[14px] text-[#4d4634] max-w-md mx-auto" style={{ fontFamily: I }}>
        This module is currently under development. The backend APIs have been built and wired, and the frontend interface will be released in a future update.
      </p>
    </div>
  );
}
