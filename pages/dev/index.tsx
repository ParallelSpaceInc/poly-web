import Wrapper from "@components/Wrapper";
import type { NextPage } from "next";
import Link from "next/link";

const DevIndexPage: NextPage = () => {
  return (
    <Wrapper>
      <div className="flex space-x-3">
        <Link href="/dev/models/upload">
          <div className="w-32 bg-slate-100  p-3 text-center">
            모델 여러개 업로드
          </div>
        </Link>
        <Link href="/dev/models/delete">
          <div className="w-32 bg-slate-100  p-3 text-center">
            모델 여러개 삭제
          </div>
        </Link>
        <Link href="/dev/config">
          <div className="w-32 bg-slate-100  p-3 text-center">
            홈페이지 설정
          </div>
        </Link>
        <Link href="/dev/models/diff">
          <div className="w-32 bg-slate-100  p-3 text-center">
            저장소, DB 차이 확인
          </div>
        </Link>
      </div>
    </Wrapper>
  );
};

export default DevIndexPage;
