import { ModelInfo } from "@customTypes/model";
import { AddUnit } from "@libs/client/Util";
import Image from "next/image";
import { useRouter } from "next/router";
import { increaseView } from "pages/models/[id]";
import { MouseEvent, useState } from "react";

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
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [mode, setMode] = useState<pageMode>("default");
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {!loading && modelInfos ? (
        modelInfos.map((info, i) => (
          <div key={i} className="flex flex-col relative cursor-pointer">
            <div>{mode}</div>
            <div
              className={`block aspect-[4/3] relative rounded hover:shadow-md ${
                mode === "select" && selectedModels.includes(info.id)
                  ? "border border-blue-300"
                  : ""
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
                  mode === "select" && !selectedModels.includes(info.id)
                    ? "opacity-30"
                    : "opacity-100"
                }`}
                loading="lazy"
              />
            </div>
            <div className="flex flex-col ">
              <p className="mt-2 text-sm text-gray-900 truncate">{info.name}</p>
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
        ))
      ) : (
        <span>Loading...</span>
      )}
      {devMode ? (
        <>
          <div className="fixed flex flex-col right-5 top-32 rounded bg-slate-200 w-32 text-center select-none cursor-pointer [&>*]:p-2">
            <div
              onClick={(e) => {
                mode === "default" ? setMode("select") : setMode("default");
              }}
            >
              {mode === "default" ? "선택모드 켜기" : "선택모드 끄기"}
            </div>
          </div>

          <div
            id="selectMenu"
            className={`fixed flex flex-col right-20 bottom-52 rounded bg-slate-200 w-32 text-center select-none cursor-pointer [&>*]:p-2 ${
              mode !== "select" ? "hidden" : ""
            } `}
          >
            <div
              className="hidden rounded bg-blue-300"
              onClick={() => {
                handleHideRequest();
              }}
            >
              숨김처리하기
            </div>
          </div>
        </>
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
      <div className="w-4 -mr-[1px] my-auto mr-1">
        <Image alt={alt} {...attributesWithoutAlt}></Image>
      </div>
      <span className="my-auto text-[12px] text-gray-500 truncate">
        {AddUnit(current + counter) ?? 0}
      </span>
    </div>
  );
};

const handleHideRequest = () => {};

interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout: "responsive" | "fill" | "fixed";
}
