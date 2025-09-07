import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NEXTAUTH_URL은 .env.local에서 관리 (포트 자동 감지)

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/convert');
      // /convert 이하만 보호, 그 외는 통과
      return isProtected ? isLoggedIn : true;
    },
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
