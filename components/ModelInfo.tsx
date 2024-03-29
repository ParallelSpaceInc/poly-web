import { useModelInfo } from "@libs/client/AccessDB";
import { AddUnit } from "@libs/client/Util";

const ModelInfo = ({ modelId }: { modelId: string }) => {
  const model = useModelInfo(modelId);
  return (
    <div className="flex justify-start p-3 space-x-5">
      <div className="flex flex-col text-sm">
        <div className="m-auto text-gray-500">Vertices:</div>
        <div className="m-auto text-gray-500 font-bold text-sm">
          {AddUnit(model.data?.modelVertex) ?? "unknown"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto text-gray-500 text-sm">Triangles:</div>
        <div className="m-auto text-gray-500 font-bold text-sm">
          {AddUnit(model.data?.modelTriangle) ?? "unknown"}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-auto text-gray-500 text-sm">Model Size:</div>
        <div className="m-auto text-gray-500 font-bold text-sm">
          {AddUnit(model.data?.modelSize) + "B" ?? "unknown"}
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
