import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const id = String(process.env.S3_KEY_ID);
const key = String(process.env.S3_KEY);
const region = String(process.env.S3_REGION);

declare global {
  var s3Client: S3Client;
}

global.s3Client ??= new S3Client({
  credentials: {
    accessKeyId: id,
    secretAccessKey: key,
  },
  region: region,
});

export default global.s3Client;

export const getSavedModelList = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Prefix: `models/`,
    })
  );
  const modelUuids =
    objects.Contents?.reduce((prev, cur) => {
      prev.add(cur.Key?.split("/")[1] ?? cur.Key ?? "error");
      return prev;
    }, new Set<string>()) ?? new Set<string>();
  return modelUuids;
};

export const deleteS3Files = async (uuid: string) => {
  const objects = await s3Client.send(
    new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Prefix: `models/${uuid}`,
    })
  );
  if (!objects.Contents) throw "Can't find target.";
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

export const downloadS3Files = async (uuid: string, file = "model.zip") => {
  const objectBuffer = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `models/${uuid}/${file}`,
    })
  );
  return objectBuffer;
};
