import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertParticipantSchema } from "@/lib/schemas";
import { requireAdminApi } from "@/lib/require-admin";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/admin/events/[id]/participants — upsert participant
export async function PUT(req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: eventId } = await params;
    try {
        const body = await req.json();
        const parsed = upsertParticipantSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const { memberId, contribution, remarks, rsvp } = parsed.data;

        // Verify event exists
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

        // Verify member exists and is approved
        const member = await prisma.member.findUnique({ where: { id: memberId } });
        if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
        if (member.status !== "APPROVED") return NextResponse.json({ error: "Member is not approved" }, { status: 400 });

        // Upsert participant
        const participant = await prisma.eventParticipant.upsert({
            where: { eventId_memberId: { eventId, memberId } },
            create: {
                eventId,
                memberId,
                contribution: contribution ?? null,
                remarks: remarks?.trim() || null,
                rsvp: rsvp ?? null,
            },
            update: {
                contribution: contribution ?? null,
                remarks: remarks?.trim() || null,
                rsvp: rsvp ?? null,
            },
            include: {
                member: { select: { id: true, name: true, phoneRaw: true } },
            },
        });

        return NextResponse.json(participant);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
