import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { ModelInfo, UploadForm } from "@customTypes/model";
import { hasRight } from "@libs/server/Authorization";
import prismaClient from "@libs/server/prismaClient";
import s3client from "@libs/server/s3client";
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

const modelNames = [
  "국보7 천안 봉선홍경사 갈기비",
  "국보275 도기 기마인물형 뿔잔",
  "보물111호 개선사 지석등",
  "보물622 천마총 자루솥",
  "보물846 창경궁 풍기대",
  "보물643 금동미륵보살반가사유상",
  "보물785 백자 청화운룡문 병",
  "보물1449 청자 기린모양 연적",
  "보물1167 청주운천동 출토 동종",
  "보물536 아산 평촌리 석조약사여래입상",
  "보물789 청자 쌍사자형 베개",
  "해태 조각상",
];

const allowedMethod = ["GET", "POST"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getSession({ req });
  if (!allowedMethod.includes(req.method ?? "")) {
    res.status(405).end();
    return;
  }
  if (req.method == "GET") {
    // send first 30 model info
    const modelList = await prismaClient.model.findMany({ take: 30 });
    const parsedList = makeModelInfos(modelList);
    res.status(200).json(parsedList);
  } else if (req.method == "POST") {
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
      !hasRight({
        body: {
          requester: user,
        },
        operation: {
          theme: "model",
          method: "create",
        },
      })
    ) {
      res.status(403).end();
      return;
    }

    // upload to s3
    const uuid = randomUUID();
    const formidable = await getFormidableFileFromReq(req);
    await extractZipThenSendToS3(uuid, formidable).catch((e) => {
      res.status(500).json({ error: "while uploading to storage" });
      console.warn(e);
      return;
    });
    const form: UploadForm = JSON.parse(formidable.fields.form as string);

    await prismaClient.model
      .create({
        data: {
          id: uuid,
          name: form.name,
          category: form.category,
          tags: form.tag ?? "",
          description: form.description,
          userId: user.id,
        },
      })
      .catch((e) => {
        res.status(500).json({ error: "while updating db" });
        console.warn(e);
        deleteS3Files(uuid);
        return;
      });
    res
      .setHeader("Location", "/models")
      .status(303)
      .json({ message: "업로드에 성공하였습니다." });
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

const deleteS3Files = async (uuid: string) => {
  const objects = await s3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Prefix: `models/${uuid}`,
    })
  );
  console.log(objects);
  if (!objects.Contents) return Promise.reject("Can't find target.");
  Promise.all(
    objects.Contents.map((file) =>
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: file.Key,
        })
      )
    )
  );
};

const getFormidableFileFromReq = async (req: NextApiRequest) => {
  return await new Promise<FormidableResult>((res, rej) => {
    const form = formidable({
      multiples: true,
      maxFieldsSize: 5 << 20, // 5MB
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
