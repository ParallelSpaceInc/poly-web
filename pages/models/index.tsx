import type { NextPage } from "next";
import Image from "next/image";

const ModelsMainPage: NextPage = () => {
  return (
    <div className="flex flex-col space-y-2 ">
      <div className="flex bg-blue-900 h-10 p-2.5">
        <Image
          src="/logo.svg"
          width={400}
          height="10rm"
          alt="pararell space logo"
          className="justify-self-start block"
        ></Image>
      </div>
      <div className="mx-8">
        <input
          className="p-1 pl-3 border-2 rounded-md border-blue-900 border-spacing-2 w-full"
          placeholder="모델명 검색"
        ></input>
        <div className="flex flex-col mx-10 text-sm">
          {/* <ul className="flex space-x-2 justify-center text-blue-800 font-semibold underline-offset-1">
          <li>사물</li>
          <li>동물</li>
          <li>식물</li>
          <li>캐릭터</li>
          <li>게임</li>
          <li>음식</li>
          <li>문화재</li>
        </ul> */}
        </div>
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
