export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboard() {
    await requireAdmin();

    const [approvedCount, pendingCount, upcomingCount, totalContributions, recentMembers] = await Promise.all([
        prisma.member.count({ where: { status: "APPROVED" } }),
        prisma.member.count({ where: { status: "PENDING" } }),
        prisma.event.count({ where: { startsAt: { gte: new Date() } } }),
        prisma.eventParticipant.aggregate({ _sum: { contribution: true } }),
        prisma.member.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, name: true, status: true, phoneRaw: true } }),
    ]);

    return (
        <div className="space-y-6">
            <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Approved Members</p><p className="text-3xl font-extrabold mt-1">{approvedCount}</p></Card>
                <Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Pending Approvals</p><p className="text-3xl font-extrabold mt-1">{pendingCount}</p></Card>
                <Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Upcoming Events</p><p className="text-3xl font-extrabold mt-1">{upcomingCount}</p></Card>
                <Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Total Contributions</p><p className="text-3xl font-extrabold mt-1">BDT {(totalContributions._sum.contribution || 0).toLocaleString()}</p></Card>
            </section>

            <section className="grid lg:grid-cols-3 gap-4">
                <Card className="p-5 lg:col-span-2">
                    <h2 className="text-lg font-bold mb-3">Quick actions</h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        <Link href="/admin/approvals" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold">Approve Registrations</Link>
                        <Link href="/admin/events/new" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold">Create Event</Link>
                        <Link href="/admin/members" className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-sm font-semibold">Add Member</Link>
                    </div>
                </Card>
                <Card className="p-5">
                    <h2 className="text-lg font-bold mb-3">System status</h2>
                    <p className="text-sm text-[var(--text-muted)]">All core modules are active: members, approvals, and event management.</p>
                </Card>
            </section>

            <section className="surface-card p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold">Recent members</h2>
                    <Link href="/admin/members" className="text-sm font-semibold text-[var(--primary)]">View all</Link>
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {recentMembers.map((m) => (
                        <div key={m.id} className="rounded-xl border border-[var(--border)] p-3 bg-white">
                            <p className="font-semibold">{m.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{m.phoneRaw}</p>
                            <span className={`badge mt-2 ${m.status === "APPROVED" ? "badge-approved" : m.status === "PENDING" ? "badge-pending" : "badge-rejected"}`}>{m.status.toLowerCase()}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
