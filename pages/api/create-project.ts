import prisma from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { File } from "@prisma/client";

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
    !req.body?.files ||
    (req.body?.ship !== false && req.body?.ship !== true) ||
    (req.body?.beginner !== false && req.body?.beginner !== true)
  ) {
    res.status(400).send("Missing required fields");
    return;
  }

  if (req.body.files.length == 0) {
    res.status(400).send("Files must not be empty");
    return;
  }

  const { title, description, contributors, files, ship, beginner } = req.body;

  try {
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
            width: file.width,
            height: file.height,
          })),
        },
        ship,
        beginner,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(`Error creating project: ${e}`);
  }
  res.end();
}
