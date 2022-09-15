import Wrapper from "@components/Wrapper";
import type { NextPage } from "next";
import Link from "next/link";

const DevIndexPage: NextPage = () => {
  return (
    <Wrapper>
      <Link href="/dev/models/upload">
        <div className="w-32 bg-slate-100  p-3 text-center">
          모델 여러개 업로드
        </div>
      </Link>
    </Wrapper>
  );
};

export default DevIndexPage;
