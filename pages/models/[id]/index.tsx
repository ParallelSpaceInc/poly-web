import Comments, { NewComment } from "@components/Comments";
import ModelInfo from "@components/ModelInfo";
import Wrapper from "@components/Wrapper";
import { useModelInfo, useUser } from "@libs/client/AccessDB";
import { hasRight } from "@libs/server/Authorization";
import { Role } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });
const SHOW_CATEGORY = false;

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
  const session = useSession();
  const { register, formState, reset: resetComment, handleSubmit } = useForm();
  const { mutate: componentMutate } = useSWRConfig();
  const onValid = async (form: FieldValues) => {
    if (formState.isSubmitting) return;
    const res = await fetch(`/api/comment?modelId=${modelId}`, {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      alert("코멘트 업로드에 실패하였습니다.");
    }
    componentMutate(`/api/models?id=${modelId}`);
    resetComment({ text: "" });
  };
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
        increaseView(modelId);
      }
    };
    if (modelViewer) {
      modelViewer.addEventListener("progress", callback);
    }
    return () => {
      modelViewer?.removeEventListener("progress", callback);
    };
  }, [modelViewer, modelId]);

  if (modelInfo.error || user.error) {
    router.push("/");
    return null;
  }
  if (!modelInfo.data) {
    return null;
  }

  return (
    <Wrapper>
      <div className="block mt-2 sm:grid sm:grid-cols-3 gap-x-4 gap-y-8">
        <div className="relative aspect-[4/3] w-full col-span-2 max-w-5xl mx-auto">
          {isLogShown ? (
            <div className="absolute top-0 right-0 z-10 w-auto p-2 justify-start flex flex-col text-white bg-opacity-50 bg-slate-700">
              {logs.map((log, index) => (
                <span key={index} className="flex justify-items-start mr-auto">
                  {log}
                </span>
              ))}
            </div>
          ) : null}
          {!modelInfo.loading ? <Model info={modelInfo.data} /> : "Loading..."}
          {([Role.ADMIN, Role.DEVELOPER] as any).includes(
            user?.data?.role ?? Role.UNAUTHENTICATED
          ) ? (
            <>
              <button
                className="absolute -bottom-10 right-0 border justify-center align-middle px-2 h-12 border-slate-300 bg-slate-50 shadow-md rounded-md text-gray-800"
                onClick={() => {
                  setIsLogShown((val) => !val);
                }}
              >
                show log
              </button>
              <button
                className="absolute -bottom-10 right-24 border justify-center align-middle px-2 h-12 border-slate-300 bg-slate-50 shadow-md rounded-md text-gray-800"
                onClick={() => {
                  router.push(`/models/${modelId}/three`);
                }}
              >
                to threejs viewer
              </button>
            </>
          ) : null}
        </div>
        <div
          className={`flex flex-col space-y-3 mt-6 ${
            ["ADMIN", "DEVELOPER"].includes(user.data?.role!) ? "" : "hidden"
          }`}
        >
          {hasRight(
            { method: "read", theme: "model" },
            user.data,
            modelInfo.data
          ) ? (
            <button
              onClick={() =>
                onDownloadClick(modelId, setLogs, modelInfo.data?.name)
              }
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
              onClick={() => handleDeleteRequest(modelId, router)}
              className=" text-white bg-red-500 h-10"
            >
              delete
            </button>
          ) : null}
        </div>
      </div>
      <span className="block text-xl mt-4 md:text-2xl lg:text-3xl">
        {!modelInfo.loading ? modelInfo.data.name : ""}
      </span>
      <ModelInfo modelId={modelId}></ModelInfo>
      {SHOW_CATEGORY ? (
        <span className="block text-lg mt-6 md:text-xl lg:text-xl text-slate-600">
          {!modelInfo.loading ? `Category > ${modelInfo.data.category}` : ""}
        </span>
      ) : null}
      <span className="block whitespace-pre-line mt-10 text-slate-500 text-md md:text-lg lg:text-xl">
        {!modelInfo.loading ? modelInfo.data.description : ""}
      </span>
      <div className="flex mt-5 h-16 justify-between max-w-xs">
        <div className="mt-auto ml-3 text-center text-sm text-gray-500">
          라이선스: <br />
          <span className="font-bold">공공누리 제1 유형</span>
        </div>
        <div className="mt-auto h-12 relative aspect-[3/1]">
          <Image src="/open_license.jpg" layout="fill" alt="nuri-1 license" />
        </div>
      </div>
      {!modelInfo.loading ? (
        <div className="p-2 shadow-md rounded-lg align-middle justify-center mt-10">
          <div className="relative text-2xl inline-block bg-white px-2 text-slate-700 -top-5 left-3">
            {`댓글 (${modelInfo.data.Comment?.length})`}
          </div>
          <NewComment
            session={session}
            handler={handleSubmit(onValid)}
            register={register}
            openLogin={() => {
              document.getElementById("login-button")?.click();
            }}
          ></NewComment>
          <Comments
            comments={modelInfo.data.Comment}
            handleDelete={(commentId: string) =>
              handleDelete(commentId, () => {
                componentMutate(`/api/models?id=${modelId}`);
              })
            }
            user={user.data}
          ></Comments>
        </div>
      ) : null}
    </Wrapper>
  );
};

const handleDeleteRequest = (id: string, router: NextRouter) => {
  if (window.confirm("정말로 삭제하시겠습니까?")) {
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
  } else {
    // do nothing
  }
};

const onDownloadClick = async (
  modelId: string,
  setLogs: Dispatch<SetStateAction<string[]>>,
  zipName?: string
) => {
  const startAt = performance.now();
  const res = await fetch(`/api/models/${modelId}`)
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = zipName + ".zip" ?? "model.zip";
      link.click();
      link.remove();
    });
  const spentTime = Math.floor(performance.now() - startAt);
  setLogs((logs) =>
    logs.concat(`<system> : download spent ${spentTime / 1000} sec.`)
  );
};

async function handleDelete(commentId: string, refresh: () => void) {
  const res = await fetch(`/api/comment?commentId=${commentId}`, {
    method: "DELETE",
  }).then((res) => res.json());
  if (!res.ok) {
    const message = res.message ? "\n" + res.message : "";
    alert(`코멘트 삭제에 실패했습니다.` + message);
  }
  {
    refresh();
  }
}
export const increaseView = (modelId: string) => {
  fetch(`/api/models/${modelId}?view=true`, {
    method: "POST",
  });
};

export default ModelPage;
