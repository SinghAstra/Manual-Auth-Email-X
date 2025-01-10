import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../utils/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,

  // Use Prisma as the adapter for storing user accounts
  adapter: PrismaAdapter(prisma),

  // Configure GitHub as the authentication provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // Callbacks to customize session and token
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      // console.log("token is ", token);
      return token;
    },
    // Customize the session object
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      // console.log("session is ", session);
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Ensure URL is properly formatted
      try {
        // Handle relative URLs
        if (url.startsWith("/")) {
          const finalUrl = `${baseUrl}${url}`;
          return finalUrl;
        }

        // Handle absolute URLs
        const urlObject = new URL(url);
        if (urlObject.origin === baseUrl) {
          return url;
        }

        // Default fallback
        return baseUrl;
      } catch (error) {
        console.error("Error in redirect callback:", error);
        return baseUrl;
      }
    },
  },

  // Customize authentication pages
  pages: {
    signIn: "/auth/sign-in", // Custom sign-in page
  },

  // debug: process.env.NODE_ENV === "development",
};
