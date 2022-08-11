import { hasRight } from "@libs/server/Authorization";
import prismaClient, { getUser } from "@libs/server/prismaClient";
import { deleteS3Files } from "@libs/server/s3client";
import { NextApiRequest, NextApiResponse } from "next";

const allowedMethod = ["DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  const user = await getUser(req);
  if (req.method === "DELETE") {
    const modelId = Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id;
    if (!modelId) {
      res.status(400).json({ error: "Can't find the model id in query." });
      return;
    }
    const model = await prismaClient.model.findUnique({
      where: {
        id: modelId,
      },
    });
    if (model === null) {
      res.status(404).json({ ok: false, message: "Can't find the model." });
      return;
    }
    if (
      !hasRight(
        {
          method: "delete",
          theme: "model",
        },
        user,
        model
      )
    ) {
      res
        .status(403)
        .json({ ok: false, message: "You don't have a permission." });
      return;
    }
    try {
      deleteS3Files(modelId);
      await prismaClient.model.delete({
        where: {
          id: modelId,
        },
      });
      res.json({ ok: true, message: "delete success!" });
      return;
    } catch (e) {
      res.status(500).json({ ok: false, message: "Failed while deleting." });
      return;
    }
  }
  res.status(500).json({ ok: false, message: "Failed handling request." });
}
