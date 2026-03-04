import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <>{children}</>;
    }

    return <AdminShell userLabel={session.user?.email || "Admin"}>{children}</AdminShell>;
}
