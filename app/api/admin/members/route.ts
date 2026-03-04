import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCreateMemberSchema } from "@/lib/schemas";
import { normalizePhone } from "@/lib/phone";
import { requireAdminApi } from "@/lib/require-admin";

// GET /api/admin/members — all members with optional filter
export async function GET(req: NextRequest) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const status = req.nextUrl.searchParams.get("status");
    const q = req.nextUrl.searchParams.get("q") || "";

    const members = await prisma.member.findMany({
        where: {
            ...(status ? { status: status as any } : {}),
            ...(q
                ? {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { phoneNormalized: { contains: q } },
                        { address: { contains: q, mode: "insensitive" } },
                    ],
                }
                : {}),
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(members);
}

// POST /api/admin/members — create an APPROVED member
export async function POST(req: NextRequest) {
    if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json();
        const parsed = adminCreateMemberSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, phone, address, facebook } = parsed.data;
        const phoneNormalized = normalizePhone(phone);

        const existing = await prisma.member.findUnique({ where: { phoneNormalized } });
        if (existing) {
            return NextResponse.json({ error: "Phone number already exists." }, { status: 409 });
        }

        const member = await prisma.member.create({
            data: {
                name: name.trim(),
                phoneRaw: phone,
                phoneNormalized,
                address: address?.trim() || null,
                facebook: facebook?.trim() || null,
                status: "APPROVED",
            },
        });

        return NextResponse.json(member, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
