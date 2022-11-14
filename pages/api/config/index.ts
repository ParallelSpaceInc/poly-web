import { SiteConfigProps, SiteTextProps } from "@customTypes/model";
import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const allowedMethod = ["GET", "PATCH"];

export type SiteConfig = {
  texts: SiteTextProps;
};

const Query = ["texts", "config"] as const;

export type RequestQuery = Partial<{
  [key in typeof Query[number]]: string | string[];
}>;

export type ResponeQuery = {
  texts?: Partial<SiteTextProps>;
  config?: Partial<SiteConfigProps>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!allowedMethod.includes(req.method!)) {
    return res.status(405).end();
  }
  if (req.method === "GET") {
    return await handleGet(req, res);
  } else if (req.method === "PATCH") {
    return await handlePatch(req, res);
  }
  return res.end("error");
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const query: RequestQuery = req.query;
  const answer: ResponeQuery = {};
  if (query.texts === "true") {
    const texts = await prismaClient.siteText.findMany();
    answer.texts = parseDBGetResult(texts, "text");
  }
  if (query.config === "true") {
    const config = await prismaClient.siteConfig.findMany();
    answer.config = parseDBGetResult(config, "value");
  }
  res.json(answer);
  return;
};

const parseDBGetResult = (
  result: { id: string; [key: string]: string }[],
  column: string
) => {
  return result.reduce((prev: { [key: string]: string }, cur) => {
    prev[cur.id] = cur[column];
    return prev;
  }, {});
};

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
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
};

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
