import SearchBar from "@components/Search";
import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { ModelInfo } from "@customTypes/model";
import type { NextPage } from "next";
import useSWR from "swr";

const ModelsMainPage: NextPage = () => {
  const { data: modelInfos, error } = useSWR<ModelInfo[]>(
    "/api/models",
    (url) => fetch(url).then((res) => res.json())
  );

  const loading = !modelInfos && !error;
  return (
    <Wrapper>
      <SearchBar />
      <Thumbnails loading={loading} modelInfos={modelInfos} />
    </Wrapper>
  );
};

export default ModelsMainPage;
