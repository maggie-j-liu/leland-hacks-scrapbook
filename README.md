# Leland Hacks Scrapbook

Inspired by [Hack Club's Scrapbook](https://scrapbook.hackclub.com), this is a platform where Leland Hacks attendees can share their projects, as well a project submission + voting system.

## Deploying Your Own

Feel free to fork for your own event! If you do so, a link back to https://scrapbook.lelandhacks.com would be appreciated.

### Environment Variables

You'll need a few environment variables to get this project running. They are specified in the [`.env.example`](https://github.com/maggie-j-liu/leland-hacks-scrapbook/blob/main/.env.example) file, and are:

#### `DATABASE_URL`

We use CockroachDB with Prisma to store data. Make a new cluster at https://cockroachlabs.cloud, then get the connection string.

#### `NEXTAUTH_SECRET`

Used for NextAuth.js; generate a random string using `openssl rand -hex 32`.

#### `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

Google OAuth is used to authenticate users, but feel free to replace or add any of the other [NextAuth.js providers](https://next-auth.js.org/providers/).

To set up Google OAuth, follow [this guide](https://support.google.com/cloud/answer/6158849?hl=en), making sure to add `http://localhost:3000/api/auth/callback/google` and `https://{YOUR_DOMAIN}/api/auth/callback/google` to the list of authorized redirect URIs.
The client ID and client secret provided are the values of these two variables.

#### `MAILINGLIST_AUTH_TOKEN`

This is used to allow magic link signin -- we have a system that uses MailChannels + Cloudflare Workers to send emails. You should probably remove email signin if it's not necessary, or configure [your own email provider](https://next-auth.js.org/providers/email).

#### `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

We use Cloudinary to store users' uploaded images. Make a Cloudinary account, and access these values in your [Cloudinary Dashboard](https://cloudinary.com/console).

#### `CHECK_IN_SECRET`

This is used to verify requests sent to `/api/check-in`. You can set it to any random string, and make sure to include it as a bearer token when sending requests to the endpoint. If you don't need to restrict access to only checked in users, you can just delete the endpoint and this variable.

### Settings

In [`lib/settings.ts`](https://github.com/maggie-j-liu/leland-hacks-scrapbook/blob/main/lib/settings.ts), you can change the following:

#### `JUDGING_OPEN`

Determines whether users can vote for their projects at `/judging`.

#### `SIGNIN_RESTRICTED`

If `true`, only users that have been added to the `CheckedIn` table can sign in. Users can be added to this table through the `/api/check-in` endpoint.

## Use

Run `pnpm i` to install dependencies, then `pnpm dev` to start the development server. You can access the site at `http://localhost:3000`.

`pnpm exec prisma studio` can be used to open Prisma studio, where you can view and edit the database.

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://www.prisma.io)
- [CockroachDB](https://www.cockroachlabs.com)
- [Cloudinary](https://cloudinary.com)
- [Tailwind CSS](https://tailwindcss.com)
