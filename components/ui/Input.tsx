"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
}

const inputBase = `
  w-full px-4 py-3 text-sm rounded-xl
  bg-[var(--surface-soft)] border border-[var(--border)]
  text-[var(--text)] placeholder-[var(--text-muted)]
  outline-none
  transition-all duration-200
  focus:bg-white focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(79,111,216,0.18)]
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, className = "", id, ...props }, ref) => {
        const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4 flex items-center justify-center">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`${inputBase} ${leftIcon ? "pl-10" : ""} ${error ? "border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(209,67,89,0.2)]" : ""} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs font-medium text-[var(--danger)] flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </p>
                )}
                {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = "", id, rows = 3, ...props }, ref) => {
        const inputId = id || (label ? `ta-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-semibold text-[var(--text)]">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    rows={rows}
                    className={`${inputBase} resize-none ${error ? "border-[var(--danger)]" : ""} ${className}`}
                    {...props}
                />
                {error && <p className="text-xs font-medium text-[var(--danger)]">{error}</p>}
                {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";
