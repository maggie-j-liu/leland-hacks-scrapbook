import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  if (!req.body?.username) {
    res.status(400).send("Missing required fields");
    return;
  }

  const { username } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res
    .status(200)
    .json({
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
    });
}
