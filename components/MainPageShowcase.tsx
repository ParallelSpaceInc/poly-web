import { SiteConfig } from "@api/config";
import { ModelInfo } from "@customTypes/model";
import dynamic from "next/dynamic";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

type Props = {
  modelInfo?: ModelInfo | null;
};

const MainPageShowcase = ({ modelInfo }: Props) => {
  const { data: { texts } = {} } = useSWR<SiteConfig>("/api/config", (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <div
      id="main-showcase"
      className="hidden md:grid md:grid-cols-3 md:h-60 lg:h-80  bg-gradient-to-r from-gray-800 via-gray-500/50 to-white/0 mb-10 rounded-lg"
    >
      <div className="col-span-2 text-white p-8">
        <span className="block md:text-2xl mb-3">
          {texts?.mainPageGuideHead}
        </span>
        <div className="[&>span]:block [&>span]:text-lg pl-3 text-gary space-y-3">
          <span>{texts?.mainPageGuideBody1}</span>
          <span>{texts?.mainPageGuideBody2}</span>
          <span>{texts?.mainPageGuideBody3}</span>
        </div>
      </div>
      {modelInfo ? <Model info={modelInfo}></Model> : null}
    </div>
  );
};

export default MainPageShowcase;
