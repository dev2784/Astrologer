"use client";

// 1. Inline Spinner (Best for buttons)
export function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// 2. Full-Screen Overlay Loader (Best for page transitions / heavy updates)
export function FullScreenLoader({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-gray-100">
        <Spinner className="w-6 h-6 text-orange-600" />
        <span className="text-sm font-semibold text-slate-800">{message}</span>
      </div>
    </div>
  );
}