import { ModelInfo } from "@customTypes/model";
import { AddUnit } from "@libs/client/Util";
import Image from "next/image";
import { useRouter } from "next/router";
import { increaseView } from "pages/models/[id]";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";

type pageMode = "default" | "blind toggle";

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
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {!loading && modelInfos ? (
        modelInfos.map((info, i) =>
          !info.blinded || devMode ? (
            <div key={i} className={`flex flex-col relative cursor-pointer`}>
              <div
                className={`block aspect-[4/3] relative rounded hover:shadow-md`}
                onClick={() => {
                  if (mode === "blind toggle") {
                    handleHideRequest(info.id, !info.blinded);
                  } else {
                    router.push(`/models/${info.id}`);
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
        <div className="fixed flex flex-col right-5 top-32 rounded bg-slate-200 w-32 text-center select-none cursor-pointer [&>div]:p-2 [&>div.modeOn]:bg-red-200 [&>div]:rounded">
          <ModeChangeButton
            buttonMode="blind toggle"
            curMode={mode}
            setMode={setMode}
            router={router}
          />
        </div>
      ) : null}
    </div>
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

interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout: "responsive" | "fill" | "fixed";
}
