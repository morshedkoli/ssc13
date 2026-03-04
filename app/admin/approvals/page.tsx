"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, TableBody, TableHead, TD, TH } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

interface Member {
    id: string;
    name: string;
    phoneRaw: string;
    address?: string;
    facebook?: string;
}

export default function ApprovalsPage() {
    const { toast } = useToast();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState<Record<string, boolean>>({});

    async function load() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/members?status=PENDING");
            setMembers(await res.json());
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function act(id: string, action: "approve" | "reject") {
        setActions((p) => ({ ...p, [id]: true }));
        try {
            const res = await fetch(`/api/admin/members/${id}/${action}`, { method: "PATCH" });
            if (!res.ok) {
                toast("Action failed", "error");
                return;
            }
            toast(action === "approve" ? "Member approved" : "Member rejected", action === "approve" ? "success" : "info");
            setMembers((prev) => prev.filter((m) => m.id !== id));
        } finally {
            setActions((p) => ({ ...p, [id]: false }));
        }
    }

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="surface-card p-4 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-9 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (members.length === 0) {
        return <EmptyState title="No pending approvals" description="All registration requests have been reviewed." />;
    }

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <table className="w-full min-w-[760px]">
                        <TableHead>
                            <tr>
                                <TH>Name</TH>
                                <TH>Phone</TH>
                                <TH>Address</TH>
                                <TH>Facebook</TH>
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
                                    <TD>{m.facebook || "-"}</TD>
                                    <TD><Badge variant="pending">Pending</Badge></TD>
                                    <TD className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" onClick={() => act(m.id, "approve")} loading={actions[m.id]}>Approve</Button>
                                            <Button size="sm" variant="danger" onClick={() => act(m.id, "reject")} loading={actions[m.id]}>Reject</Button>
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
                                {m.facebook ? <p className="text-sm text-[var(--text-muted)] break-all">{m.facebook}</p> : null}
                            </div>
                            <Badge variant="pending">Pending</Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button size="sm" onClick={() => act(m.id, "approve")} loading={actions[m.id]} fullWidth>Approve</Button>
                            <Button size="sm" variant="danger" onClick={() => act(m.id, "reject")} loading={actions[m.id]} fullWidth>Reject</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
