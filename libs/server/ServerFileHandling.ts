import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ValidatorInfo } from "@customTypes/model";
import s3client from "@libs/server/s3client";
import { Model } from "@prisma/client";

import extract from "extract-zip";
import formidable from "formidable";
import {
  createReadStream,
  readdirSync,
  readFileSync,
  rename,
  statSync,
} from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { validateBytes } from "gltf-validator";
import path, { join } from "path";

type FormidableResult = {
  err: string;
  fields: formidable.Fields;
  files: formidable.Files;
};

//

// devide multiple request and not multiple request -> [form, formidable.Files(Array)]

// for each upload requirement -----------------------

// param : form(about model)?, formidable.File

// 0. generate uuid

// 0. update Model from form. do nothing if undefined. (name, tags, description, category)

// 1. extractZip (name)
export async function extractZip(
  uuid: string,
  formidableFiles: formidable.Files
) {
  const fileInfo = await getFileInfo(formidableFiles);
  if (path.extname(fileInfo.loadedFile) !== ".zip") {
    throw Error("File is not .zip");
  }
  const newPath = `/tmp/${uuid}`;
  const filenameWithoutExt = trimExt(fileInfo.originalName);
  const newZipPath = join(newPath, "model.zip");
  await extract(fileInfo.loadedFile, { dir: newPath });
  rename(fileInfo.loadedFile, newZipPath, (err) => {
    if (err) throw err;
  });
  const zipSize = statSync(newZipPath).size;
  return { newPath, filenameWithoutExt, zipSize };
}
// name, zipSize

type NotRequired<T> = {
  [P in keyof T]+?: T[P];
};

type OptionalModel = NotRequired<Model>;

function trimExt(name: string) {
  if (!name.includes(".")) {
    return name;
  }
  return name.split(".").slice(0, -1).join(".");
}

// 2-1 Update Model from dir (vertex, triangle, gltf length)
export async function getGltfInfo(
  gltf: string
): Promise<ValidatorInfo.Resource> {
  const asset = readFileSync(gltf);
  return validateBytes(new Uint8Array(asset))
    .then((report: ValidatorInfo.RootObject) => {
      return report;
    })
    .catch((e: any) => {
      throw e;
    });
}
// vertex=, tri, model size

// 2-2 update Model from dir (name, thumbnail. usdz, usdzSize, zipSize, description)
export async function getModelFromDir(dirPath: string): Promise<OptionalModel> {
  let model: OptionalModel = {};
  const files = await getFilesPath(dirPath);
  files.forEach(async (file) => {
    const relativeFileName = path.relative(dirPath, file);
    if (["scene.gltf", "scene.glb"].includes(relativeFileName)) {
      model.modelFile = relativeFileName;
    }
    if ("thumbnail.png" === relativeFileName) {
      model.thumbnail = relativeFileName;
    }
    if ("scene.usdz" === relativeFileName) {
      model.modelUsdz = relativeFileName;
      model.usdzSize = BigInt(statSync(file).size);
    }
    if ("description.txt" === relativeFileName) {
      model.description = await readTextFile(file);
    }
  });
  return model;
}
//name??=, thum??= ...

//update if not exist
export function updateModel(target: OptionalModel, newObject: OptionalModel) {
  return Object.assign(newObject, target);
}
//

// 3 chech Model requirement
export function checkModel(model: OptionalModel) {
  if (model.category) {
    throw Error("category is not exist");
  }
  if (model.id) {
    throw Error("model is not exist");
  }
  if (model.name) {
    throw Error("name is not exist");
  }
}

// 4-a update db
// use prisma code

// 4-b sendToS3
export async function uploadModelToS3(dirPath: string, res: Model) {
  await Promise.all(
    (
      await getFilesPath(dirPath)
    ).map((file) => {
      const stream = createReadStream(file);
      const filesParams = {
        Bucket: process.env.S3_BUCKET,
        Key: join(`models/${res.id}`, path.relative(dirPath, file)),
        Body: stream,
      };
      return s3client.send(new PutObjectCommand(filesParams));
    })
  );
}

function readTextFile(textFile: string) {
  const buffer = readFile(textFile, { encoding: "utf-8" });
  return buffer;
}

const getFileInfo = (fileData: formidable.Files) => {
  if (typeof fileData === "string") {
    return Promise.reject("Can't find uploaded file");
  }
  if (fileData.file instanceof Array) {
    throw Promise.reject("Can't resolve multiple files");
  }
  const parsed = fileData.file.toJSON();
  return Promise.resolve({
    originalName: parsed.originalFilename ?? "noName",
    loadedFile: parsed.filepath,
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

// useless for now.
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
