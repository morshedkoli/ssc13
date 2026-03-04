import { BottomNav } from "@/components/ui/BottomNav";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <header className="hidden md:block sticky top-0 z-30 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
                <div className="page-container h-16 flex items-center justify-between">
                    <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-lg text-[var(--text)]">
                        <Image src="/ssc-logo.svg" alt="SSC Batch 2013 logo" width={32} height={32} className="rounded-lg" priority />
                        <span>SSC Batch 2013</span>
                    </Link>
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/directory" className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]">Directory</Link>
                        <Link href="/events" className="px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]">Events</Link>
                        <Link href="/register" className="px-3 py-2 rounded-lg bg-[var(--primary)] text-white">Register</Link>
                    </nav>
                </div>
            </header>
            <main className="min-h-screen pb-24 md:pb-10">
                {children}
            </main>
            <BottomNav />
        </>
    );
}
