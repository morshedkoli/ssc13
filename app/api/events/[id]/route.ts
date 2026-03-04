import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/events/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            participants: {
                include: {
                    member: {
                        select: { id: true, name: true, phoneRaw: true, address: true },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
}
