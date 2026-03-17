import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name:    { label: "Name",          type: "text" },
        contact: { label: "Mobile Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.contact) return null;

        const name    = credentials.name.trim();
        const contact = credentials.contact.trim().replace(/\D/g, '');

        // ── Admin Authentication (env-based) ──────────────────────────
        if (
          name    === process.env.ADMIN_NAME &&
          contact === process.env.ADMIN_MOBILE
        ) {
          return {
            id:      "admin",
            name:    "Administrator",
            email:   "admin@emax.local",
            role:    "admin",
          };
        }

        // ── Student Authentication — find by mobile number ─────────────
        const user = await prisma.student.findUnique({
          where: { contact },
        });

        if (!user) return null;

        // Verify name matches (case-insensitive, trimmed)
        const nameMatch =
          user.name.trim().toLowerCase() === name.toLowerCase();

        if (!nameMatch) return null;

        return {
          id:    user.id,
          name:  user.name,
          email: user.email ?? "",
          role:  "student",
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
};
