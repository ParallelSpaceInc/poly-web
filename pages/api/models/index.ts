import { ModelInfo } from "@customTypes/model";
import { NextApiRequest, NextApiResponse } from "next";

const makeModelInfo: (id: number, name: string) => ModelInfo = (id, name) => ({
  id,
  name,
  modelSrc: `/getResource/models/${id}/scene.gltf`,
  thumbnailSrc: `/getResource/models/${id}/thumbnail.png`,
});

const modelList: ModelInfo[] = Array.from(Array(100).keys()).map((key) =>
  makeModelInfo(key, `Model Sample ${key}`)
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(modelList);
}
