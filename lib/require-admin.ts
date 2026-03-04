import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Call at the top of any server component admin page.
 * Redirects to /admin/login if no session exists.
 * This is the "proxy" pattern—auth enforcement happens server-side in each page.
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin/login");
    }
    return session;
}

/**
 * For API route handlers — returns 401 if no session.
 */
export async function requireAdminApi(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return !!session;
}
