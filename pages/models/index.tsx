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

  const loading = !modelInfos && !error;
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 mt-10 relative w-full px-6 mx-auto max-w-7xl lg:px-8">
        <div className="block mt-6 relative">
          <div className="">
            <input
              className="p-2 pl-4 w-full ring-2 ring-gray-300 focus:ring-indigo-500 text-xl rounded-md outline-none"
              placeholder="Find model"
            ></input>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {!loading && modelInfos ? (
            modelInfos.map((info, i) => (
              <Link key={i} href={`/models/${info.id}`}>
                <div className="flex flex-col relative cursor-pointer">
                  <div className="block  aspect-[4/3] relative rounded-lg shadow-md">
                    <Image
                      src={info.thumbnailSrc}
                      alt={info.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      priority
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="block mt-2 text-gray-900 truncate">
                      {info.name}
                    </p>
                  </div>
                </div>
              </Link>
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
