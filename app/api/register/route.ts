import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";
import { normalizePhone } from "@/lib/phone";

// POST /api/register
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, phone, address, facebook, occupation } = parsed.data;
        const phoneNormalized = normalizePhone(phone);

        // Check duplicate
        const existing = await prisma.member.findUnique({ where: { phoneNormalized } });
        if (existing) {
            return NextResponse.json(
                { error: "This phone number is already registered." },
                { status: 409 }
            );
        }

        const member = await prisma.member.create({
            data: {
                name: name.trim(),
                phoneRaw: phone,
                phoneNormalized,
                address: address?.trim() || null,
                facebook: facebook?.trim() || null,
                occupation: occupation?.trim() || null,
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, id: member.id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
