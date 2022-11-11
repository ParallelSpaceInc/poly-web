import MainPageShowcase from "@components/MainPageShowcase";
import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { ModelInfo } from "@customTypes/model";
import { useModelInfos } from "@libs/client/AccessDB";
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
  const { data: [mainModel] = [null] } = useModelInfos({
    id: "5979780b-ca07-4087-bd09-e1b4935a4b5f",
  });

  return (
    <Wrapper>
      <MainPageShowcase modelInfo={mainModel} />
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
