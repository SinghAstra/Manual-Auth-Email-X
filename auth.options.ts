import { login } from "@/lib/actions/auth/login";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

if (!process.env.NEXT_AUTH_SECRET) {
  throw new Error("NEXT_AUTH_SECRET is required");
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await login(credentials);

        console.log("result is ", result);

        if (result.success) {
          return {
            id: result.user?.id,
            email: result.user?.email,
            role: result.user?.role,
            name: result.user?.name,
            image: result.user?.image,
          } as User;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXT_AUTH_SECRET,
} satisfies NextAuthOptions;
