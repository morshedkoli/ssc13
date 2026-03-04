import { ReactNode } from "react";

type BadgeVariant = "approved" | "pending" | "rejected" | "info";

export function Badge({ children, variant = "info", className = "" }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
    return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}
