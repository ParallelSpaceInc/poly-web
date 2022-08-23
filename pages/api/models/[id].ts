import { hasRight } from "@libs/server/Authorization";
import prismaClient, { getUser } from "@libs/server/prismaClient";
import { deleteS3Files, downloadS3Files } from "@libs/server/s3client";
import { NextApiRequest, NextApiResponse } from "next";
import internal from "stream";

const allowedMethod = ["GET", "DELETE"];

// If CDN is adapted, this api can improve performance by checking authority then passing download request to CDN server.
// still, this api is handling download request.
export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  const modelId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!modelId) {
    res.status(400).json({ error: "Can't find the model id in query." });
    return;
  }
  const user = await getUser(req);
  if (req.method === "GET") {
    const DAYILY_DOWNLOAD_LIMIT = 100;
    if (!user) {
      res.json({
        ok: false,
        message: "Please log in for download",
      });
      return;
    }
    if (user.role === "UNAUTHENTICATED") {
      res.json({
        ok: false,
        message: "You don't have a permission to download a model.",
      });
      return;
    }
    const { _count } = await prismaClient.log.aggregate({
      // May be inefficient query. find another algorithm later.
      where: {
        createdAt: {
          gte: new Date(new Date().toDateString()), // truncated time(begining of today) depends on server location.
        },
        action: "MODEL_DOWNLOAD",
        userId: user.id,
      },
      _count: true,
    });
    if (_count >= DAYILY_DOWNLOAD_LIMIT) {
      res.json({
        ok: false,
        message: `Your download count exceed daily limit (max : ${DAYILY_DOWNLOAD_LIMIT})`,
      });
      return;
    }

    // download file from s3
    const objectbuffer = await downloadS3Files(modelId).catch((error) => {
      return Error("Can't find model.");
    });
    if (objectbuffer instanceof Error) {
      res.json({
        ok: false,
        message: `Can't find model with ID ${modelId}`,
      });
      return;
    }
    if (
      !objectbuffer.Body ||
      !(objectbuffer.Body instanceof internal.Readable)
    ) {
      res.status(500).json({
        ok: false,
        message: "failed to download while connecting storage server",
      });
      return;
    }
    objectbuffer.Body.pipe(res);
    // then create new log
    await prismaClient.log.create({
      data: {
        action: "MODEL_DOWNLOAD",
        userId: user.id,
      },
    });
    return;
  }
  if (req.method === "DELETE") {
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
