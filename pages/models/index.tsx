import MainPageShowcase from "@components/MainPageShowcase";
import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { ModelInfo } from "@customTypes/model";
import { useModelInfos, useSiteConfig } from "@libs/client/AccessDB";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

  const { data: { config } = {} } = useSiteConfig();
  const { data: [mainModel] = [null] } = useModelInfos({
    id: config?.showCaseModelId,
  });
  return (
    <Wrapper>
      {config?.isShowcaseVisible === "true" ? (
        <MainPageShowcase modelInfo={mainModel} />
      ) : null}
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
