"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    useEffect(() => {
        fetch("/api/events")
            .then((r) => r.json())
            .then(setEvents)
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return events;
        return events.filter((ev) => `${ev.title} ${ev.location || ""} ${ev.description || ""}`.toLowerCase().includes(query));
    }, [events, q]);

    return (
        <div className="page-container py-8 md:py-10 space-y-5">
            <div>
                <h1 className="text-3xl font-extrabold text-[var(--text)]">Events</h1>
                <p className="text-[var(--text-muted)] mt-1">Find reunions and meetups with batchmates.</p>
            </div>

            <Input placeholder="Search events by title or location" value={q} onChange={(e) => setQ(e.target.value)} />

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="surface-card p-4 space-y-3">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState title="No events found" description={q ? `No results for "${q}".` : "Events will appear here once created by admins."} />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((ev) => {
                        const date = new Date(ev.startsAt);
                        return (
                            <Link key={ev.id} href={`/events/${ev.id}`} className="surface-card p-4 hover:-translate-y-0.5 transition">
                                <div className="space-y-2">
                                    {displayImageUrl(ev.imageUrl) ? (
                                        <img
                                            src={displayImageUrl(ev.imageUrl) || ""}
                                            alt={ev.title}
                                            className="w-full h-40 rounded-xl object-cover border border-[var(--border)] mb-2"
                                        />
                                    ) : null}
                                    <div className="inline-flex badge badge-info">{date.toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}</div>
                                    <h2 className="font-bold text-[var(--text)] text-lg leading-tight">{ev.title}</h2>
                                    {ev.location ? <p className="text-sm text-[var(--text-muted)]">{ev.location}</p> : null}
                                    {ev.description ? <p className="text-sm text-[var(--text-muted)] line-clamp-2">{ev.description}</p> : null}
                                    <p className="text-xs text-[var(--text-muted)]">Participants: {ev._count.participants}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
