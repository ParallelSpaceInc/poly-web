import { ModelInfo } from "@customTypes/model";
import { hasRight } from "@libs/server/Authorization";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

const ModelPage: NextPage = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  useEffect(() => {
    if (!router.query.id) return;
    setId(router.query.id as string);
  }, [router.query.id]);
  const { data: modelInfos, error } = useSWR<ModelInfo[]>(
    `/api/models?id=${id}`,
    (url) => fetch(url).then((res) => res.json())
  );
  const { data: user } = useSWR<User>(`/api/users`, (url) =>
    fetch(url).then((res) => res.json())
  );

  const loading = !modelInfos && !error;
  const modelInfo = modelInfos?.[0];
  if (error) {
    router.push("/");
    return null;
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
        <span className="block text-lg mt-6 md:text-xl lg:text-xl text-slate-600">
          {!loading ? `Category > ${modelInfo.category}` : ""}
        </span>
        <span className="block mt-10 text-slate-500 text-sm md:text-lg lg:text-xl">
          {!loading ? modelInfo.description : ""}
        </span>
        <p className="my-2 max-w-3xl mr-auto bg-slate-100 p-2 text-slate-500 text-xs md:text-base max-h-64 overflow-y-auto"></p>
        <div className="flex space-x-3 mt-10 ">
          {hasRight({ method: "delete", theme: "model" }, user, modelInfo) ? (
            <button
              onClick={() => callDeleteAPI(id, router)}
              className="m-auto bg-slate-400 h-10"
            >
              delete
            </button>
          ) : null}
          {hasRight({ method: "read", theme: "model" }, user, modelInfo) ? (
            <button
              onClick={() => {
                router.push(`/getResource/models/${id}/model.zip`);
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
