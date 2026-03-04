import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminEditMemberSchema } from "@/lib/schemas";
import { normalizePhone } from "@/lib/phone";
import { requireAdminApi } from "@/lib/require-admin";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/members/[id]
export async function PATCH(req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const body = await req.json();
        const parsed = adminEditMemberSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data: Record<string, any> = {};
        if (parsed.data.name) data.name = parsed.data.name.trim();
        if (parsed.data.phone) {
            const phoneNormalized = normalizePhone(parsed.data.phone);
            // Check duplicate (excluding self)
            const existing = await prisma.member.findFirst({
                where: { phoneNormalized, NOT: { id } },
            });
            if (existing) return NextResponse.json({ error: "Phone number already used." }, { status: 409 });
            data.phoneRaw = parsed.data.phone;
            data.phoneNormalized = phoneNormalized;
        }
        if ("address" in parsed.data) data.address = parsed.data.address?.trim() || null;
        if ("facebook" in parsed.data) data.facebook = parsed.data.facebook?.trim() || null;

        const member = await prisma.member.update({ where: { id }, data });
        return NextResponse.json(member);
    } catch (err: any) {
        if (err.code === "P2025") return NextResponse.json({ error: "Member not found" }, { status: 404 });
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/admin/members/[id]
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        await prisma.member.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        if (err.code === "P2025") return NextResponse.json({ error: "Member not found" }, { status: 404 });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
