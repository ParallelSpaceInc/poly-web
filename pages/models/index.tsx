import type { NextPage } from "next";

const ModelsMainPage: NextPage = () => {
  return (
    <div className="flex flex-col space-y-2 ">
      <div className="flex bg-blue-900 h-10 p-2.5"></div>
      <div className="mx-8">
        <input
          className="p-1 pl-3 border-2 rounded-md border-blue-900 border-spacing-2 w-full"
          placeholder="Find model"
        ></input>
        <div className="flex flex-col mx-10 text-sm"></div>
        <div className="grid grid-cols-2 p-3 gap-3 max-h-full overflow-y-hidden">
          {Array.from(Array(10).keys()).map((el, i) => (
            <div key={i}>
              <div className="bg-slate-400 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsMainPage;
