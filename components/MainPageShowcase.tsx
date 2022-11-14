import { ResponseQuery } from "@api/config";
import { ModelInfo } from "@customTypes/model";
import dynamic from "next/dynamic";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

type Props = {
  modelInfo?: ModelInfo | null;
};

const MainPageShowcase = ({ modelInfo }: Props) => {
  const { data: { texts } = {} } = useSWR<ResponseQuery>(
    "/api/config?texts=true",
    (url) => fetch(url).then((res) => res.json())
  );

  return (
    <div
      id="main-showcase"
      className="hidden md:flex xl:h-80 mb-10 rounded-lg bg-cover bg-[url('/showcaseBanner-blackToWhite.png')]"
    >
      <div className="text-white p-12 xl:p-16 flex-1">
        <span className="block md:text-2xl xl:text-3xl mb-5 xl:mb-8">
          {texts?.mainPageGuideHead}
        </span>
        <div className="[&>span]:block [&>span]:text-lg [&>span]:xl:text-xl pl-5 text-gary space-y-3 xl:space-y-5">
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
