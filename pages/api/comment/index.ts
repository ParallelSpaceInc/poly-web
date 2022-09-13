import { getUser } from "@libs/server/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

const allowedMethod = ["POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  const user = await getUser(req);
  const modelId = Array.isArray(req.query.modelId)
    ? req.query.modelId[0]
    : req.query.modelId;
  if (!modelId) {
    res
      .status(400)
      .json({ ok: false, error: "Can't find the model id in query." });
    return;
  }
  if (req.method === "POST") {
    if (!user) {
      res.json({
        ok: false,
        message: "Please log in for commenting.",
      });
      return;
    }
    const form = JSON.parse(req.body);
    await prismaClient.comment.create({
      data: {
        text: form.text,
        userId: user.id,
        modelId: modelId,
      },
    });
    res.json({ ok: true, message: "success!" });
  }
}
