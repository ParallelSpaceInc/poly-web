import { useModelInfo, useUser } from "@libs/client/AccessDB";
import { hasRight } from "@libs/server/Authorization";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

const ModelPage: NextPage = () => {
  const router = useRouter();
  const modelId = (router.query.id as string) ?? "";
  const model = useModelInfo(modelId);
  const user = useUser();
  if (model.error || user.error) {
    router.push("/");
    return null;
  }
  if (!model.data) {
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
          {!model.loading ? <Model info={model.data} /> : "Loading..."}
        </div>
        <span className="block text-2xl mt-4 md:text-3xl lg:text-4xl">
          {!model.loading ? model.data.name : ""}
        </span>
        <span className="block text-lg mt-6 md:text-xl lg:text-xl text-slate-600">
          {!model.loading ? `Category > ${model.data.category}` : ""}
        </span>
        <span className="block mt-10 text-slate-500 text-sm md:text-lg lg:text-xl">
          {!model.loading ? model.data.description : ""}
        </span>
        <p className="my-2 max-w-3xl mr-auto bg-slate-100 p-2 text-slate-500 text-xs md:text-base max-h-64 overflow-y-auto"></p>
        <div className="flex space-x-3 mt-10 ">
          {hasRight(
            { method: "delete", theme: "model" },
            user.data,
            model.data
          ) ? (
            <button
              onClick={() => callDeleteAPI(modelId, router)}
              className="m-auto bg-slate-400 h-10"
            >
              delete
            </button>
          ) : null}
          {hasRight(
            { method: "read", theme: "model" },
            user.data,
            model.data
          ) ? (
            <button
              onClick={() => {
                router.push(`/getResource/models/${modelId}/model.zip`);
              }}
              className="m-auto bg-slate-400 h-10"
            >
              download
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const callDeleteAPI = (id: string, router: NextRouter) => {
  fetch(`/api/models/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw res.json();
      }
      router.push(`/models`);
    })
    .catch((error) => {
      alert(`error : ${error.message}`);
    });
};

export default ModelPage;
