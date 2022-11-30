import Wrapper from "@components/Wrapper";
import type { NextPage } from "next";

const PageConfing: NextPage = () => {
  return (
    <Wrapper>
      {
        // gray button with border
        <div className="flex flex-col">
          <button
            className="border px-2 h-12 w-32 border-slate-300 bg-slate-50 rounded-md text-gray-800"
            onClick={() => fetch("/api/db/initialize")}
          >
            초기값 지정하기
          </button>
          <span>
            아직 설정된 text나 config 값이 없는 경우 초기 값을 지정합니다
          </span>
        </div>
      }
    </Wrapper>
  );
};

export default PageConfing;
