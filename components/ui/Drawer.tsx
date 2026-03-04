"use client";
import { ReactNode, useEffect } from "react";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    side?: "left" | "right";
    children: ReactNode;
}

export function Drawer({ open, onClose, title, side = "left", children }: DrawerProps) {
    useEffect(() => {
        if (!open) return;
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onEsc);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onEsc);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <aside
                className={`absolute top-0 h-full w-80 max-w-[85vw] bg-white border-r border-[var(--border)] shadow-[var(--shadow-lg)] p-4 animate-slide-up ${
                    side === "right" ? "right-0 border-r-0 border-l" : "left-0"
                }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-[var(--text)]">{title || "Menu"}</h2>
                    <button onClick={onClose} className="w-9 h-9 rounded-lg bg-[var(--surface-soft)] hover:bg-[var(--border)]">
                        <span className="sr-only">Close drawer</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="mx-auto">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </aside>
        </div>
    );
}
