import { z } from "zod";
import { isValidPhone, normalizePhone } from "@/lib/phone";

// ---- Member ----
export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    phone: z
        .string()
        .min(1, "Phone is required")
        .refine(isValidPhone, "Invalid phone number"),
    address: z.string().optional(),
    facebook: z.string().optional(),
});

export const adminCreateMemberSchema = z.object({
    name: z.string().min(2).trim(),
    phone: z.string().min(1).refine(isValidPhone, "Invalid phone number"),
    address: z.string().optional(),
    facebook: z.string().optional(),
});

export const adminEditMemberSchema = z.object({
    name: z.string().min(2).trim().optional(),
    phone: z.string().refine(isValidPhone, "Invalid phone number").optional(),
    address: z.string().optional(),
    facebook: z.string().optional(),
});

// ---- Event ----
export const createEventSchema = z.object({
    title: z.string().min(2, "Title is required").trim(),
    description: z.string().optional(),
    location: z.string().optional(),
    imageUrl: z.union([z.string().url("Image link must be a valid URL"), z.literal("")]).optional(),
    startsAt: z.string().datetime({ message: "Invalid date" }),
});

export const editEventSchema = createEventSchema.partial();

// ---- EventParticipant ----
export const upsertParticipantSchema = z.object({
    memberId: z.string().min(1, "Member ID is required"),
    contribution: z
        .number()
        .int()
        .min(0, "Contribution must be non-negative")
        .optional()
        .nullable(),
    remarks: z.string().optional().nullable(),
    rsvp: z.enum(["GOING", "MAYBE", "NOT_GOING"]).optional().nullable(),
});

// Helper: extract normalized phone from validated input
export function extractNormalized(phone: string) {
    return normalizePhone(phone);
}
