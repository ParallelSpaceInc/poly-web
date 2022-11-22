import { ModelInfo } from "@customTypes/model";
import { AddUnit } from "@libs/client/Util";
import Image from "next/image";
import { useRouter } from "next/router";
import { increaseView } from "pages/models/[id]";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import ModelModal from "./ModalModal";

type pageMode = "default" | "select";

function Thumbnails({
  loading,
  modelInfos,
  devMode = false,
}: {
  loading: boolean;
  modelInfos?: ModelInfo[];
  devMode?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<pageMode>("default");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const modalId = router.asPath.match(/\/models\/(.+)/)?.[1];
  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {!loading && modelInfos ? (
          modelInfos.map((info, i) =>
            !info.blinded || devMode ? (
              <div key={i} className={`flex flex-col relative cursor-pointer`}>
                <a
                  href={mode === "select" ? undefined : `/models/${info.id}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.shiftKey) {
                      //open modal
                      e.preventDefault();
                      router.push("/models", `/models/${info.id}`, {
                        scroll: false,
                      });
                      document.body.classList.add("overflow-hidden");
                    }
                  }}
                >
                  <div
                    className={`block aspect-[4/3] relative rounded hover:shadow-md ${
                      mode === "select" && selectedModels.includes(info.id)
                        ? "border-4 border-dashed border-blue-300"
                        : null
                    }`}
                    onClick={() => {
                      if (mode === "select") {
                        if (selectedModels.includes(info.id)) {
                          setSelectedModels((prev) =>
                            prev.filter((val) => val !== info.id)
                          );
                        } else {
                          setSelectedModels((prev) => [...prev, info.id]);
                        }
                      }
                    }}
                  >
                    <Image
                      src={info.thumbnailSrc ? info.thumbnailSrc : "/cube.png"}
                      alt={info.name}
                      layout="fill"
                      objectFit="cover"
                      draggable="false"
                      className={`rounded ${
                        info.blinded ? "opacity-30" : "opacity-100"
                      }`}
                      loading="lazy"
                    />
                  </div>
                </a>

                <div className="flex flex-col ">
                  <p className="mt-2 text-sm text-gray-900 truncate">
                    {info.name}
                  </p>
                  <div className="flex justify-between">
                    <span className="block text-xs my-auto text-gray-500 truncate">
                      {AddUnit(info.modelSize) + "B"}
                    </span>
                    <div className="flex space-x-2 truncate">
                      <IconWithCounter
                        current={info.viewed}
                        imageAttributes={{
                          src: "/views.png",
                          alt: "views",
                          layout: "responsive",
                          height: 30,
                          width: 30,
                        }}
                        increaseIfDev={devMode}
                        increasingCallback={() => {
                          increaseView(info.id);
                        }}
                      />
                      <IconWithCounter
                        current={info._count.Comment}
                        imageAttributes={{
                          src: "/comment.png",
                          alt: "comments",
                          layout: "responsive",
                          height: 30,
                          width: 30,
                        }}
                        onClick={() => {
                          router.push(`models/${info.id}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )
        ) : (
          <span>Loading...</span>
        )}
        {devMode ? (
          <>
            <div className="fixed flex flex-col right-5 top-32 rounded bg-slate-200 w-36 text-center select-none cursor-pointer [&>div]:p-2 [&>div.modeOn]:bg-red-200 [&>div]:rounded">
              <ModeChangeButton
                buttonMode="select"
                curMode={mode}
                setMode={setMode}
                router={router}
              />
            </div>
            <div className="fixed flex flex-col right-12 bottom-60 rounded bg-slate-200 w-36 text-center select-none cursor-pointer [&>div]:p-2 [&>div.modeOn]:bg-red-200 [&>div]:rounded ">
              <div
                className="bg-red-300"
                onClick={async () => {
                  await handleMultipleDeleteRequest(selectedModels);
                  router.reload();
                }}
              >
                삭제
              </div>
              <div
                className="bg-slate-300"
                onClick={async () => {
                  await handleMultipleBlindRequest(selectedModels, true);
                  router.reload();
                }}
              >
                블라인드
              </div>
              <div
                onClick={async () => {
                  await handleMultipleBlindRequest(selectedModels, false);
                  router.reload();
                }}
              >
                블라인드 해제
              </div>
            </div>
          </>
        ) : null}
      </div>
      {modalId ? (
        <ModelModal
          modelId={modalId}
          closeCallback={() => {
            router.push(router.basePath, router.basePath, { scroll: false });
            document.body.classList.remove("overflow-hidden");
          }}
        />
      ) : null}
    </>
  );
}

export default Thumbnails;

const IconWithCounter = ({
  current,
  imageAttributes,
  increaseIfDev,
  onClick,
  increasingCallback,
}: {
  current: number;
  increaseIfDev?: boolean;
  imageAttributes: ImageAttributes;
  onClick?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  increasingCallback?: () => void;
}) => {
  const [counter, setCounter] = useState(0);
  const { alt, ...attributesWithoutAlt } = imageAttributes;
  return (
    <div
      className="flex relative space-x-1"
      onClick={(e) => {
        if (increaseIfDev) {
          increasingCallback?.();
          setCounter((prev) => prev + 1);
        }
        onClick?.(e);
      }}
    >
      <div className="w-4 -mr-[1px] my-auto">
        <Image alt={alt} {...attributesWithoutAlt}></Image>
      </div>
      <span className="my-auto text-[12px] text-gray-500 truncate">
        {AddUnit(current + counter) ?? 0}
      </span>
    </div>
  );
};

const ModeChangeButton = ({
  curMode,
  buttonMode,
  setMode,
  router,
}: {
  curMode: pageMode;
  buttonMode: pageMode;
  setMode: Dispatch<SetStateAction<pageMode>>;
  router: any;
}) => (
  <div
    className={`${curMode === buttonMode ? "modeOn" : ""}`}
    onClick={(e) => {
      curMode !== buttonMode
        ? setMode(buttonMode)
        : (() => {
            setMode("default");
            router.reload();
          })();
    }}
  >
    {curMode !== buttonMode
      ? buttonMode + "모드 켜기"
      : buttonMode + "모드 끄기"}
  </div>
);

const handleHideRequest = async (selectedModel: string, blind: boolean) => {
  const form = new FormData();
  form.append("blind", String(blind));
  form.append("model", selectedModel);
  const res = await fetch(`/api/models?devMode=true`, {
    body: form,
    method: "PATCH",
  });
};

const handleDeleteRequest = async (selectedModel: string) => {
  const res = await fetch(`/api/models/${selectedModel}`, {
    method: "DELETE",
  });
};

const handleMultipleBlindRequest = async (
  modelIds: string[],
  blindValue: boolean
) => {
  const formBody = new FormData();
  const targetModels = modelIds.forEach((id) =>
    formBody.append("modelList", id)
  );
  await fetch(`/api/models?devMode=true&massive=true&blind=${blindValue}`, {
    method: "PATCH",
    body: formBody,
  }).then((res) => res.json());
};

const handleMultipleDeleteRequest = async (modelIds: string[]) => {
  const formBody = new FormData();
  const targetModels = modelIds.forEach((id) =>
    formBody.append("modelList", id)
  );
  await fetch("/api/models?massive=true", {
    method: "DELETE",
    body: formBody,
  }).then((res) => res.json());
};

interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout: "responsive" | "fill" | "fixed";
}
