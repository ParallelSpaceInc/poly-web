import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { ModelInfo } from "@customTypes/model";
import { useModelInfos } from "@libs/client/AccessDB";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const Model = dynamic(() => import("@components/Model"), { ssr: false });
export interface ModelInfos {
  loading: boolean;
  data: ModelInfo[] | undefined;
  error: any;
}

const ModelsMainPage: NextPage = () => {
  const [models, setModels] = useState<ModelInfos>();
  const modelsInfos = useModelInfos();
  const session = useSession();
  const devMode =
    session.data?.role === "ADMIN" || session.data?.role === "DEVELOPER";
  const { data: [mainModel] = [null] } = useModelInfos({
    id: "5979780b-ca07-4087-bd09-e1b4935a4b5f",
  });
  return (
    <Wrapper>
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
        {mainModel ? <Model info={mainModel}></Model> : null}
      </div>
      <SearchBar setModels={setModels} />
      {models?.error ? (
        <div className="w-full rounded-md h-96 border-2 mt-5 flex justify-center items-center">
          <div className="text-gray-400 font-bold md:text-lg text-sm">
            {models.error}
          </div>
        </div>
      ) : (
        <Thumbnails
          loading={models ? models?.loading ?? false : modelsInfos.loading}
          modelInfos={models ? models?.data ?? [] : modelsInfos.data}
          devMode={devMode}
        />
      )}
    </Wrapper>
  );
};

export default ModelsMainPage;
