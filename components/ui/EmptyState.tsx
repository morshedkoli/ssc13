import { ReactNode } from "react";

export function EmptyState({
    title,
    description,
    icon,
    action,
}: {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="surface-card text-center p-8 sm:p-12 animate-scale-in">
            {icon ? <div className="text-4xl mb-3">{icon}</div> : null}
            <h3 className="text-base font-bold text-[var(--text)]">{title}</h3>
            {description ? <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p> : null}
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}
