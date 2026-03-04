import { ReactNode } from "react";

type AlertVariant = "info" | "success" | "error";

const styles: Record<AlertVariant, string> = {
    info: "bg-[#edf3ff] border-[#c9d8ff] text-[#2847a8]",
    success: "bg-[#e8faf2] border-[#bfead6] text-[#0d7a53]",
    error: "bg-[var(--danger-soft)] border-[#ffcfd8] text-[var(--danger)]",
};

export function Alert({ children, variant = "info" }: { children: ReactNode; variant?: AlertVariant }) {
    return <div className={`rounded-xl border px-3 py-2 text-sm font-medium ${styles[variant]}`}>{children}</div>;
}
