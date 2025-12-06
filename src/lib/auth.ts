import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // Twitter OAuth (optional - requires API keys)
    ...(process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET
      ? [
          TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: "2.0",
          }),
        ]
      : []),

    // Simple guest/anonymous login for demo
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {
        name: { label: "Display Name", type: "text", placeholder: "Researcher" },
      },
      async authorize(credentials) {
        const name = credentials?.name || "Anonymous Researcher";

        // Create a guest user
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

        try {
          const user = await prisma.user.create({
            data: {
              id: guestId,
              name,
              email: null,
            },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch {
          // If DB fails, return a temp user
          return {
            id: guestId,
            name,
            email: null,
          };
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "twitter") {
        try {
          // Upsert user for Twitter login
          await prisma.user.upsert({
            where: { twitterId: account.providerAccountId },
            update: {
              name: user.name,
              image: user.image,
            },
            create: {
              twitterId: account.providerAccountId,
              twitterHandle: user.name,
              name: user.name,
              image: user.image,
            },
          });
        } catch (error) {
          console.error("Error saving Twitter user:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "twitter") {
        token.twitterId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
