import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
    glass?: boolean;
}

const paddings = { none: "", sm: "p-3", md: "p-4 sm:p-5", lg: "p-5 sm:p-6" };

export function Card({ children, className = "", padding = "md", hover = false, glass = false }: CardProps) {
    return (
        <div
            className={`
        rounded-2xl border border-[var(--border)]
        ${glass
                    ? "glass"
                    : "bg-white shadow-[var(--shadow-sm)]"
                }
        ${hover ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] transition" : ""}
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`px-4 sm:px-5 pt-4 sm:pt-5 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`px-4 sm:px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`px-4 sm:px-5 pb-4 sm:pb-5 ${className}`}>{children}</div>;
}
