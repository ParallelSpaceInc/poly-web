import ModelModal from "@components/ModalModal";
import { useModelInfo, useUser } from "@libs/client/AccessDB";
import type { NextPage } from "next";
import { useRouter } from "next/router";

interface ModelElemet extends Element {
  showPoster: () => void;
  dismissPoster: () => void;
}

const ModelPage: NextPage = () => {
  const router = useRouter();
  const modelId = (router.query.id as string) ?? "";
  const modelInfo = useModelInfo(modelId);
  const user = useUser();

  if (modelInfo.error || user.error) {
    router.push("/");
    return null;
  }
  if (!modelInfo.data) {
    return null;
  }

  return (
    <ModelModal
      closeCallback={() => {}}
      modelId={modelId}
      pageMode={true}
    ></ModelModal>
  );
};

export const increaseView = (modelId: string) => {
  fetch(`/api/models/${modelId}?view=true`, {
    method: "POST",
  });
};

export default ModelPage;
