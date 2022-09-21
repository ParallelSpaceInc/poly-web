import { hasRight } from "@libs/server/Authorization";
import { getUser } from "@libs/server/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

const allowedMethod = ["POST", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  const user = await getUser(req);
  const modelId = getAnyQueryValueOfKey(req, "modelId");
  const commentId = getAnyQueryValueOfKey(req, "commentId");
  if (req.method === "POST") {
    if (!modelId) {
      res
        .status(400)
        .json({ ok: false, error: "Can't find the model id in query." });
      return;
    }
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
  } else if (req.method === "DELETE") {
    if (!commentId) {
      res.json({ ok: false, message: "잘못된 삭제요청입니다." });
      return;
    }
    const comment = await prismaClient.comment.findUnique({
      where: {
        id: +commentId,
      },
    });
    if (
      !hasRight({ method: "delete", theme: "comment" }, user, null, comment)
    ) {
      res.json({
        ok: false,
        message: "삭제권한이 없습니다.",
      });
      return;
    }
    await prismaClient.comment.delete({
      where: {
        id: +commentId,
      },
    });
    res.json({ ok: true, message: "success!" });
  }
}

export function getAnyQueryValueOfKey(req: NextApiRequest, key: string) {
  return Array.isArray(req.query[key])
    ? req.query[key]?.[0]
    : (req.query[key] as string);
}
