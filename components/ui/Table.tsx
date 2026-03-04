import { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
    return <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">{children}</div>;
}

export function TableHead({ children }: { children: ReactNode }) {
    return <thead className="bg-[var(--surface-soft)] text-[var(--text-muted)] text-xs uppercase tracking-wide">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-[var(--border)]">{children}</tbody>;
}

export function TH({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <th className={`text-left px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

export function TD({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <td className={`px-4 py-3 text-sm text-[var(--text)] ${className}`}>{children}</td>;
}
