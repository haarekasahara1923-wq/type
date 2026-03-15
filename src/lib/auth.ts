import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Admin Authentication
        if (
          credentials.email === process.env.ADMIN_MAIL_ID &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            name: "Administrator",
            email: credentials.email,
            role: "admin"
          };
        }

        const user = await prisma.student.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Compare password, also checking plain text for backward compatibility with seeded data
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (isMatch || credentials.password === user.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "student"
          };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    }
  }
};
