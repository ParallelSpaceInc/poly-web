import { Model } from "@prisma/client";
export interface ModelInfo extends Model {
  modelSrc: string;
  thumbnailSrc: string;
}
