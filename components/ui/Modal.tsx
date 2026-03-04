"use client";
import { useEffect, ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={title || "Dialog"}>
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative z-10 w-full sm:max-w-lg animate-slide-up sm:animate-scale-in">
                <div className="bg-white rounded-t-[24px] sm:rounded-2xl shadow-[var(--shadow-lg)] border border-[var(--border)]">
                    <div className="flex justify-center pt-3 pb-1 sm:hidden">
                        <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
                    </div>
                    {title && (
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
                            <h2 className="font-bold text-base text-[var(--text)]">{title}</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-[var(--surface-soft)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--border)] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="px-5 py-5 max-h-[82vh] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
