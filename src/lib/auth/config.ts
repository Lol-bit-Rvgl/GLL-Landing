/**
 * Auth Configuration - Separated for reusability
 */

import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Role } from "./index";
import type { DefaultSession, User, Account, Profile, AuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

export interface AuthUser extends User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// Usuarios
export const USERS: AuthUser[] = [
  {
    id: "super-admin-1",
    name: "GLL Super Admin",
    email: "admin@gll.terminal",
    role: "SUPER_ADMIN",
  },
];

// Password hash for the default super admin account
// DEVELOPMENT ONLY: Using the correct hash for "gll_super_admin_2026"
// In production, generate your own hash: node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
// Then set NEXTAUTH_PASSWORD_HASH environment variable
const DEV_PASSWORD_HASH = "$2b$10$R8TV9ZRIH/NNJ22NhRYXj./QTTuC0DTvxUpcx1hbQp93Dn5sckDsG";

const PASSWORD_HASHES = new Map<string, string>();
PASSWORD_HASHES.set("admin@gll.terminal", DEV_PASSWORD_HASH);

// Export fn para acceder al hash (es el problema del hash)
export function getPasswordHash(email: string): string | undefined {
  return PASSWORD_HASHES.get(email);
}

export const authOptions: AuthOptions = {
  providers: [
    {
      type: "credentials",
      id: "credentials",
      name: "GLL Control Terminal",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@gll.terminal",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = typeof credentials.email === "string" ? credentials.email : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        if (!email.includes("@") || email.length > 254) {
          return null;
        }

        if (password.length < 1 || password.length > 72) {
          return null;
        }

        const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
          return null;
        }

        const hash = getPasswordHash(email);
        if (!hash) {
          return null;
        }

        try {
          const isValid = await bcrypt.compare(password, hash);
          if (!isValid) {
            console.warn(`[AUTH] Login fallido para ${email}`);
            return null;
          }

          console.log(`[AUTH] Login exitoso para ${email}`);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("[AUTH] Error:", error);
          return null;
        }
      },
    },
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: JWT; user?: User }) {
      if (session?.user && token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        (session.user as Record<string, unknown>).name = token.name;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        const u = user as AuthUser;
        token.role = u.role;
        token.name = u.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/admin/signin",
    error: "/admin/signin?error=AccessDenied",
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-not-for-production",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  events: {
    signIn(message: Record<string, unknown>) {
      console.log("[AUTH] Evento:", message);
    },
  },
};