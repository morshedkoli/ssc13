"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function SignOutButton() {
    return (
        <Button onClick={() => signOut({ callbackUrl: "/admin/login" })} variant="outline" size="sm" className="text-xs">
            Sign Out
        </Button>
    );
}
