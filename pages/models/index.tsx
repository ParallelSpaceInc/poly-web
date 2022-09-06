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
  const [isClickSort, setIsClickSort] = useState<boolean>(false);
  const closeSortingModel = () => {
    setIsClickSort(false);
  }
  return (
    <div onClick={(e) => {
      if (e.target instanceof Element) {
        const isModalClicked = !!e.target.closest("#sorting");
        if (isModalClicked) {
          return;
        }
      }
      closeSortingModel();
    }}>
      <Wrapper>
        <SearchBar setModels={setModels} isClickSort={isClickSort} closeSortingModel={closeSortingModel} setIsClickSort={setIsClickSort} />
        <Thumbnails loading={models ? models?.loading ?? false : modelsInfos.loading} modelInfos={models ? models?.data ?? [] : modelsInfos.data} />
      </Wrapper>
    </div>

  );
};

export default ModelsMainPage;
