import { PutObjectCommand } from "@aws-sdk/client-s3";
import { OptionalModel, UploadForm, ValidatorInfo } from "@customTypes/model";
import s3client, { deleteS3Files } from "@libs/server/s3client";
import { randomUUID } from "crypto";

import extract from "extract-zip";
import formidable from "formidable";
import {
  createReadStream,
  readdirSync,
  readFileSync,
  renameSync,
  statSync
} from "fs";
import { readdir, readFile, stat } from "fs/promises";
import { validateBytes } from "gltf-validator";
import path from "path";
import pathPosix from "path/posix";

type FormidableResult = {
  err: string;
  fields: formidable.Fields;
  files: formidable.Files;
};

//

export async function handlePOST(
  file: formidable.File,
  original: OptionalModel
) {
  const model = Object.assign({}, original);
  const uuid = randomUUID();
  model.id = uuid;
  const extRes = await extractZip(uuid, file);
  model.name ??= trimExt(extRes.filename);
  model.zipSize = BigInt(extRes.zipSize);
  updateModel(model, await getModelFromDir(extRes.newDirPath));
  updateModel(
    model,
    await getModelFromGltfReport(
      await getGltfInfo(
        path.join(extRes.newDirPath, model.modelFile ?? "Error")
      )
    )
  );
  checkModel(model);
  uploadModelToS3(extRes.newDirPath, uuid);
  updatePrismaDB(model).catch((e) => {
    deleteS3Files(uuid);
    throw "Failed while updateDB";
  });
}
// devide multiple request and not multiple request -> [form, formidable.Files(Array)]

// for each upload requirement -----------------------

// param : form(about model)?, formidable.File

// 0. generate uuid

// 0. update Model from form. do nothing if undefined. (name, tags, description, category)
export function getModelFromForm(form: UploadForm): OptionalModel {
  return {
    category: form.category,
    description: form.description,
    tags: form.tag,
    name: form.name,
  };
}

export function makeMaybeArrayToArray<T>(target: T | T[]) {
  if (!(target instanceof Array)) {
    return [target];
  } else {
    return target;
  }
}

// 1. extractZip (name)
export async function extractZip(
  uuid: string,
  formidableFile: formidable.File
) {
  const fileInfo = await getOriginalNameAndPath(formidableFile);
  if (path.extname(fileInfo.loadedFile) !== ".zip") {
    throw Error("File is not .zip");
  }
  const newDirPath = `/tmp/${uuid}`;
  const filename = fileInfo.originalName;
  const newZipPath = path.join(newDirPath, "model.zip");
  await extract(fileInfo.loadedFile, { dir: newDirPath });
  renameSync(fileInfo.loadedFile, newZipPath);
  const zipSize = await stat(newZipPath).then((res) => res.size);
  return { newDirPath, filename, zipSize };
}
// name, zipSize

// 2-1 Update Model from dir (vertex, triangle, gltf length)
export async function getGltfInfo(
  gltf?: string | undefined
): Promise<ValidatorInfo.RootObject> {
  if (!gltf) {
    throw Error("Model Path is not found.");
  }
  const asset = readFileSync(gltf);
  return validateBytes(new Uint8Array(asset)).then(
    (report: ValidatorInfo.RootObject) => {
      return report;
    }
  );
}
// vertex=, tri, model size

export async function getModelFromGltfReport(
  report: ValidatorInfo.RootObject
): Promise<OptionalModel> {
  return {
    modelTriangle: BigInt(report.info.totalTriangleCount),
    modelVertex: BigInt(report.info.totalVertexCount),
  };
}

// 2-2 update Model from dir (name, thumbnail. usdz, usdzSize, zipSize, description)
export async function getModelFromDir(dirPath: string): Promise<OptionalModel> {
  let model: OptionalModel = {};
  let modelSize = 0;
  const files = await getFilesPath(dirPath);
  await Promise.all(
    files.map(async (file) => {
      const relativeFileName = path.relative(dirPath, file);
      const fileSzie = statSync(file).size;
      modelSize += fileSzie;
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
      if ("model.zip" === relativeFileName) {
        modelSize -= fileSzie;
      }
    })
  );
  model.modelSize = BigInt(modelSize);
  return model;
}
//name??=, thum??= ...

//update if not exist
export function updateModel(
  target: OptionalModel,
  newObject: OptionalModel
): OptionalModel {
  target.id ??= newObject.id;
  target.category ??= newObject.category;
  target.description ??= newObject.description;
  target.modelFile ??= newObject.modelFile;
  target.modelSize ??= newObject.modelSize;
  target.modelTriangle ??= newObject.modelTriangle;
  target.usdzSize ??= newObject.usdzSize;
  target.modelVertex ??= newObject.modelVertex;
  target.name ??= newObject.name;
  target.tags ??= newObject.tags;
  target.thumbnail ??= newObject.thumbnail;
  return target;
}
//

//

// 3 chech Model requirement
export function checkModel(model: OptionalModel) {
  if (!model.category) {
    throw Error("category is not exist");
  }
  if (!model.id) {
    throw Error("modelId is not exist");
  }
  if (!model.name) {
    throw Error("name is not exist");
  }
  if (!model.userId) {
    throw Error("uploader is not exist");
  }
  if (!model.modelFile) {
    throw Error("ModelFile is not exist");
  }
  return model;
}

// 4-a update db
// use prisma code
export async function updatePrismaDB(model: OptionalModel) {
  if (!model.userId) throw Error("Cant find uploader id");
  await prismaClient.model.create({
    data: {
      name: model.name ?? "",
      category: model.category,
      description: model.description,
      id: model.id,
      userId: model.userId,
      modelFile: model.modelFile,
      modelVertex: model.modelVertex,
      modelTriangle: model.modelTriangle,
      zipSize: model.zipSize,
      modelUsdz: model.modelUsdz ?? undefined,
      usdzSize: model.usdzSize ?? undefined,
      thumbnail: model.thumbnail ?? undefined,
      modelSize: model.modelSize,
      tags: JSON.stringify(model.tags),
    },
  });
}

// 4-b sendToS3
export async function uploadModelToS3(dirPath: string, uuid: string) {
  await Promise.all(
    (
      await getFilesPath(dirPath)
    ).map((file) => {
      const stream = createReadStream(file);
      const filesParams = {
        Bucket: process.env.S3_BUCKET,
        Key: pathPosix.join(
          `models/${uuid}`,
          path.relative(dirPath, file)
        ),
        Body: stream,
      };
      return s3client.send(new PutObjectCommand(filesParams));
    })
  );
}

async function readTextFile(textFile: string) {
  const buffer = await readFile(textFile, { encoding: "utf-8" });
  return buffer;
}

const getOriginalNameAndPath = (fileData: formidable.File) => {
  const parsed = fileData.toJSON();
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

export function trimExt(name: string) {
  if (!name.includes(".")) {
    return name;
  }
  return name.split(".").slice(0, -1).join(".");
}

// useless for now.
const dirSize: (dir: string) => Promise<number> = async (dir: string) => {
  const files = await readdir(dir, { withFileTypes: true });

  const paths = files.map(async (file) => {
    const dirPath = path.join(dir, file.name);

    if (file.isDirectory()) return await dirSize(dirPath);

    if (file.isFile()) {
      const { size } = await stat(dirPath);

      return size;
    }

    return 0;
  });

  return (await Promise.all(paths))
    .flat(Infinity)
    .reduce((i, size) => i + size, 0);
};
