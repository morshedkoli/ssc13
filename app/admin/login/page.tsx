"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [quickLoading, setQuickLoading] = useState(false);

    async function doLogin(email: string, password: string) {
        setError("");
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) {
            setError("Invalid email or password");
            return false;
        }
        router.push("/admin");
        router.refresh();
        return true;
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await doLogin(email, password);
        } finally {
            setLoading(false);
        }
    }

    async function quickLogin() {
        setQuickLoading(true);
        try {
            await doLogin("admin@ssc.com", "admin123");
        } finally {
            setQuickLoading(false);
        }
    }

    return (
        <div className="min-h-screen page-container flex items-center justify-center py-8">
            <div className="w-full max-w-md surface-card p-6 sm:p-7">
                <div className="inline-flex items-center gap-2.5 mb-3">
                    <Image src="/ssc-logo.svg" alt="SSC Batch 2013 logo" width={34} height={34} className="rounded-lg" priority />
                    <span className="text-sm font-semibold text-[var(--text-muted)]">SSC Batch 2013</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[var(--text)]">Admin Login</h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to manage members and events.</p>
                <form onSubmit={submit} className="mt-5 space-y-4">
                    <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                    <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                    {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
                    <Button type="submit" loading={loading} fullWidth>Sign In</Button>
                </form>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-xs text-[var(--text-muted)]">or</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                <button
                    onClick={quickLogin}
                    disabled={quickLoading}
                    className="mt-4 w-full py-2.5 px-4 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                >
                    {quickLoading ? "Signing in…" : "Quick Admin Login"}
                </button>
            </div>
        </div>
    );
}
