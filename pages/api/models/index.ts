import { ModelInfo } from "@customTypes/model";
import prismaClient from "@libs/server/prismaClient";
import { Model } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

const makeModelInfo: (model: Model) => ModelInfo = (model) => {
  return {
    ...model,
    modelSrc: `/getResource/models/${model.id}/scene.gltf`,
    thumbnailSrc: `/getResource/models/${model.id}/thumbnail.png`,
  };
};

const makeModelInfos: (models: Model[]) => ModelInfo[] = (models) =>
  models.map((model) => makeModelInfo(model));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  const modelList = await prismaClient.model.findMany();
  const parsedList = makeModelInfos(modelList);

  res.status(200).json(parsedList);
}
