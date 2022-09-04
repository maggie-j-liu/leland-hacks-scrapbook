import prisma from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import cloudinary from "cloudinary";
import { File } from "@prisma/client";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (
    !req.body?.title ||
    !req.body?.description ||
    !req.body?.contributors ||
    !req.body?.files
  ) {
    res.status(400).send("Missing required fields");
    return;
  }

  if (req.body.contributors.length == 0 || req.body.files.length == 0) {
    res.status(400).send("Contributors and files must not be empty");
    return;
  }

  const { title, description, contributors, files } = req.body;

  await prisma.project.create({
    data: {
      title,
      description,
      contributors: {
        connect: [
          { id: session.user.id },
          ...contributors.map((c: string) => ({ id: c })),
        ],
      },
      files: {
        create: files.map((file: File) => ({
          url: file.url,
          mediaType: file.mediaType,
        })),
      },
    },
  });

  res.end();
}
