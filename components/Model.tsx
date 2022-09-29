import { ModelInfo } from "@customTypes/model";
import "@google/model-viewer";

const Model = ({ info }: { info: ModelInfo }) => {
  const parsed = {
    src: `${info.modelSrc}`,
    "ios-src": info.modelUsdz ?? "",
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
  return <model-viewer id="modelViewer" {...parsed} />;
};

export default Model;
