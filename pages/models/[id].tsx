import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

const ModelPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex bg-blue-900 h-10 p-2.5"></div>
      <div className="mx-8 space-y-2">
        <input
          className="p-1 pl-3 border-2 rounded-md border-blue-900 border-spacing-2 w-full"
          placeholder="모델명 검색"
        ></input>
        <div className="h-64">
          <Model />
        </div>
        <span className="block text-2xl mt-4">{id}</span>
        <span className="text-slate-500 text-sm">카테고리 {">"} 국보</span>
        <p className="text-slate-500 text-xs max-h-32 overflow-y-scroll">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non nibh
          eleifend, fringilla massa eget, placerat nisl. Morbi lectus erat,
          tristique in euismod eu, faucibus sed neque. Maecenas aliquam pharetra
          dictum. Suspendisse eu dignissim est, id euismod libero. In
          sollicitudin, orci id lobortis luctus, libero leo hendrerit quam, eu
          vestibulum nunc sem a risus. Morbi lacus libero, rhoncus quis arcu
          eget, pharetra feugiat metus. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Pellentesque
          consequat sed mi nec accumsan. Nunc gravida condimentum risus nec
          facilisis. Cras risus tortor, consequat non consectetur non, aliquam
          non augue. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Mauris consequat metus vitae est
          tempor placerat. Praesent justo orci, sagittis ut lacus id, hendrerit
          blandit tortor. Quisque non condimentum nisi. Duis pretium erat odio,
          in lobortis arcu luctus id. In blandit nisl nec erat aliquet pulvinar.
        </p>
      </div>
    </div>
  );
};

export default ModelPage;
