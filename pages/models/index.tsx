import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { ModelInfo } from "@customTypes/model";
import { useModelInfos } from "@libs/client/AccessDB";
import type { NextPage } from "next";
import { useState } from "react";

export interface ModelInfos {
  loading: boolean,
  data: ModelInfo[] | undefined,
  error: any
}

const ModelsMainPage: NextPage = () => {
  const [models, setModels] = useState<ModelInfos>()
  const modelsInfos = useModelInfos();

  return (

    <Wrapper>
      <SearchBar setModels={setModels} />
      <Thumbnails loading={models ? models?.loading ?? false : modelsInfos.loading} modelInfos={models ? models?.data ?? [] : modelsInfos.data} />
    </Wrapper>
  );
};

export default ModelsMainPage;
