import { S3Client } from '@aws-sdk/client-s3';

const id = String(process.env.S3_KEY_ID);
const key = String(process.env.S3_KEY);
const region = String(process.env.S3_REGION);

const s3Client = new S3Client({
  credentials: {
    accessKeyId: id,
    secretAccessKey: key,
  },
  region: region,
});

export default s3Client;
