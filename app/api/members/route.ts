import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/members?q=search
export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q") || "";

    const members = await prisma.member.findMany({
        where: {
            status: "APPROVED",
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
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            phoneRaw: true,
            phoneNormalized: true,
            address: true,
            facebook: true,
            createdAt: true,
        },
    });

    return NextResponse.json(members);
}
