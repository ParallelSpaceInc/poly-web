import { ModelInfo } from "@customTypes/model";
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
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
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
                  priority
                />
              </div>
              <div className="flex items-end justify-between">
                <p className="block mt-2 text-gray-900 truncate">{info.name}</p>
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
