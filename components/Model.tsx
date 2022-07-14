import { ModelInfo } from "@customTypes/model";
import "@google/model-viewer";

const Model = ({ info }: { info: ModelInfo }) => {
  const parsed = {
    src: info.modelSrc,
    poster: info.thumbnailSrc,
    alt: info.name,
    "shadow-intensity": "1",
    "camera-controls": "",
    "auto-rotate": "",
    ar: "",
    style: {
      width: "100%",
      height: "100%",
    },
  };
  return <model-viewer {...parsed} />;
};

export default Model;
