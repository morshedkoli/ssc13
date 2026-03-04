"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import SignOutButton from "@/components/admin/SignOutButton";
import { Drawer } from "@/components/ui/Drawer";

const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/approvals", label: "Approvals" },
    { href: "/admin/members", label: "Members" },
    { href: "/admin/events", label: "Events" },
];

function isActive(pathname: string, href: string) {
    return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export default function AdminShell({ children, userLabel }: { children: ReactNode; userLabel: string }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const title = useMemo(() => {
        if (pathname.startsWith("/admin/approvals")) return "Approvals";
        if (pathname.startsWith("/admin/members")) return "Members";
        if (pathname.startsWith("/admin/events")) return "Events";
        return "Dashboard";
    }, [pathname]);

    return (
        <div className="min-h-screen bg-transparent">
            <div className="flex min-h-screen">
                <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r border-[var(--border)] bg-white/80 backdrop-blur-xl">
                    <div className="w-full p-4 lg:p-6 flex flex-col">
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-2 mb-2">
                                <Image src="/ssc-logo.svg" alt="SSC Batch 2013 logo" width={28} height={28} className="rounded-md" />
                                <p className="text-xs text-[var(--text-muted)]">Admin Panel</p>
                            </div>
                            <h1 className="text-xl font-extrabold text-[var(--text)]">SSC Batch 2013</h1>
                        </div>
                        <nav className="space-y-1.5">
                            {navLinks.map((link) => {
                                const active = isActive(pathname, link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                                            active
                                                ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                                                : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                        }`}
                                    >
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="mt-auto pt-4 border-t border-[var(--border)]">
                            <p className="text-xs text-[var(--text-muted)] mb-2 truncate">{userLabel}</p>
                            <SignOutButton />
                        </div>
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <header className="sticky top-0 z-20 h-16 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
                        <div className="page-container h-full flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <button onClick={() => setOpen(true)} className="md:hidden w-10 h-10 rounded-xl border border-[var(--border)] bg-white">
                                    <span className="sr-only">Open menu</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mx-auto">
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </svg>
                                </button>
                                <div className="min-w-0">
                                    <p className="text-xs text-[var(--text-muted)] hidden sm:block">SSC Batch 2013 Admin</p>
                                    <h2 className="text-lg font-bold text-[var(--text)] truncate">{title}</h2>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">View Site</Link>
                            </div>
                        </div>
                    </header>

                    <main className="page-container py-6 md:py-8">{children}</main>
                </div>
            </div>

            <Drawer open={open} onClose={() => setOpen(false)} title="Admin Menu">
                <nav className="space-y-1.5">
                    {navLinks.map((link) => {
                        const active = isActive(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                                    active
                                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                                        : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                                }`}
                            >
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-2">
                    <Link href="/" onClick={() => setOpen(false)} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">View Site</Link>
                    <SignOutButton />
                </div>
            </Drawer>
        </div>
    );
}
