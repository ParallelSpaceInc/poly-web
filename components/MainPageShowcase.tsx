import { ModelInfo } from "@customTypes/model";
import dynamic from "next/dynamic";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

type Props = {
  modelInfo?: ModelInfo | null;
};

const MainPageShowcase = ({ modelInfo }: Props) => {
  return (
    <div
      id="main-showcase"
      className="hidden md:grid md:grid-cols-3 md:h-60 lg:h-80  bg-gradient-to-r from-gray-800 via-gray-500/50 to-white/0 mb-10 rounded-lg"
    >
      <div className="col-span-2 text-white p-8">
        <span className="block md:text-2xl mb-3">
          안녕하세요. 폴리에 어서오세요.
        </span>
        <div className="[&>span]:block [&>span]:text-lg pl-3 text-gary space-y-3">
          <span>✓ 고품질의 3D 모델 체험</span>
          <span>✓ AR을 사용한 증강현실 뷰</span>
          <span>✓ 3D 모델 업로드와 다운로드</span>
        </div>
      </div>
      {modelInfo ? <Model info={modelInfo}></Model> : null}
    </div>
  );
};

export default MainPageShowcase;
