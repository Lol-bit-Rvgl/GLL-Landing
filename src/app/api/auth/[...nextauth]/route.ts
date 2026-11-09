/**
 * Auth API Route for NextAuth v4 with App Router
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };