import { Model, ModelCategory } from "@prisma/client";
export interface ModelInfo extends Model {
  modelSrc: string;
  thumbnailSrc: string;
}

export type UploadForm = {
  name: string;
  description: string;
  category: ModelCategory;
  tag?: string;
};
