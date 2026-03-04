"use client";
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toaster";
import { EmptyState } from "@/components/ui/EmptyState";

interface Member {
    id: string;
    name: string;
    phoneRaw: string;
}

interface Participant {
    id: string;
    memberId: string;
    contribution?: number | null;
    remarks?: string | null;
    member: Member;
}

interface Event {
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

function toLocalDatetime(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { toast } = useToast();

    const [event, setEvent] = useState<Event | null>(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    const [editOpen, setEditOpen] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editForm, setEditForm] = useState({ title: "", description: "", location: "", imageUrl: "", startsAt: "" });

    const [searchQ, setSearchQ] = useState("");
    const [searchResults, setSearchResults] = useState<Member[]>([]);
    const [searching, setSearching] = useState(false);

    const [partModal, setPartModal] = useState<"add" | "edit" | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [partForm, setPartForm] = useState({ contribution: "", remarks: "" });
    const [partSaving, setPartSaving] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchEvent = useCallback(async () => {
        const res = await fetch(`/api/events/${id}`);
        if (res.ok) {
            setEvent(await res.json());
        }
        setLoadingEvent(false);
    }, [id]);

    useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    function openEditEvent() {
        if (!event) return;
        setEditForm({
            title: event.title,
            description: event.description || "",
            location: event.location || "",
            imageUrl: event.imageUrl || "",
            startsAt: toLocalDatetime(event.startsAt),
        });
        setEditOpen(true);
    }

    async function saveEvent() {
        setEditSaving(true);
        try {
            const res = await fetch(`/api/admin/events/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editForm, startsAt: new Date(editForm.startsAt).toISOString() }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast(data.error || "Update failed", "error");
                return;
            }
            toast("Event updated", "success");
            setEditOpen(false);
            fetchEvent();
        } finally {
            setEditSaving(false);
        }
    }

    const searchMembers = useCallback(
        async (q: string) => {
            if (!q.trim()) {
                setSearchResults([]);
                return;
            }
            setSearching(true);
            try {
                const res = await fetch(`/api/members?q=${encodeURIComponent(q)}`);
                const data = await res.json();
                const addedIds = new Set(event?.participants.map((p) => p.memberId) || []);
                setSearchResults(data.filter((m: Member) => !addedIds.has(m.id)));
            } finally {
                setSearching(false);
            }
        },
        [event]
    );

    useEffect(() => {
        const t = setTimeout(() => searchMembers(searchQ), 250);
        return () => clearTimeout(t);
    }, [searchQ, searchMembers]);

    function openAddParticipant(member: Member) {
        setSelectedMember(member);
        setPartForm({ contribution: "", remarks: "" });
        setPartModal("add");
    }

    function openEditParticipant(p: Participant) {
        setSelectedMember(p.member);
        setPartForm({ contribution: p.contribution != null ? String(p.contribution) : "", remarks: p.remarks || "" });
        setPartModal("edit");
    }

    async function saveParticipant() {
        if (!selectedMember) return;
        const contribution = partForm.contribution === "" ? null : parseInt(partForm.contribution, 10);
        if (partForm.contribution !== "" && (contribution === null || Number.isNaN(contribution) || contribution < 0)) {
            toast("Contribution must be a non-negative number", "error");
            return;
        }

        setPartSaving(true);
        try {
            const res = await fetch(`/api/admin/events/${id}/participants`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ memberId: selectedMember.id, contribution, remarks: partForm.remarks }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast(data.error || "Failed to save participant", "error");
                return;
            }
            toast(partModal === "add" ? "Participant added" : "Participant updated", "success");
            setPartModal(null);
            setSearchQ("");
            setSearchResults([]);
            fetchEvent();
        } finally {
            setPartSaving(false);
        }
    }

    async function removeParticipant(memberId: string) {
        if (!confirm("Remove this participant?")) return;
        setRemovingId(memberId);
        try {
            const res = await fetch(`/api/admin/events/${id}/participants/${memberId}`, { method: "DELETE" });
            if (!res.ok) {
                toast("Remove failed", "error");
                return;
            }
            toast("Participant removed", "info");
            fetchEvent();
        } finally {
            setRemovingId(null);
        }
    }

    if (loadingEvent) {
        return <div className="surface-card p-6">Loading event details...</div>;
    }

    if (!event) {
        return <EmptyState title="Event not found" description="The event may have been deleted." />;
    }

    const totalContribution = event.participants.reduce((sum, p) => sum + (p.contribution || 0), 0);

    return (
        <div className="space-y-4">
            <Link href="/admin/events" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] inline-flex">Back to Events</Link>

            <div className="grid xl:grid-cols-2 gap-4 items-start">
                <Card className="p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            {displayImageUrl(event.imageUrl) ? (
                                <img
                                    src={displayImageUrl(event.imageUrl) || ""}
                                    alt={event.title}
                                    className="w-full h-44 rounded-xl object-cover border border-[var(--border)] mb-3"
                                />
                            ) : null}
                            <h1 className="text-2xl font-extrabold text-[var(--text)]">{event.title}</h1>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{new Date(event.startsAt).toLocaleString("en-BD")}</p>
                            {event.location ? <p className="text-sm text-[var(--text-muted)] mt-1">{event.location}</p> : null}
                            {event.description ? <p className="text-sm text-[var(--text-muted)] mt-2">{event.description}</p> : null}
                        </div>
                        <Button variant="secondary" size="sm" onClick={openEditEvent}>Edit</Button>
                    </div>
                </Card>

                <Card className="p-5 sticky top-20">
                    <h2 className="text-lg font-bold mb-3">Participants Manager</h2>
                    <Input placeholder="Search approved members" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                    {searching ? <p className="text-sm text-[var(--text-muted)] mt-2">Searching...</p> : null}
                    {!searching && searchResults.length > 0 ? (
                        <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                            {searchResults.map((m) => (
                                <div key={m.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 flex items-center justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-sm">{m.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{m.phoneRaw}</p>
                                    </div>
                                    <Button size="sm" onClick={() => openAddParticipant(m)}>Add</Button>
                                </div>
                            ))}
                        </div>
                    ) : null}
                    {searchQ && !searching && searchResults.length === 0 ? <p className="text-sm text-[var(--text-muted)] mt-2">No members available to add.</p> : null}
                </Card>
            </div>

            <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">Participants ({event.participants.length})</h2>
                    <div className="badge badge-approved">Total: BDT {totalContribution.toLocaleString()}</div>
                </div>

                {event.participants.length === 0 ? (
                    <EmptyState title="No participants yet" description="Search and add approved members from the panel above." />
                ) : (
                    <div className="space-y-3">
                        {event.participants.map((p) => (
                            <div key={p.id} className="rounded-xl border border-[var(--border)] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">{p.member.name}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{p.member.phoneRaw}</p>
                                    {p.remarks ? <p className="text-sm text-[var(--text-muted)] mt-1">{p.remarks}</p> : null}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-info">BDT {(p.contribution || 0).toLocaleString()}</span>
                                    <Button size="sm" variant="secondary" onClick={() => openEditParticipant(p)}>Edit</Button>
                                    <Button size="sm" variant="danger" onClick={() => removeParticipant(p.memberId)} loading={removingId === p.memberId}>Remove</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Event">
                <div className="space-y-3">
                    <Input label="Title" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
                    <Textarea label="Description" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} />
                    <Input label="Location" value={editForm.location} onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))} />
                    <Input label="Image Link" value={editForm.imageUrl} onChange={(e) => setEditForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/event-banner.jpg" hint="Optional. This image appears on public and admin event cards." />
                    <Input label="Date & Time" type="datetime-local" value={editForm.startsAt} onChange={(e) => setEditForm((p) => ({ ...p, startsAt: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" onClick={() => setEditOpen(false)} fullWidth>Cancel</Button>
                        <Button onClick={saveEvent} loading={editSaving} fullWidth>Save</Button>
                    </div>
                </div>
            </Modal>

            <Modal open={!!partModal} onClose={() => setPartModal(null)} title={partModal === "add" ? "Add Participant" : "Edit Participant"}>
                <div className="space-y-3">
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                        <p className="font-semibold">{selectedMember?.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{selectedMember?.phoneRaw}</p>
                    </div>
                    <Input
                        label="Contribution"
                        type="number"
                        min="0"
                        value={partForm.contribution}
                        onChange={(e) => setPartForm((p) => ({ ...p, contribution: e.target.value }))}
                        hint="Amount in BDT"
                    />
                    <Textarea label="Remarks" rows={3} value={partForm.remarks} onChange={(e) => setPartForm((p) => ({ ...p, remarks: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="secondary" onClick={() => setPartModal(null)} fullWidth>Cancel</Button>
                        <Button onClick={saveParticipant} loading={partSaving} fullWidth>{partModal === "add" ? "Add" : "Update"}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
