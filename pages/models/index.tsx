import { ModelInfo } from "@customTypes/model";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const ModelsMainPage: NextPage = () => {
  const { data: modelInfos, error } = useSWR<ModelInfo[]>(
    "/api/models",
    (url) => fetch(url).then((res) => res.json())
  );
  return (
    <div className="flex flex-col space-y-2 ">
      <div className="flex bg-slate-500 h-10 p-2.5"></div>
      <div className="mx-8">
        <input
          className="p-1 pl-3 border-2 rounded-md border-slate-500 border-spacing-2 w-full"
          placeholder="Find model"
        ></input>
        <div className="flex flex-col mx-10 text-sm"></div>
        <div className="grid grid-cols-2 p-3 gap-3 max-w-2xl mx-auto">
          {modelInfos ? (
            modelInfos.map((info, i) => (
              <div className="aspect-[4/3] relative" key={i}>
                <Link href={`/models/${info.id}`}>
                  <Image
                    src={info.thumbnailSrc}
                    alt={info.name}
                    layout="fill" // required
                    objectFit="cover" // change to suit your needs
                    className="rounded-lg" // just an example
                  />
                </Link>
              </div>
            ))
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelsMainPage;
