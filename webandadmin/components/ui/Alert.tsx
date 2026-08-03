"use client";

interface AlertProps {
  type?: "success" | "error";
  message: string | null;
  onClose?: () => void;
}

export default function Alert({ type = "success", message, onClose }: AlertProps) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center justify-between p-4 mb-4 rounded-lg border text-sm font-medium transition-all animate-fadeIn ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span>{isSuccess ? "✅" : "⚠️"}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-lg font-bold leading-none hover:opacity-75"
        >
          &times;
        </button>
      )}
    </div>
  );
}