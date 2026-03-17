"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toaster";
import { Alert } from "@/components/ui/Alert";

export default function RegisterPage() {
    const { toast } = useToast();
    const [form, setForm] = useState({ name: "", phone: "", address: "", facebook: "", occupation: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.issues) {
                    setErrors(Object.fromEntries(Object.entries(data.issues).map(([k, v]) => [k, (v as string[])[0]])));
                } else {
                    toast(data.error || "Registration failed", "error");
                }
                return;
            }
            setDone(true);
        } catch {
            toast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="page-container py-10">
                <div className="form-container surface-card p-7 sm:p-10 text-center animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-[#d7f4e8] text-[var(--success)] flex items-center justify-center text-2xl mx-auto">OK</div>
                    <h1 className="text-2xl font-extrabold mt-4 text-[var(--text)]">Registration submitted</h1>
                    <p className="text-[var(--text-muted)] mt-2">Thanks. Your request is now pending admin approval before it appears in the public directory.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container py-8 md:py-10">
            <div className="form-container">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-[var(--text)]">Register yourself</h1>
                    <p className="text-[var(--text-muted)] mt-1">Share your details to join the SSC Batch 2013 directory.</p>
                </div>

                <form onSubmit={submit} className="surface-card p-5 sm:p-6 space-y-4">
                    <Alert variant="info">All fields are reviewed by admins. Your profile becomes visible after approval.</Alert>
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        error={errors.name}
                        required
                    />
                    <Input
                        label="Phone Number"
                        placeholder="01XXXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        error={errors.phone}
                        hint="Use an active number, it must be unique in the system."
                        type="tel"
                        required
                    />
                    <Input
                        label="Address"
                        placeholder="City, district"
                        value={form.address}
                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                        error={errors.address}
                    />
                    <Input
                        label="Facebook Profile"
                        placeholder="URL or username"
                        value={form.facebook}
                        onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))}
                        error={errors.facebook}
                    />
                    <Select
                        label="Occupation"
                        value={form.occupation}
                        onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                        error={errors.occupation}
                    >
                        <option value="">Select Occupation</option>
                        <option value="Job">Job</option>
                        <option value="Foreign Job">Foreign Job</option>
                        <option value="Business">Business</option>
                    </Select>

                    <div className="pt-2">
                        <Button type="submit" loading={loading} fullWidth size="lg">
                            Submit Registration
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
