import Thumbnails from "@components/Thumbnails";
import Wrapper from "@components/Wrapper";
import { useModelInfos, useUser } from "@libs/client/AccessDB";

function UserPage() {
  const user = useUser();
  const modelInfos = useModelInfos({ uploader: user.data?.id });
  if (user.loading || modelInfos.loading) return;

  return (
    <Wrapper>
      <h1 className="text-2xl">내가 올린 모델들</h1>
      <div className="mt-10 bg-slate-500 h-0.5" />
      <Thumbnails loading={false} modelInfos={modelInfos.data}></Thumbnails>
    </Wrapper>
  );
}

export default UserPage;
