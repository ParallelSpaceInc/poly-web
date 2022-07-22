import { ModelInfo } from "@customTypes/model";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useSWR from "swr";

const Model = dynamic(() => import("@components/Model"), { ssr: false });

const ModelPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id ? +router.query.id : 0;
  const { data, error } = useSWR<ModelInfo[]>("/api/models", (url) =>
    fetch(url).then((res) => res.json())
  );
  const loading = !data && !error;

  return (
    <div className="flex flex-col">
      <div className="flex bg-slate-500 h-10 p-2.5"></div>
      <div className="flex-1 mt-10 relative w-full px-6 mx-auto max-w-7xl lg:px-8">
        <input
          className="p-1 pl-3 lg:text-3xl border-2 rounded-md border-slate-500 border-spacing-2 w-full"
          placeholder="Find model"
        ></input>
        <div className="aspect-[4/3] w-full max-w-5xl mx-auto">
          {!loading && data ? <Model info={data[id]} /> : "Loading..."}
        </div>
        <span className="block text-2xl mt-4 md:text-3xl lg:text-4xl">
          {!loading && data ? data[id].name : ""}
        </span>
        <span className="block mt-2 text-slate-500 text-sm md:text-lg lg:text-xl">
          Category {">"} Treasure
        </span>
        <p className="my-2 max-w-3xl mr-auto bg-slate-100 p-2 text-slate-500 text-xs md:text-base max-h-64 overflow-y-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis non nibh
          eleifend, fringilla massa eget, placerat nisl. Morbi lectus erat,
          tristique in euismod eu, faucibus sed neque. Maecenas aliquam pharetra
          dictum. Suspendisse eu dignissim est, id euismod libero. In
          sollicitudin, orci id lobortis luctus, libero leo hendrerit quam, eu
          vestibulum nunc sem a risus. Morbi lacus libero, rhoncus quis arcu
          eget, pharetra feugiat metus. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas. Pellentesque
          consequat sed mi nec accumsan. Nunc gravida condimentum risus nec
          facilisis. Cras risus tortor, consequat non consectetur non, aliquam
          non augue. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Mauris consequat metus vitae est
          tempor placerat. Praesent justo orci, sagittis ut lacus id, hendrerit
          blandit tortor. Quisque non condimentum nisi. Duis pretium erat odio,
          in lobortis arcu luctus id. In blandit nisl nec erat aliquet pulvinar.
        </p>
      </div>
    </div>
  );
};

export default ModelPage;
