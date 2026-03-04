"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl select-none cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

const variants: Record<Variant, string> = {
    primary: "bg-[var(--primary)] text-white shadow-[0_8px_24px_rgba(79,111,216,0.35)] hover:brightness-110",
    secondary: "bg-white text-[var(--text)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-soft)]",
    danger: "bg-[var(--danger)] text-white shadow-[0_8px_20px_rgba(209,67,89,0.3)] hover:brightness-105",
    ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]",
    outline: "bg-transparent border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-soft)]",
};

const sizes: Record<Size, string> = {
    xs: "h-7 px-3 text-xs",
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", loading, fullWidth, icon, children, className = "", disabled, ...props }, ref) => (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="12" cy="12" r="10" strokeOpacity={.2} />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
            ) : icon ? (
                <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
            ) : null}
            {children}
        </button>
    )
);
Button.displayName = "Button";
