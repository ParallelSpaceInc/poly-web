import { Model, ModelCategory } from "@prisma/client";
export interface ModelInfo extends Model {
  modelSrc: string;
  thumbnailSrc: string;
  usdzSrc: string;
  [key: string]: any;
}

export type UploadForm = {
  name: string;
  description?: string | null;
  category: ModelCategory;
  tag?: string;
};

export declare module ValidatorInfo {
  export interface Message {
    code: string;
    message: string;
    severity: number;
    pointer: string;
  }

  export interface Issues {
    numErrors: number;
    numWarnings: number;
    numInfos: number;
    numHints: number;
    messages: Message[];
    truncated: boolean;
  }

  export interface Resource {
    pointer: string;
    mimeType: string;
    storage: string;
    byteLength: number;
  }

  export interface Info {
    version: string;
    generator: string;
    resources: Resource[];
    animationCount: number;
    materialCount: number;
    hasMorphTargets: boolean;
    hasSkins: boolean;
    hasTextures: boolean;
    hasDefaultScene: boolean;
    drawCallCount: number;
    totalVertexCount: number;
    totalTriangleCount: number;
    maxUVs: number;
    maxInfluences: number;
    maxAttributes: number;
  }

  export interface RootObject {
    mimeType: string;
    validatorVersion: string;
    validatedAt: Date;
    issues: Issues;
    info: Info;
  }
}

type NotRequired<T> = {
  [P in keyof T]+?: T[P];
};

export type OptionalModel = NotRequired<Model>;

export type Comment = {
  id: number;
  profileUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  text: string;
  userName: string;
};

const siteTextIds = [
  "title",
  "mainPageGuideHead",
  "mainPageGuideBody1",
  "mainPageGuideBody2",
  "mainPageGuideBody3",
] as const;

const siteConfigIds = ["showCaseModelId"] as const;

export type SiteTextProps = {
  [props in typeof siteTextIds[number]]: string;
};

export type SiteConfigProps = {
  [props in typeof siteConfigIds[number]]: string;
};
