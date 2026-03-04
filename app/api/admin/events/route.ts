import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/schemas";
import { requireAdminApi } from "@/lib/require-admin";

// GET /api/admin/events
export async function GET() {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const events = await prisma.event.findMany({
        orderBy: { startsAt: "desc" },
        include: { _count: { select: { participants: true } } },
    });
    return NextResponse.json(events);
}

// POST /api/admin/events
export async function POST(req: NextRequest) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json();
        const parsed = createEventSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const { title, description, location, imageUrl, startsAt } = parsed.data;
        const event = await prisma.event.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                location: location?.trim() || null,
                imageUrl: imageUrl?.trim() || null,
                startsAt: new Date(startsAt),
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
