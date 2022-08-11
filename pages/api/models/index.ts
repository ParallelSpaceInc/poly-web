import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ModelInfo, UploadForm } from "@customTypes/model";
import { hasRight } from "@libs/server/Authorization";
import prismaClient from "@libs/server/prismaClient";
import s3client, { deleteS3Files } from "@libs/server/s3client";
import { Model } from "@prisma/client";
import { randomUUID } from "crypto";
import extract from "extract-zip";
import formidable from "formidable";
import { createReadStream, readdirSync, statSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

type FormidableResult = {
  err: string;
  fields: formidable.Fields;
  files: formidable.Files;
};

const allowedMethod = ["GET", "POST", "DELETE"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getSession({ req });
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  if (req.method === "GET") {
    if (req.query.id) {
      const model = await prismaClient.model.findUnique({
        where: { id: req.query.id as string },
      });
      if (!model) {
        res.status(404).end();
        return;
      }
      res.json([makeModelInfo(model)]);
      return;
    }
    // send first 30 model info
    const modelList = await prismaClient.model.findMany({ take: 30 });
    const parsedList = makeModelInfos(modelList);
    res.status(200).json(parsedList);
  } else if (req.method === "POST") {
    // authorize client then upload model. db update return model id.
    const isLogined = !!token;
    if (!isLogined) {
      res.status(401).send("Login first");
      return;
    }
    const user = await prismaClient.user.findUnique({
      where: {
        email: token.user?.email ?? undefined, // if undefined, search nothing
      },
    });
    if (user === null) {
      res.status(401).end();
      return;
    }
    if (
      // if don't have right, reply code 403.
      !hasRight(
        {
          theme: "model",
          method: "create",
        },
        user
      )
    ) {
      res.status(403).json({ ok: false, message: "로그인이 필요합니다." });
      return;
    }

    // upload to s3
    const uuid = randomUUID();
    const formidable = await getFormidableFileFromReq(req);
    await extractZipThenSendToS3(uuid, formidable).catch((e) => {
      res.status(500).json({ error: "while uploading to storage" });
      return;
    });
    const form: UploadForm = JSON.parse(formidable.fields.form as string);

    await prismaClient.model
      .create({
        data: {
          id: uuid,
          name: form.name,
          category: form.category,
          tags: form.tag?.split(" ") ?? [],
          description: form.description,
          userId: user.id,
        },
      })
      .catch((e) => {
        res.status(500).json({ error: "while updating db" });
        deleteS3Files(uuid);
        return;
      });
    res
      .setHeader("Location", "/models")
      .status(303)
      .json({ message: "업로드에 성공하였습니다." });
  } else if (req.method === "DELETE") {
    const user = await prismaClient.user.findUnique({
      where: {
        email: token?.user?.email ?? undefined, // if undefined, search nothing
      },
    });
    const modelId = Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id;
    if (!modelId) {
      res.status(400).json({ error: "model id query not found" });
      return;
    }
    const model = await prismaClient.model.findUnique({
      where: {
        id: modelId,
      },
    });
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
      res.status(403).end();
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
}

// FOR RESPONE TO GET

const makeModelInfo: (model: Model) => ModelInfo = (model) => {
  return {
    ...model,
    modelSrc: `/getResource/models/${model.id}/scene.gltf`,
    thumbnailSrc: `/getResource/models/${model.id}/thumbnail.png`,
  };
};

const makeModelInfos: (models: Model[]) => ModelInfo[] = (models) =>
  models.map((model) => makeModelInfo(model));

// FOR RESPONE TO POST

const extractZipThenSendToS3 = async (
  uuid: string,
  formidable: FormidableResult
) => {
  const fileInfo = await getFileInfo(formidable.files);
  const filePath = `/tmp/${uuid}`;
  await extract(fileInfo.path, { dir: filePath });
  await Promise.all(
    (
      await getFilesPath(filePath)
    ).map((file) => {
      const stream = createReadStream(file);
      const filesParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `models/${uuid}/${path.basename(file)}`,
        Body: stream,
      };
      return s3client.send(new PutObjectCommand(filesParams));
    })
  );
};

const getFormidableFileFromReq = async (req: NextApiRequest) => {
  return await new Promise<FormidableResult>((res, rej) => {
    const form = formidable({
      multiples: true,
      maxFieldsSize: 100 << 20, // 100MB for zip file
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return rej(err);
      return res({ err, fields, files });
    });
  });
};

const getFileInfo = (fileData: formidable.Files) => {
  if (typeof fileData === "string") {
    return Promise.reject("Can't find uploaded file");
  }
  if (fileData.file instanceof Array) {
    throw Promise.reject("Can't resolve multiple files");
  }
  const parsed = fileData.file.toJSON();
  return Promise.resolve({
    name: parsed.originalFilename ?? "noName",
    path: parsed.filepath,
  });
};

const getFilesPath: (dir: string) => Promise<string[]> = async (
  dir: string
) => {
  const files = readdirSync(dir);
  const res = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = statSync(filePath);
      if (stats.isDirectory()) return getFilesPath(filePath);
      else return filePath;
    })
  );
  if (res === undefined) return [];
  return res.reduce<string[]>(
    (all, folderContents) => all.concat(folderContents),
    []
  );
};
