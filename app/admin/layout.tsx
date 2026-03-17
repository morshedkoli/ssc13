import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    let session = null;
    try {
        session = await getServerSession(authOptions);
    } catch {
        // Stale/corrupt JWT cookie — delete it so the user can log in fresh
        const cookieStore = await cookies();
        cookieStore.delete("next-auth.session-token");
        cookieStore.delete("__Secure-next-auth.session-token");
    }

    if (!session) {
        return <>{children}</>;
    }

    return <AdminShell userLabel={session.user?.email || "Admin"}>{children}</AdminShell>;
}
