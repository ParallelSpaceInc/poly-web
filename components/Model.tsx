import { ModelInfo } from "@customTypes/model";
import "@google/model-viewer";
import { round } from "lodash";
import { increaseView } from "pages/models/[id]";
import { useEffect, useState } from "react";

const Model = ({
  info,
  hideThumbnailUntilLoaded = false,
  appendLog,
  increaseViewCount = true,
}: {
  info: ModelInfo;
  hideThumbnailUntilLoaded?: boolean;
  appendLog?: (log: string) => void;
  increaseViewCount?: boolean;
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [viewerId, setViewerId] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(
    !hideThumbnailUntilLoaded
  );
  useEffect(() => {
    setViewerId(`model-viewer-${Math.random()}`);
  }, []);
  useEffect(() => {
    const begin = Date.now();
    const progressCallback = (xhr: any) => {
      setProgress(xhr.detail.totalProgress);
      if (xhr.detail.totalProgress === 1) {
        setTimeout(() => {
          setIsVisible(true);
        }, 500);
        appendLog?.(
          `<system> : Loading spent ${(Date.now() - begin) / 1000} sec.`
        );
        if (increaseViewCount) {
          increaseView(info.id);
        }
      }
    };
    const modelComponent = document.getElementById(viewerId);
    modelComponent?.addEventListener("progress", progressCallback);
    return () => {
      modelComponent?.removeEventListener("progress", progressCallback);
    };
  }, [info.id, appendLog, viewerId, increaseViewCount]);
  const parsed = {
    src: `${info.modelSrc}`,
    "ios-src": info.usdzSrc ?? "",
    poster: info.thumbnailSrc,
    alt: info.name,
    "shadow-intensity": "1",
    "camera-controls": "",
    "auto-rotate": "",
    ar: "",
    "ar-modes": "scene-viewer",
    style: {
      width: "100%",
      height: "100%",
    },
    // exposure: "1",
    // "environment-image": "neutral",
    // "skybox-image":
    //   "https://modelviewer.dev/assets/whipple_creek_regional_park_04_1k.hdr",
  };

  return (
    <div className="flex w-full h-full justify-center items-center ">
      <div
        className={`w-full h-full transition duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }
        }`}
      >
        <model-viewer id={viewerId} {...parsed}>
          <div slot="progress-bar"></div>
        </model-viewer>
      </div>
      <LoadingBar progress={progress} />
    </div>
  );
};

const LoadingBar = ({ progress }: any) => {
  return (
    <div
      className={`flex flex-col w-full max-w-xs transition-opacity duration-500 absolute ${
        progress === 1 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center m-2">Loading Model</div>
      <div
        className={`flex bg-gray-300 rounded-full dark:bg-gray-700 
        }`}
      >
        <div
          className="bg-slate-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${progress * 100}%` }}
        >
          {round(progress * 100, 1)}%
        </div>
      </div>
    </div>
  );
};

export default Model;
