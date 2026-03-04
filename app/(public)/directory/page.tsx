"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

interface Member {
    id: string;
    name: string;
    phoneRaw: string;
    address?: string;
    facebook?: string;
}

export default function DirectoryPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMembers = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/members?q=${encodeURIComponent(query)}`);
            setMembers(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchMembers(q), 300);
        return () => clearTimeout(t);
    }, [q, fetchMembers]);

    return (
        <div className="page-container py-8 md:py-10 space-y-5">
            <div>
                <h1 className="text-3xl font-extrabold text-[var(--text)]">Member Directory</h1>
                <p className="text-[var(--text-muted)] mt-1">Browse approved SSC Batch 2013 members.</p>
            </div>

            <div className="sticky top-0 md:top-16 z-10 bg-[var(--bg)]/90 backdrop-blur py-2">
                <Input placeholder="Search by name, phone, or location" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="surface-card p-4 space-y-3">
                            <Skeleton className="w-10 h-10" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
                </div>
            ) : members.length === 0 ? (
                <EmptyState
                    title="No members found"
                    description={q ? `No match for "${q}"` : "No approved members are available yet."}
                    icon={<span>Search</span>}
                />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((m) => (
                        <div key={m.id} className="surface-card p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-bold text-[var(--text)]">{m.name}</h2>
                                    <p className="text-sm text-[var(--text-muted)]">{m.phoneRaw}</p>
                                </div>
                                <span className="badge badge-approved">Approved</span>
                            </div>
                            {m.address ? <p className="text-sm text-[var(--text-muted)]">{m.address}</p> : null}
                            {m.facebook ? (
                                <a
                                    href={m.facebook.startsWith("http") ? m.facebook : `https://facebook.com/${m.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex text-sm font-semibold text-[var(--primary)]"
                                >
                                    Open Facebook
                                </a>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
