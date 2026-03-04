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

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await signIn("credentials", { email, password, redirect: false });
            if (res?.error) {
                setError("Invalid email or password");
                return;
            }
            router.push("/admin");
            router.refresh();
        } finally {
            setLoading(false);
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
            </div>
        </div>
    );
}
