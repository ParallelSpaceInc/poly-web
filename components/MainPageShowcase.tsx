import { ResponeQuery } from "@api/config";
import { ModelInfo } from "@customTypes/model";
import dynamic from "next/dynamic";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

type Props = {
  modelInfo?: ModelInfo | null;
};

const MainPageShowcase = ({ modelInfo }: Props) => {
  const { data: { texts } = {} } = useSWR<ResponeQuery>(
    "/api/config?texts=true",
    (url) => fetch(url).then((res) => res.json())
  );

  return (
    <div
      id="main-showcase"
      className="hidden md:flex md:h-60 xl:h-80  bg-gradient-to-r from-gray-800 via-gray-500/50 to-white/0 mb-10 rounded-lg"
    >
      <div className="text-white p-8 flex-1">
        <span className="block md:text-2xl xl:text-4xl mb-5 xl:mb-8">
          {texts?.mainPageGuideHead}
        </span>
        <div className="[&>span]:block [&>span]:text-lg [&>span]:xl:text-2xl pl-3 text-gary space-y-3 xl:space-y-5">
          <span>{texts?.mainPageGuideBody1}</span>
          <span>{texts?.mainPageGuideBody2}</span>
          <span>{texts?.mainPageGuideBody3}</span>
        </div>
      </div>
      <div className="flex-1">
        {modelInfo ? <Model info={modelInfo}></Model> : null}
      </div>
    </div>
  );
};

export default MainPageShowcase;
