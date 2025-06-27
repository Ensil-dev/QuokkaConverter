import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 허용된 사용자 이메일 목록 (환경변수에서 가져옴)
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",").map(email => email.trim()) || [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 허용된 이메일인지 확인
      if (ALLOWED_EMAILS.length === 0) {
        // 허용된 이메일이 설정되지 않은 경우 모든 사용자 허용 (개발용)
        return true;
      }
      
      const isAllowed = ALLOWED_EMAILS.includes(user.email!);
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