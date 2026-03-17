"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

interface Participant {
    id: string;
    contribution?: number;
    remarks?: string;
    member: { id: string; name: string; phoneRaw: string; occupation?: string | null };
}

interface EventDetail {
    id: string;
    title: string;
    description?: string;
    location?: string;
    imageUrl?: string;
    startsAt: string;
    participants: Participant[];
}

function displayImageUrl(value?: string) {
    if (!value) return null;
    return value.startsWith("http") ? value : `https://${value}`;
}

export default function EventDetailPage() {
    const { id } = useParams();
    const [ev, setEv] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [occFilter, setOccFilter] = useState("");

    useEffect(() => {
        fetch(`/api/events/${id}`)
            .then((r) => r.json())
            .then(setEv)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page-container py-8 space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (!ev) {
        return (
            <div className="page-container py-10">
                <EmptyState title="Event not found" description="This event may have been removed." action={<Link href="/events" className="text-sm font-semibold text-[var(--primary)]">Back to events</Link>} />
            </div>
        );
    }

    const date = new Date(ev.startsAt);
    const totalContrib = ev.participants.reduce((sum, p) => sum + (p.contribution || 0), 0);
    const occupations = Array.from(new Set(ev.participants.map((p) => p.member.occupation).filter(Boolean) as string[])).sort();
    const filteredParticipants = occFilter
        ? ev.participants.filter((p) => p.member.occupation === occFilter)
        : ev.participants;
    const filteredTotal = filteredParticipants.reduce((sum, p) => sum + (p.contribution || 0), 0);
    const addToCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(ev.description || "")}&location=${encodeURIComponent(ev.location || "")}`;

    return (
        <div className="page-container py-8 md:py-10 space-y-5">
            <Link href="/events" className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">Back to events</Link>

            <section className="surface-card p-6 sm:p-7">
                {displayImageUrl(ev.imageUrl) ? (
                    <img
                        src={displayImageUrl(ev.imageUrl) || ""}
                        alt={ev.title}
                        className="w-full h-48 sm:h-56 rounded-2xl object-cover border border-[var(--border)] mb-4"
                    />
                ) : null}
                <p className="badge badge-info">{date.toLocaleDateString("en-BD", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                <h1 className="text-3xl font-extrabold text-[var(--text)] mt-3">{ev.title}</h1>
                {ev.location ? <p className="text-[var(--text-muted)] mt-2">Location: {ev.location}</p> : null}
                {ev.description ? <p className="text-[var(--text-muted)] mt-3">{ev.description}</p> : null}
                <a href={addToCalendar} target="_blank" rel="noreferrer" className="inline-flex mt-4 text-sm font-semibold text-[var(--primary)]">Add to calendar</a>
            </section>

            <section className="grid sm:grid-cols-2 gap-4">
                <div className="surface-card p-5">
                    <p className="text-sm text-[var(--text-muted)]">Participants</p>
                    <p className="text-3xl font-extrabold text-[var(--text)]">{filteredParticipants.length}{occFilter ? ` / ${ev.participants.length}` : ""}</p>
                </div>
                <div className="surface-card p-5">
                    <p className="text-sm text-[var(--text-muted)]">Total Contribution</p>
                    <p className="text-3xl font-extrabold text-[var(--text)]">BDT {filteredTotal.toLocaleString()}</p>
                </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-bold text-[var(--text)]">Participants</h2>
                    {occupations.length > 0 ? (
                        <select
                            value={occFilter}
                            onChange={(e) => setOccFilter(e.target.value)}
                            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm px-3 py-1.5 text-[var(--text)]"
                        >
                            <option value="">All Occupations</option>
                            {occupations.map((o) => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    ) : null}
                </div>
                {filteredParticipants.length === 0 ? (
                    <EmptyState title={occFilter ? "No participants with this occupation" : "No participants yet"} description={occFilter ? "Try a different filter." : "Participants will appear once members are added to this event."} />
                ) : (
                    <div className="space-y-3">
                        {filteredParticipants.map((p) => (
                            <div key={p.id} className="rounded-xl border border-[var(--border)] bg-white p-3 sm:p-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-[var(--text)]">{p.member.name}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{p.member.phoneRaw}{p.member.occupation ? ` · ${p.member.occupation}` : ""}</p>
                                    {p.remarks ? <p className="text-sm text-[var(--text-muted)] mt-1">{p.remarks}</p> : null}
                                </div>
                                <div className="badge badge-approved">BDT {(p.contribution || 0).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
