"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toaster";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Select } from "@/components/ui/Select";
import { Table, TableBody, TableHead, TD, TH } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

interface Member {
    id: string;
    name: string;
    phoneRaw: string;
    address?: string;
    facebook?: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
}

interface FormData {
    name: string;
    phone: string;
    address: string;
    facebook: string;
}

const EMPTY: FormData = { name: "", phone: "", address: "", facebook: "" };

export default function MembersPage() {
    const { toast } = useToast();
    const [members, setMembers] = useState<Member[]>([]);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("APPROVED");
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<null | "add" | "edit">(null);
    const [editing, setEditing] = useState<Member | null>(null);
    const [form, setForm] = useState<FormData>(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [formError, setFormError] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/members?status=${status}&q=${encodeURIComponent(q)}`);
            setMembers(await res.json());
        } finally {
            setLoading(false);
        }
    }, [q, status]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    function openAdd() {
        setEditing(null);
        setForm(EMPTY);
        setFormError("");
        setModal("add");
    }

    function openEdit(m: Member) {
        setEditing(m);
        setForm({ name: m.name, phone: m.phoneRaw, address: m.address || "", facebook: m.facebook || "" });
        setFormError("");
        setModal("edit");
    }

    async function save() {
        setSaving(true);
        setFormError("");
        try {
            const url = editing ? `/api/admin/members/${editing.id}` : "/api/admin/members";
            const method = editing ? "PATCH" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address, facebook: form.facebook }),
            });
            const data = await res.json();
            if (!res.ok) {
                const message = data.error || "Failed to save member";
                setFormError(message);
                if (message.toLowerCase().includes("phone")) {
                    toast("Phone number must be unique", "error");
                } else {
                    toast(message, "error");
                }
                return;
            }
            toast(editing ? "Member updated" : "Member added", "success");
            setModal(null);
            load();
        } finally {
            setSaving(false);
        }
    }

    async function del(id: string) {
        if (!confirm("Delete this member?")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast("Delete failed", "error");
                return;
            }
            toast("Member deleted", "info");
            setMembers((p) => p.filter((m) => m.id !== id));
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3 w-full sm:max-w-2xl">
                    <Input placeholder="Search members" value={q} onChange={(e) => setQ(e.target.value)} />
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                    </Select>
                </div>
                <Button onClick={openAdd}>Add Member</Button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="surface-card p-4 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/2" /></div>
                    ))}
                </div>
            ) : members.length === 0 ? (
                <EmptyState title="No members found" description="Try a different search or status filter." />
            ) : (
                <>
                    <div className="hidden md:block">
                        <Table>
                            <table className="w-full min-w-[760px]">
                                <TableHead>
                                    <tr>
                                        <TH>Name</TH>
                                        <TH>Phone</TH>
                                        <TH>Address</TH>
                                        <TH>Status</TH>
                                        <TH className="text-right">Actions</TH>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {members.map((m) => (
                                        <tr key={m.id}>
                                            <TD>{m.name}</TD>
                                            <TD>{m.phoneRaw}</TD>
                                            <TD>{m.address || "-"}</TD>
                                            <TD>
                                                <Badge variant={m.status === "APPROVED" ? "approved" : m.status === "PENDING" ? "pending" : "rejected"}>{m.status.toLowerCase()}</Badge>
                                            </TD>
                                            <TD className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="secondary" onClick={() => openEdit(m)}>Edit</Button>
                                                    <Button size="sm" variant="danger" onClick={() => del(m.id)} loading={deleting === m.id}>Delete</Button>
                                                </div>
                                            </TD>
                                        </tr>
                                    ))}
                                </TableBody>
                            </table>
                        </Table>
                    </div>
                    <div className="md:hidden space-y-3">
                        {members.map((m) => (
                            <div key={m.id} className="surface-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold">{m.name}</p>
                                        <p className="text-sm text-[var(--text-muted)]">{m.phoneRaw}</p>
                                        {m.address ? <p className="text-sm text-[var(--text-muted)]">{m.address}</p> : null}
                                    </div>
                                    <Badge variant={m.status === "APPROVED" ? "approved" : m.status === "PENDING" ? "pending" : "rejected"}>{m.status.toLowerCase()}</Badge>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(m)} fullWidth>Edit</Button>
                                    <Button size="sm" variant="danger" onClick={() => del(m.id)} loading={deleting === m.id} fullWidth>Delete</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <Modal open={!!modal} onClose={() => setModal(null)} title={modal === "add" ? "Add Member" : "Edit Member"}>
                <div className="space-y-3">
                    <Input label="Full Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                    <Input label="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
                    <Input label="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                    <Input label="Facebook" value={form.facebook} onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))} />
                    {formError ? <p className="text-sm text-[var(--danger)]">{formError}</p> : null}
                    <Button onClick={save} loading={saving} fullWidth>{modal === "add" ? "Add Member" : "Save Changes"}</Button>
                </div>
            </Modal>
        </div>
    );
}
