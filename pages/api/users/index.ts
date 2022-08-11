import { getUser } from "@libs/server/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

const allowedMethod = ["GET", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUser(req);
  switch (req.method) {
    case "GET": {
      res.json(user);
      break;
    }
    case "DELETE": {
      res.status(405).json({ ok: false });
      break;
    }
    default: {
      res.status(500).json({ ok: false });
      break;
    }
  }
  return;
}
