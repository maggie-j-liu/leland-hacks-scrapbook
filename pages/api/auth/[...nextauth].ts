import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = user.id;
      session.user.username = user.username as string;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      console.log("user created", user);
      let username = user.name?.replace(/\s/g, "").toLowerCase();
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            username,
          },
        });
      } catch (e) {
        username += Math.floor(1000 + Math.random() * 9000).toString();
        await prisma.user.update({
          where: { id: user.id },
          data: {
            username,
          },
        });
      }
    },
  },
};

export default NextAuth(authOptions);
