"use client";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className = "", id, children, ...props }, ref) => {
        const inputId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

        return (
            <div className="flex flex-col gap-1.5">
                {label && <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text)]">{label}</label>}
                <select
                    ref={ref}
                    id={inputId}
                    className={`w-full px-4 py-3 text-sm rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-[var(--text)] outline-none transition focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(79,111,216,0.18)] ${error ? "border-[var(--danger)]" : ""} ${className}`}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="text-xs font-medium text-[var(--danger)]">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
