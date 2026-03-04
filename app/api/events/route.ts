import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events
export async function GET() {
    const events = await prisma.event.findMany({
        orderBy: { startsAt: "desc" },
        include: {
            _count: { select: { participants: true } },
        },
    });
    return NextResponse.json(events);
}
