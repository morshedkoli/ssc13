"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

interface Event {
    id: string;
    title: string;
    description?: string;
    location?: string;
    imageUrl?: string;
    startsAt: string;
    _count: { participants: number };
}

function displayImageUrl(value?: string) {
    if (!value) return null;
    return value.startsWith("http") ? value : `https://${value}`;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/events");
            setEvents(await res.json());
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return events;
        return events.filter((ev) => `${ev.title} ${ev.location || ""}`.toLowerCase().includes(query));
    }, [events, q]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                <Input placeholder="Search events" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-md" />
                <Link href="/admin/events/new"><Button>Create Event</Button></Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="surface-card p-4 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="No events found" description="Create an event to get started." action={<Link href="/admin/events/new"><Button size="sm">Create Event</Button></Link>} />
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {filtered.map((ev) => (
                        <div key={ev.id} className="surface-card p-4 space-y-3">
                            {displayImageUrl(ev.imageUrl) ? (
                                <img
                                    src={displayImageUrl(ev.imageUrl) || ""}
                                    alt={ev.title}
                                    className="w-full h-36 sm:h-40 rounded-xl object-cover border border-[var(--border)]"
                                />
                            ) : null}
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text)]">{ev.title}</h2>
                                <p className="text-sm text-[var(--text-muted)]">{new Date(ev.startsAt).toLocaleString("en-BD")}</p>
                                {ev.location ? <p className="text-sm text-[var(--text-muted)]">{ev.location}</p> : null}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="badge badge-info">Participants: {ev._count.participants}</span>
                                <div className="flex gap-2">
                                    <Link href={`/admin/events/${ev.id}`}><Button size="sm" variant="secondary">Manage</Button></Link>
                                    <Button size="sm" variant="danger" disabled title="Event deletion is disabled">Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
