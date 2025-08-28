import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAllowedEmails } from '@/lib/allowedEmails';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = await getAllowedEmails();
      if (allowedEmails.length === 0) {
        return true;
      }
      const isAllowed = allowedEmails.includes(user.email!);
      if (!isAllowed) {
        console.log(`접근 거부: ${user.email}`);
        return false;
      }
      console.log(`접근 허용: ${user.email}`);
      return true;
    },
    async session({ session, token }) {
      // 세션에 사용자 정보 추가
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}); 