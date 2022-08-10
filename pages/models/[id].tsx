import { ModelInfo } from "@customTypes/model";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

const ModelPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: modelInfos, error } = useSWR<ModelInfo[]>(
    `/api/models?${id}`,
    (url) => fetch(url).then((res) => res.json())
  );

  const loading = !modelInfos && !error;
  const modelInfo = modelInfos?.[0];
  if (error) {
    router.push("/");
    return;
  }
  if (!modelInfo) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 mt-10 relative w-full px-6 mx-auto max-w-7xl lg:px-8">
        <input
          className="p-1 pl-3 lg:text-3xl border-2 rounded-md border-slate-500 border-spacing-2 w-full"
          placeholder="Find model"
        ></input>
        <div className="aspect-[4/3] w-full max-w-5xl mx-auto mt-8">
          {!loading ? <Model info={modelInfo} /> : "Loading..."}
        </div>
        <span className="block text-2xl mt-4 md:text-3xl lg:text-4xl">
          {!loading ? modelInfo.name : ""}
        </span>
        <span className="block mt-2 text-slate-500 text-sm md:text-lg lg:text-xl">
          {!loading ? modelInfo.description : ""}
        </span>
        <p className="my-2 max-w-3xl mr-auto bg-slate-100 p-2 text-slate-500 text-xs md:text-base max-h-64 overflow-y-auto"></p>
      </div>
    </div>
  );
};

export default ModelPage;
