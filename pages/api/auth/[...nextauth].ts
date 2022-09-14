import prisma from "@libs/server/prismaClient";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// NextAuth Documentation is here : https://next-auth.js.org/configuration/options

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, isNewUser, profile, user }) {
      // account(oauthInfo), profile, user(dbUserInfo), isNewUser are only passed one time after user signs in.
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // session duration. logout after 24h idle.
  },
});
