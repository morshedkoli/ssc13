import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";

type Ctx = { params: Promise<{ id: string; memberId: string }> };

// DELETE /api/admin/events/[id]/participants/[memberId]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: eventId, memberId } = await params;
    try {
        await prisma.eventParticipant.delete({
            where: { eventId_memberId: { eventId, memberId } },
        });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        if (err.code === "P2025") return NextResponse.json({ error: "Participant not found" }, { status: 404 });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
