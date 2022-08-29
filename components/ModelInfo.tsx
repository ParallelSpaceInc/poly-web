import { useModelInfo } from "@libs/client/AccessDB";

const ModelInfo = ({ modelId }: { modelId: string }) => {
  const model = useModelInfo(modelId);
  const gltfInfo: any = JSON.parse((model.data?.modelInfo as string) ?? "{}");
  return (
    <div className="flex justify-start p-3 space-x-5">
      <div className="flex flex-col">
        <div className="m-auto text-lg">vertexCount</div>
        <div className="m-auto">
          {gltfInfo?.info?.totalVertexCount ?? "unknown"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto text-lg">triangleCount</div>
        <div className="m-auto">
          {gltfInfo?.info?.totalTriangleCount ?? "unknown"}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
