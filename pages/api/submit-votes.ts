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

  if (!req.body.votes || req.body.votes.length !== 3) {
    res.status(400).send("Wrong data");
    return;
  }

  const { votes }: { votes: string[] } = req.body;

  try {
    const deleteVotes = prisma.vote.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    const createVotes = prisma.vote.createMany({
      data: votes.map((vote, i) => ({
        number: i + 1,
        projectId: vote,
        userId: session.user.id,
      })),
    });

    await prisma.$transaction([deleteVotes, createVotes]);
  } catch (e) {
    console.log(e);
    res.status(400).send(`Error submitting votes: ${e}`);
  }

  res.end();
}
