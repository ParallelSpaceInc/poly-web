import { useModelInfo } from "@libs/client/AccessDB";
import { AddUnit } from "@libs/client/Util";

const ModelInfo = ({ modelId }: { modelId: string }) => {
  const model = useModelInfo(modelId);
  const gltfInfo: any = JSON.parse((model.data?.modelInfo as string) ?? "{}");
  return (
    <div className="flex justify-start p-3 space-x-5">
      <div className="flex flex-col">
        <div className="m-auto text-lg">Vertex Count</div>
        <div className="m-auto ">
          {AddUnit(gltfInfo?.info?.totalVertexCount) ?? "unknown"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto text-lg ">Triangle Count</div>
        <div className="m-auto">
          {AddUnit(gltfInfo?.info?.totalTriangleCount) ?? "unknown"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto text-lg">Model Size</div>
        <div className="m-auto">
          {AddUnit(model.data?.modelSize) + "B" ?? "unknown"}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
