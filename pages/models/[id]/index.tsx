import Wrapper from "@components/Wrapper";
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
    <Wrapper>
      <input
        className="p-1 pl-3 lg:text-3xl border-2 rounded-md border-slate-500 border-spacing-2 w-full"
        placeholder="Find model"
      ></input>
      <span className="block text-2xl mt-4 md:text-3xl lg:text-4xl">
        {!model.loading ? model.data.name : ""}
      </span>
      <div className="block my-10 sm:grid sm:grid-cols-3 gap-x-4 gap-y-8">
        <div className="aspect-[4/3] w-full col-span-2 max-w-5xl mx-auto mt-8">
          {/* <div className="relative min-w-full min-h-full col-span-2"> */}
          {!model.loading ? <Model info={model.data} /> : "Loading..."}
        </div>
        <div className="flex flex-col space-y-3 mt-10 ">
          {hasRight(
            { method: "read", theme: "model" },
            user.data,
            model.data
          ) ? (
            <button
              onClick={() => {
                router.push(`/api/models/${modelId}`);
              }}
              className=" text-white bg-slate-700 h-10"
            >
              download
            </button>
          ) : null}
          {hasRight(
            { method: "update", theme: "model" },
            user.data,
            model.data
          ) ? (
            <button
              onClick={() => router.push(`/models/${modelId}/update`)}
              className=" text-white bg-slate-700 h-10"
            >
              modify
            </button>
          ) : null}
          {hasRight(
            { method: "delete", theme: "model" },
            user.data,
            model.data
          ) ? (
            <button
              onClick={() => callDeleteAPI(modelId, router)}
              className=" text-white bg-red-500 h-10"
            >
              delete
            </button>
          ) : null}
        </div>
      </div>

      <span className="block text-lg mt-6 md:text-xl lg:text-xl text-slate-600">
        {!model.loading ? `Category > ${model.data.category}` : ""}
      </span>
      <span className="block mt-10 text-slate-500 text-md md:text-lg lg:text-xl">
        {!model.loading ? model.data.description : ""}
      </span>
    </Wrapper>
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
