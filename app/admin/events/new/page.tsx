"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toaster";
import Link from "next/link";

export default function NewEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [form, setForm] = useState({ title: "", description: "", location: "", imageUrl: "", startsAt: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    function handle(k: string, v: string) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setSaving(true);
        try {
            const res = await fetch("/api/admin/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : "",
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.issues) setErrors(Object.fromEntries(Object.entries(data.issues).map(([k, v]) => [k, (v as string[])[0]])));
                else toast(data.error || "Failed to create event", "error");
                return;
            }
            toast("Event created!", "success");
            router.push(`/admin/events/${data.id}`);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-4 max-w-2xl">
            <Link href="/admin/events" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] inline-flex">
                Back to Events
            </Link>
            <h1 className="text-2xl font-extrabold">Create Event</h1>

            <Card className="p-5 sm:p-6">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input label="Title *" value={form.title} onChange={(e) => handle("title", e.target.value)} error={errors.title} placeholder="Reunion 2026" />
                    <Textarea label="Description" value={form.description} onChange={(e) => handle("description", e.target.value)} placeholder="Tell everyone what this is about…" />
                    <Input label="Location" value={form.location} onChange={(e) => handle("location", e.target.value)} placeholder="Dhaka" />
                    <Input label="Image Link" value={form.imageUrl} onChange={(e) => handle("imageUrl", e.target.value)} error={errors.imageUrl} placeholder="https://example.com/event-banner.jpg" hint="Optional. Add a full image URL to show this event banner." />
                    <Input
                        label="Date & Time *"
                        type="datetime-local"
                        value={form.startsAt}
                        onChange={(e) => handle("startsAt", e.target.value)}
                        error={errors.startsAt}
                    />
                    <div className="flex gap-2 pt-2">
                        <Link href="/admin/events" className="flex-1">
                            <Button variant="secondary" fullWidth>Cancel</Button>
                        </Link>
                        <Button type="submit" loading={saving} className="flex-1">Create Event</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
