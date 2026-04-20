"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<((msg: string, type?: ToastType) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: "bg-[#1A0A00] border-[#E8A020] text-[#FFF8EE]",
    error: "bg-[#1A0A00] border-[#C84B11] text-[#FFF8EE]",
    info: "bg-[#1A0A00] border-blue-400 text-[#FFF8EE]",
  };
  const iconColors = { success: "text-[#E8A020]", error: "text-[#C84B11]", info: "text-blue-400" };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-xs w-full">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-fade-in-up ${colors[t.type]}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[t.type]}`} />
              <span className="text-sm flex-1">{t.message}</span>
              <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}>
                <X className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
