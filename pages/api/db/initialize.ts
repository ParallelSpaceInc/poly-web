// initialize nextjs api
import { initDBRecordsOnlyNotSet } from "@customTypes/model";
import { getUser } from "@libs/server/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      // if user is not ADMIN, return 403
      const user = await getUser(req);
      if (user?.role !== "ADMIN" && user?.role !== "DEVELOPER") {
        res.status(403).json({ message: "Not authorized" });
        return;
      }
      try {
        await initDBRecordsOnlyNotSet();
        res.status(200).json({ ok: true });
      } catch (error) {
        res.status(400).json({ ok: false, message: "init DB failed" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
