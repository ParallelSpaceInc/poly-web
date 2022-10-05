import { ModelInfo } from "@customTypes/model";
import { AddUnit } from "@libs/client/Util";
import Image from "next/image";
import Link from "next/link";

function Thumbnails({
  loading,
  modelInfos,
}: {
  loading: boolean;
  modelInfos?: ModelInfo[];
}) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {!loading && modelInfos ? (
        modelInfos.map((info, i) => (
          <Link key={i} href={`/models/${info.id}`}>
            <div className="flex flex-col relative cursor-pointer">
              <div className="block  aspect-[4/3] relative rounded-lg shadow-md">
                <Image
                  src={info.thumbnailSrc ? info.thumbnailSrc : "/cube.png"}
                  alt={info.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col ">
                <p className="mt-2 text-gray-900 truncate">{info.name}</p>
                <div className="flex justify-between">
                  <span className="block my-auto text-gray-500 truncate">
                    {AddUnit(info.modelSize) + "B"}
                  </span>
                  {info.viewed !== 0 ? (
                    <div className="flex relative space-x-1 mr-2">
                      <div className="w-6 mr-1">
                        <Image
                          src="/views.png"
                          alt="views"
                          width={30}
                          height={30}
                          layout="responsive"
                        ></Image>
                      </div>
                      <span className="my-auto text-gray-500 truncate">
                        {AddUnit(info.viewed)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}

export default Thumbnails;
