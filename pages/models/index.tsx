import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { useModelInfos } from "@libs/client/AccessDB";
import type { NextPage } from "next";

const ModelsMainPage: NextPage = () => {
  const models = useModelInfos();
  return (
    <Wrapper>
      <SearchBar />
      <Thumbnails loading={models.loading} modelInfos={models.data} />
    </Wrapper>
  );
};

export default ModelsMainPage;
