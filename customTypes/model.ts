import { Model, ModelCategory } from "@prisma/client";
export interface ModelInfo extends Model {
  modelSrc: string;
  thumbnailSrc: string;
  usdzSrc: string;
}

export type UploadForm = {
  name: string;
  description: string;
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
