import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/db";
import { SIGNIN_RESTRICTED } from "../../../lib/settings";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    {
      id: "email",
      type: "email",
      name: "Email",
      server: "",
      options: {},

      maxAge: 24 * 60 * 60,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const htmlMessage = `<div>Hey hacker!</div>
<br />
<div>Click <a href="${url}">this link</a> to sign in to Leland Hacks Scrapbook.</div>
<br />
<small>Or copy and paste this link into your browser: ${url}</small>`;
        const textMessage = `Hey hacker!

Use this link to sign in to Leland Hacks Scrapbook: ${url}`;

        const res = await fetch(
          "https://mailinglist.lelandcs.workers.dev/sendEmail",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${process.env.MAILINGLIST_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
              email,
              from: "scrapbook@lelandhacks.com",
              subject: "Sign in to Leland Hacks Scrapbook",
              htmlMessage,
              textMessage,
            }),
          }
        );
        if (!res.ok) {
          throw new Error(
            `Failed to send email: ${res.status} ${await res.text()}`
          );
        }
      },
    },
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = user.id;
      session.user.username = user.username as string;
      return session;
    },
    async signIn({ user }) {
      if (!SIGNIN_RESTRICTED) {
        return true;
      }
      if (!user.email) {
        return false;
      }
      const checkedIn = await prisma.checkedIn.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!checkedIn) {
        return "/not-checked-in";
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      let username;
      if (user.name) {
        username = user.name.replace(/\s/g, "").toLowerCase();
      } else if (user.email) {
        username = user.email.split("@")[0];
      } else {
        username = user.id;
      }
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
