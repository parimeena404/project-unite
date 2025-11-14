import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Check if auth is configured
const isAuthConfigured = 
  process.env.NEXTAUTH_SECRET &&
  (process.env.GOOGLE_CLIENT_ID || process.env.GITHUB_ID);

// Only add providers if credentials are available
const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers: providers.length > 0 ? providers : [
    // Dummy provider to prevent NextAuth from crashing
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {},
      authorize: async () => null,
    } as any,
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build-only",
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, attach a minimal user payload to the token
      if (user) {
        token.user = {
          name: user.name,
          email: user.email,
          role: (user as any).role || "user",
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Populate session.user from token.user for client access
      if (token && (token as any).user) {
        session.user = (token as any).user;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
