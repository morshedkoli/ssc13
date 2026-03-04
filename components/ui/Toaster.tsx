"use client";
import { createContext, useContext, useCallback, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}

const colors: Record<ToastType, string> = {
    success: "bg-[#0f9f6e] text-white",
    error: "bg-[var(--danger)] text-white",
    info: "bg-[#2f578d] text-white",
};

const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
};

export function Toaster({ children }: { children?: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {/* Toast container — portal-like, positioned fixed */}
            <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[min(92vw,22rem)] pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-[var(--shadow-md)] pointer-events-auto animate-fade-in
              ${colors[t.type]}
            `}
                    >
                        <span className="text-base font-bold">{icons[t.type]}</span>
                        <p className="text-sm font-medium flex-1">{t.message}</p>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
