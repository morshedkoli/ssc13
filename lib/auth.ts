import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
                const password = (credentials?.password as string | undefined)?.trim();

                if (!email || !password) return null;

                const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
                const adminHash = process.env.ADMIN_PASSWORD_HASH;

                if (!adminEmail || !adminHash) return null;
                if (email !== adminEmail) return null;

                const valid = await bcrypt.compare(password, adminHash);
                if (!valid) return null;

                return { id: "admin", email: adminEmail, name: "Admin" };
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = "admin";
            return token;
        },
        async session({ session, token }) {
            if (token.role) {
                (session as { role?: string }).role = String(token.role);
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
