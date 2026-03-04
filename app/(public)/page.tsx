import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [totalMembers, pendingApprovals, upcomingEvents, nextEvent] = await Promise.all([
        prisma.member.count({ where: { status: "APPROVED" } }),
        prisma.member.count({ where: { status: "PENDING" } }),
        prisma.event.count({ where: { startsAt: { gte: new Date() } } }),
        prisma.event.findFirst({
            where: { startsAt: { gte: new Date() } },
            orderBy: { startsAt: "asc" },
            include: { _count: { select: { participants: true } } },
        }),
    ]);

    return (
        <div className="page-container py-6 md:py-10 space-y-8 md:space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-[#d4e6e5] bg-gradient-to-r from-[#4e74dc] via-[#4b9ebf] to-[#5ac3ae] p-5 sm:p-7 text-white shadow-[var(--shadow-lg)]">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
                <div className="absolute -bottom-16 right-0 w-48 h-48 rounded-full bg-[#ffd8e9]/35 blur-2xl" />
                <div className="relative z-10 grid lg:grid-cols-[1.25fr_0.75fr] gap-5 items-center">
                    <div>
                        {nextEvent ? (
                            <>
                                <p className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Upcoming Event
                                </p>
                                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">{nextEvent.title}</h2>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
                                    <span className="rounded-full bg-white/20 px-3 py-1">{new Date(nextEvent.startsAt).toLocaleDateString("en-BD", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
                                    <span className="rounded-full bg-white/20 px-3 py-1">{new Date(nextEvent.startsAt).toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" })}</span>
                                    {nextEvent.location ? <span className="rounded-full bg-white/20 px-3 py-1">{nextEvent.location}</span> : null}
                                    <span className="rounded-full bg-white/20 px-3 py-1">{nextEvent._count.participants} participants</span>
                                </div>
                                {nextEvent.description ? (
                                    <p className="mt-3 text-sm text-white/90 max-w-2xl line-clamp-2">{nextEvent.description}</p>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <p className="inline-flex items-center rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                                    Upcoming Event
                                </p>
                                <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold leading-tight">No event scheduled yet</h2>
                                <p className="mt-3 text-sm text-white/90">Admins can publish upcoming reunions and meetups anytime. Check back soon.</p>
                            </>
                        )}

                        <div className="mt-4 flex gap-3 flex-wrap">
                            {nextEvent ? (
                                <Link href={`/events/${nextEvent.id}`} className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#24567d]">
                                    View Event
                                </Link>
                            ) : null}
                            <Link href="/events" className="inline-flex items-center justify-center rounded-xl border border-white/45 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                                Explore All Events
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-44 sm:h-52 lg:h-56 rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
                        {nextEvent?.imageUrl ? (
                            <img
                                src={nextEvent.imageUrl.startsWith("http") ? nextEvent.imageUrl : `https://${nextEvent.imageUrl}`}
                                alt={nextEvent.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Image
                                src="/globe.svg"
                                alt="Upcoming event illustration"
                                fill
                                className="object-contain p-6 opacity-95"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#174a77]/35 to-transparent" />
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl border border-[#dce6f7] bg-[var(--gradient-soft)] p-6 sm:p-8 lg:p-10">
                <div className="absolute -top-20 -right-8 w-48 h-48 rounded-full bg-[#dce8ff] blur-2xl" />
                <div className="absolute -bottom-20 -left-8 w-40 h-40 rounded-full bg-[#d8f3ef] blur-2xl" />
                <div className="relative z-10 grid lg:grid-cols-2 gap-6 items-center">
                    <div className="animate-fade-up">
                        <span className="inline-flex rounded-full border border-[#d5def2] bg-white/75 px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">Class of 2013 Community</span>
                        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[var(--text)]">
                            SSC Batch 2013 - Stay Connected
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] max-w-xl">
                            Keep friendships alive with a trusted member directory, curated events, and a simple registration flow managed by admins.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/register" className="inline-flex items-center rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)]">
                                Register Yourself
                            </Link>
                            <Link href="/events" className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)]">
                                Explore Events
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-56 sm:h-64 lg:h-72 rounded-2xl glass border border-white/60 shadow-[var(--shadow-md)] animate-scale-in">
                        <div className="absolute top-5 left-5 right-5 rounded-xl bg-white/80 p-4 shadow-[var(--shadow-sm)]">
                            <p className="text-xs text-[var(--text-muted)]">Active Network</p>
                            <p className="text-2xl font-extrabold text-[var(--text)]">{totalMembers || 0} Members</p>
                        </div>
                        <div className="absolute bottom-5 left-5 w-2/3 rounded-xl bg-white/80 p-3 shadow-[var(--shadow-sm)]">
                            <p className="text-xs text-[var(--text-muted)]">Upcoming Events</p>
                            <p className="text-xl font-bold text-[var(--text)]">{upcomingEvents || 0}</p>
                        </div>
                        <div className="absolute right-5 bottom-6 w-16 h-16 rounded-full bg-[var(--accent)] border border-white/70" />
                    </div>
                </div>
            </section>

            <section className="grid sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Members", value: totalMembers },
                    { label: "Pending Approvals", value: pendingApprovals },
                    { label: "Upcoming Events", value: upcomingEvents },
                ].map((stat) => (
                    <Card key={stat.label} className="p-5">
                        <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-[var(--text)] mt-1">{stat.value}</p>
                    </Card>
                ))}
            </section>

            <section className="rounded-3xl p-6 sm:p-8 text-center text-white" style={{ background: "var(--gradient-primary)" }}>
                <h2 className="text-2xl font-extrabold">Ready to reconnect with your batch?</h2>
                <p className="text-white/85 mt-2">Join the verified directory and stay informed about upcoming activities.</p>
                <div className="mt-5">
                    <Link href="/register" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[var(--primary)]">
                        Register Yourself
                    </Link>
                </div>
            </section>

            <footer className="pb-4 text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-4 flex flex-wrap gap-4 justify-between">
                <p>SSC Batch 2013 Community Portal</p>
                <div className="flex gap-3">
                    <Link href="/directory">Directory</Link>
                    <Link href="/events">Events</Link>
                    <Link href="/admin/login">Admin</Link>
                </div>
            </footer>
        </div>
    );
}
