import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (process.env.NODE_ENV === "development") {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn() {
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
  trustHost: true,
});
