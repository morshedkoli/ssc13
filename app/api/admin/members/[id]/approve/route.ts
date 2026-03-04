import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/require-admin";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/admin/members/[id]/approve
export async function PATCH(_req: NextRequest, { params }: Ctx) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        const member = await prisma.member.update({
            where: { id },
            data: { status: "APPROVED" },
        });
        return NextResponse.json(member);
    } catch (err: any) {
        if (err.code === "P2025") return NextResponse.json({ error: "Member not found" }, { status: 404 });
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
