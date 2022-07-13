import "@google/model-viewer";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
    interface ModelViewerJSX {
      src: string;
      poster?: string;
      [key: string]: any;
    }
  }
}

interface ModelViewerElement extends Element {
  model: {
    materials: Array<{
      name: string;
      pbrMetallicRoughness: {
        setBaseColorFactor: (x: [number, number, number, number]) => void;
        setMetallicFactor: (x: number) => void;
        setRoughnessFactor: (x: number) => void;

        baseColorTexture: null | {
          texture: {
            source: {
              setURI: (x: string) => void;
            };
          };
        };
        metallicRoughnessTexture: null | {
          texture: {
            source: {
              setURI: (x: string) => void;
            };
          };
        };
        // ... others
      };
    }>;
  };
}

const Model = () => {
  const info = {
    src: "10.0.1.101:30201/models/국보275_도기_기마인물형_뿔잔/scene.gltf",
    poster:
      "10.0.1.101:30201/models/썸네일/PNG/형국보275 도기 기마인물형 뿔잔 1.png",
    alt: "국보275_도기_기마인물형_뿔잔",
    "shadow-intensity": "1",
    "camera-controls": "",
    "auto-rotate": "",
    ar: "",
    style: {
      width: "100%",
      height: "100%",
    },
  };
  return <model-viewer {...info} />;
};

export default Model;
