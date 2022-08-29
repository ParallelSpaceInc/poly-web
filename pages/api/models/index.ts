import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ModelInfo, UploadForm } from "@customTypes/model";
import { hasRight } from "@libs/server/Authorization";
import prismaClient from "@libs/server/prismaClient";
import s3client, { deleteS3Files } from "@libs/server/s3client";
import { Model } from "@prisma/client";
import { randomUUID } from "crypto";
import extract from "extract-zip";
import formidable from "formidable";
import {
  createReadStream,
  readdirSync,
  readFileSync,
  rename,
  statSync,
} from "fs";
import { readdir, stat } from "fs/promises";
import { validateBytes } from "gltf-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import path, { join } from "path";

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
    // respone specified model info
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
    } else if (req.query.uploader) {
      // respone specific uploader's models info
      const uploaders =
        typeof req.query.uploader === "string"
          ? [req.query.uploader]
          : req.query.uploader;
      const querys = uploaders.map((uploaderId) => {
        return {
          uploader: {
            id: uploaderId,
          },
        };
      });
      const model = await prismaClient.model.findMany({
        where: {
          OR: querys,
        },
      });
      res.json(makeModelInfos(model));
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
    const {
      model: modelName,
      thumbnail,
      modelInfo,
      totalSize,
    } = await extractZipThenSendToS3(uuid, formidable).catch((e) => {
      res.status(500).json({ error: `while uploading to storage` });
      console.log(e);
      return { model: "", thumbnail: "", modelInfo: {}, totalSize: 0 };
    });
    if (!modelName && !res.writableEnded) {
      res.status(400).json({ error: ".gltf or .glb file is missing" });
      return;
    }
    const form: UploadForm = JSON.parse(formidable.fields.form as string);

    await prismaClient.model
      .create({
        data: {
          id: uuid,
          name: form.name,
          category: form.category,
          tags: form.tag?.split(" ") ?? [],
          description: form.description,
          thumbnail: thumbnail,
          modelFile: modelName,
          userId: user.id,
          modelInfo: JSON.stringify(modelInfo),
          modelSize: totalSize.toString() ?? "",
        },
      })
      .catch((e) => {
        res.status(500).json({ error: "while updating db" });
        deleteS3Files(uuid);
        console.log(e);
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
  const thumbnailSrc = model.thumbnail
    ? `/getResource/models/${model.id}/${model.thumbnail}`
    : "";
  return {
    ...model,
    modelSrc: `/getResource/models/${model.id}/${model.modelFile}`,
    thumbnailSrc,
  };
};

const makeModelInfos: (models: Model[]) => ModelInfo[] = (models) =>
  models.map((model) => makeModelInfo(model));

// FOR RESPONE TO POST

const extractZipThenSendToS3 = async (
  uuid: string,
  formidable: FormidableResult
): Promise<{
  model: string;
  thumbnail: string;
  modelInfo: object;
  totalSize: number;
}> => {
  const fileInfo = await getFileInfo(formidable.files);
  const filePath = `/tmp/${uuid}`;
  let res = { model: "", thumbnail: "", modelInfo: {}, totalSize: 0 };
  await extract(fileInfo.path, { dir: filePath });
  res.totalSize = await dirSize(filePath);
  rename(fileInfo.path, join(filePath, "model.zip"), (err) => {
    if (err) throw err;
  });
  await Promise.all(
    (
      await getFilesPath(filePath)
    ).map((file) => {
      const type = path.extname(file);
      if ([".gltf", ".glb"].includes(type)) {
        res.model = path.basename(file);
        const asset = readFileSync(file);
        validateBytes(new Uint8Array(asset))
          .then((report: object) => {
            res.modelInfo = report;
          })
          .catch((e: any) => {
            console.log(e);
          });
      }
      if ([".png"].includes(type)) {
        res.thumbnail = path.basename(file);
      }
      const stream = createReadStream(file);
      const filesParams = {
        Bucket: process.env.S3_BUCKET,
        Key: join(`models/${uuid}`, path.relative(filePath, file)),
        Body: stream,
      };
      return s3client.send(new PutObjectCommand(filesParams));
    })
  );
  return res;
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

const dirSize: (dir: string) => Promise<number> = async (dir: string) => {
  const files = await readdir(dir, { withFileTypes: true });

  const paths = files.map(async (file) => {
    const path = join(dir, file.name);

    if (file.isDirectory()) return await dirSize(path);

    if (file.isFile()) {
      const { size } = await stat(path);

      return size;
    }

    return 0;
  });

  return (await Promise.all(paths))
    .flat(Infinity)
    .reduce((i, size) => i + size, 0);
};
