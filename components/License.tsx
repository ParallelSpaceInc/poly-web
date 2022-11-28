import Image from "next/image";

const License = () => {
  return (
    <div className="flex mt-5 h-16 justify-between max-w-xs">
      <div className="mt-auto ml-3 text-center text-sm text-gray-500">
        라이선스: <br />
        <span className="font-bold">공공누리 제1 유형</span>
      </div>
      <div className="mt-auto h-12 relative aspect-[3/1]">
        <Image src="/open_license.jpg" layout="fill" alt="nuri-1 license" />
      </div>
    </div>
  );
};

export default License;
