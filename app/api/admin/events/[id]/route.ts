import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { editEventSchema } from "@/lib/schemas";
import { requireAdminApi } from "@/lib/require-admin";
import { Prisma } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/events/[id]
export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const body = await req.json();
        const parsed = editEventSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data: Record<string, string | Date | null> = {};
        if (parsed.data.title) data.title = parsed.data.title.trim();
        if ("description" in parsed.data) data.description = parsed.data.description?.trim() || null;
        if ("location" in parsed.data) data.location = parsed.data.location?.trim() || null;
        if ("imageUrl" in parsed.data) data.imageUrl = parsed.data.imageUrl?.trim() || null;
        if (parsed.data.startsAt) data.startsAt = new Date(parsed.data.startsAt);

        const event = await prisma.event.update({ where: { id }, data });
        return NextResponse.json(event);
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/admin/events/[id]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
