import Wrapper from "@components/Wrapper";
import { useModelInfo, useUser } from "@libs/client/AccessDB";
import { hasRight } from "@libs/server/Authorization";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

interface ModelElemet extends Element {
  showPoster: () => void;
  dismissPoster: () => void;
}

const ModelPage: NextPage = () => {
  const router = useRouter();
  const modelId = (router.query.id as string) ?? "";
  const modelInfo = useModelInfo(modelId);
  const user = useUser();
  const timer = useRef(Date.now());
  const [modelViewer, setModelViewer] = useState<ModelElemet>();
  const [isLogShown, setIsLogShown] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    // hook modelviewer elemet when loading is complete.
    const checker = setInterval(() => {
      const modelElem = document.querySelector("#modelViewer");
      if (modelElem) {
        setModelViewer(modelElem as ModelElemet);
        clearInterval(checker);
        return;
      }
    }, 50);
    return () => {
      if (!modelViewer) {
        clearInterval(checker);
      }
    };
  }, [modelViewer]);

  useEffect(() => {
    // when modelViewer founded
    const callback = (e: any) => {
      if (e.detail?.totalProgress === 1) {
        const spentTime = (Date.now() - timer.current) / 1000;

        setLogs((log) =>
          log.concat(`<system> : Loading spent ${spentTime} sec.`)
        );
      }
    };
    if (modelViewer) {
      modelViewer.addEventListener("progress", callback);
    }
    return () => {
      modelViewer?.removeEventListener("progress", callback);
    };
  }, [modelViewer]);

  if (modelInfo.error || user.error) {
    router.push("/");
    return null;
  }
  if (!modelInfo.data) {
    return null;
  }

  return (
    <Wrapper>
      <input
        className="p-1 pl-3 lg:text-3xl border-2 rounded-md border-slate-500 border-spacing-2 w-full"
        placeholder="Find model"
      ></input>
      <span className="block text-2xl mt-4 md:text-3xl lg:text-4xl">
        {!modelInfo.loading ? modelInfo.data.name : ""}
      </span>
      <div className="block my-10 sm:grid sm:grid-cols-3 gap-x-4 gap-y-8">
        <div className="relative aspect-[4/3] w-full col-span-2 max-w-5xl mx-auto mt-8">
          {isLogShown ? (
            <div className="absolute top-0 right-0 w-auto p-2 justify-start flex flex-col bg-opacity-20 bg-slate-700">
              {logs.map((log, index) => (
                <span key={index} className="flex justify-items-start mr-auto">
                  {log}
                </span>
              ))}
            </div>
          ) : null}
          {/* <div className="relative min-w-full min-h-full col-span-2"> */}
          {!modelInfo.loading ? <Model info={modelInfo.data} /> : "Loading..."}
          <button
            className="absolute bottom-0 right-5 bg-slate-300 justify-center align-middle px-2 h-12 border-slate-800 shadow-md rounded-md text-gray-800"
            onClick={() => {
              setIsLogShown((val) => !val);
            }}
          >
            show log
          </button>
        </div>
        <div className="flex flex-col space-y-3 mt-10 ">
          {hasRight(
            { method: "read", theme: "model" },
            user.data,
            modelInfo.data
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
            modelInfo.data
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
            modelInfo.data
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
        {!modelInfo.loading ? `Category > ${modelInfo.data.category}` : ""}
      </span>
      <span className="block mt-10 text-slate-500 text-md md:text-lg lg:text-xl">
        {!modelInfo.loading ? modelInfo.data.description : ""}
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
