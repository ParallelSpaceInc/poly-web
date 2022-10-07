import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const allowedMethod = ["GET", "PATCH"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!allowedMethod.includes(req.method!)) {
    res.status(405).end();
    return;
  }
  if (req.method === "GET") {
    const answer: { texts: { [key: string]: string } } = {
      texts: {},
    };
    const texts = await prismaClient.siteText.findMany();
    const parsedTexts = texts.reduce((prev: { [key: string]: string }, cur) => {
      prev[cur.id] = cur.text;
      return prev;
    }, {});
    answer["texts"] = parsedTexts;
    res.json(answer);
    return;
  } else if (req.method === "PATCH") {
    if (!(await IsUserAdmin(session))) {
      return res.status(403).end();
    }
    const result = await Promise.allSettled(
      Object.entries(req.body as Object).map(([key, val]) => {
        return prismaClient.siteText.update({
          where: { id: key },
          data: { text: val },
        });
      })
    );
    res.json(result);
    return;
  }
  res.end("error");
  return;
}

const IsUserAdmin = async (session: any) => {
  const email = session?.user?.email;
  const role = await prismaClient.user
    .findUnique({
      where: { email: email ?? "" },
      select: {
        role: true,
      },
    })
    .then((res) => res?.role);
  return role === Role.ADMIN;
};
