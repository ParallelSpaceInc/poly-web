import { Model, ModelCategory } from "@prisma/client";
export interface ModelInfo extends Model {
  modelSrc: string;
  thumbnailSrc: string;
  usdzSrc: string;
  [key: string]: any;
}

export type UploadForm = {
  name: string;
  description: string;
  category: ModelCategory;
  tag?: string;
};

export type Comment = {
  id: number;
  profileUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  userName: string;
};
