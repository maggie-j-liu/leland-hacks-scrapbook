import prisma from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }
  if (req.headers.authorization !== `Bearer ${process.env.CHECK_IN_SECRET}`) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!req.body?.data) {
    res.status(400).send("Missing required fields");
    return;
  }

  const { data }: { data: { email: string; checkedIn: boolean }[] } = req.body;

  const checkedIn = data
    .filter((d) => d.checkedIn)
    .map((d) => ({
      email: d.email,
    }));

  const unCheckedIn = data.filter((d) => !d.checkedIn).map((d) => d.email);

  const createQuery = prisma.checkedIn.createMany({
    data: checkedIn,
    skipDuplicates: true,
  });

  const deleteQuery = prisma.checkedIn.deleteMany({
    where: {
      email: {
        in: unCheckedIn,
      },
    },
  });

  await Promise.all([createQuery, deleteQuery]);

  res.end();
}
