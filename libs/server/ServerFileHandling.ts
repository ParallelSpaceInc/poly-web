import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3client from "@libs/server/s3client";

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
import path, { join } from "path";

type FormidableResult = {
  err: string;
  fields: formidable.Fields;
  files: formidable.Files;
};
export const extractZipThenSendToS3 = async (
  uuid: string,
  formidable: FormidableResult
): Promise<{
  model: string;
  thumbnail: string;
  modelInfo: object;
  totalSize: number;
  modelUsdz: string;
}> => {
  const fileInfo = await getFileInfo(formidable.files);
  const filePath = `/tmp/${uuid}`;
  let res = {
    model: "",
    thumbnail: "",
    modelInfo: {},
    totalSize: 0,
    modelUsdz: "",
  };
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
      const filename = path.extname(file);
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
      if ("thumbnail.png" === filename) {
        res.thumbnail = "thumbnail.png";
      }
      if ([".usdz"].includes(type)) {
        res.modelUsdz = path.basename(file);
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
