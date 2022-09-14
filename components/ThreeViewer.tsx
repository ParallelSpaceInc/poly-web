import { OrbitControls, Stats } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { ARCanvas } from "@react-three/xr";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeViewer = ({ url }: { url: string; [key: string]: any }) => {
  const gltf = useLoader(GLTFLoader, url);
  return (
    <div className="relative w-full h-full">
      <ARCanvas>
        <Stats showPanel={0}></Stats>
        <OrbitControls />
        <primitive object={gltf.scene} position={[0, 0, 0]}></primitive>
        <spotLight position={[5, 5, 5]} />
        <directionalLight position={[5, 5, 5]} intensity={2}></directionalLight>
      </ARCanvas>
    </div>
  );
};

export default ThreeViewer;
