import Wrapper from "@components/Wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { FieldValues } from "react-hook-form";

const Upload = () => {
  const [files, setFiles] = useState<File[] | []>([]);
  const router = useRouter();
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated") {
    router.push("/models");
  }

  const onClick = async (form: FieldValues) => {
    if (files.length === 0) {
      return alert("파일 업로드해주시길 바랍니다.");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    const res = await fetch("/api/models?massiveUpload=true", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const ans = await res.json().then((e) => e.message);
      alert(`업로드에 실패하였습니다. ${ans}`);
      return "error";
    }
    console.log(await res.json());

    setIsSubmitting(false);
    // alert("파일이 업로드 되었습니다.");
    // router.push("/models");
  };

  return (
    <Wrapper>
      <Dropzone
        accept={{ zip: [".zip"] }}
        onDrop={(acceptedFiles) => {
          setFiles([...files, ...acceptedFiles]);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={`border-2 border-black border-dashed cursor-pointer p-10`}
            {...getRootProps()}
          >
            {files.length > 0 ? (
              <div
                className="absolute top-2 right-2 p-1 border-2 mr-8"
                onClick={(e) => {
                  setFiles([]);
                  e.stopPropagation();
                }}
              >
                reset
              </div>
            ) : null}
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3 h-full my-2">
              {files.length === 0 ? (
                <>
                  <svg
                    className="mr-4"
                    width="80"
                    height="70"
                    viewBox="0 0 107 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M75.7806 0.425812C73.3302 0.433053 71.3458 2.13801 71.3374 4.24339V19.5854C71.3374 25.887 77.3656 31.061 84.7 31.0664L102.548 31.0796C104.998 31.0723 106.982 29.3674 106.991 27.262C107.001 25.1456 105.011 23.4234 102.548 23.4161L84.7 23.4029C82.1848 23.4011 80.2568 21.7464 80.2568 19.5854V4.24339C80.2483 2.12697 78.2439 0.417468 75.7806 0.425812Z"
                      fill="black"
                    />
                    <path
                      d="M35.6778 0.433594C28.3434 0.433594 22.2823 5.61295 22.2823 11.9146V42.5684C22.2799 43.074 22.3941 43.575 22.6183 44.0425C22.8424 44.51 23.172 44.9347 23.5881 45.2922C24.0042 45.6498 24.4986 45.933 25.0427 46.1255C25.5868 46.3181 26.1699 46.4162 26.7584 46.4142C27.3441 46.4125 27.9237 46.3116 28.464 46.1174C29.0043 45.9232 29.4948 45.6394 29.9074 45.2822C30.32 44.9251 30.6467 44.5016 30.8688 44.0359C31.0908 43.5703 31.204 43.0716 31.2017 42.5684V11.9146C31.2017 9.75356 33.1626 8.09703 35.6778 8.09703H73.9555L98.0806 28.8251V80.8856C98.0806 83.0466 96.1526 84.7031 93.6374 84.7031H35.6778C33.1626 84.7031 31.2017 83.0466 31.2017 80.8856V73.2221C31.204 72.7189 31.0908 72.2202 30.8688 71.7546C30.6467 71.2889 30.32 70.8654 29.9074 70.5083C29.4948 70.1511 29.0043 69.8673 28.464 69.6731C27.9237 69.4789 27.3441 69.378 26.7584 69.3763C26.1699 69.3743 25.5868 69.4724 25.0427 69.665C24.4986 69.8575 24.0042 70.1407 23.5881 70.4982C23.172 70.8558 22.8424 71.2805 22.6183 71.748C22.3941 72.2155 22.2799 72.7165 22.2823 73.2221V80.8856C22.2823 87.1872 28.3434 92.3666 35.6778 92.3666H93.6374C100.972 92.3666 107 87.1872 107 80.8856V27.2415C107.008 26.2262 106.546 25.2498 105.716 24.5268L78.9582 1.56473C78.5443 1.20667 78.052 0.922413 77.5098 0.728297C76.9676 0.534181 76.386 0.434029 75.7986 0.433594L35.6778 0.433594Z"
                      fill="black"
                    />
                    <path
                      d="M4.44327 61.7435C1.97999 61.7363 -0.00967606 60.0141 3.54e-05 57.8977C0.00846447 55.7923 1.99284 54.0874 4.44327 54.0801H57.9443C60.4076 54.0718 62.412 55.7813 62.4204 57.8977C62.4302 60.0252 60.4204 61.7519 57.9443 61.7435H4.44327Z"
                      fill="black"
                    />
                    <path
                      d="M45.8804 43.7002C45.05 44.418 44.584 45.3888 44.584 46.4008C44.584 47.4128 45.05 48.3837 45.8804 49.1014L56.1163 57.896L45.8804 66.6906C45.05 67.4083 44.584 68.3792 44.584 69.3911C44.584 70.4031 45.05 71.374 45.8804 72.0917C46.2947 72.4492 46.787 72.7329 47.3293 72.9265C47.8715 73.1201 48.4529 73.2197 49.04 73.2197C49.6272 73.2197 50.2086 73.1201 50.7508 72.9265C51.293 72.7329 51.7854 72.4492 52.1997 72.0917L65.5623 60.6107C65.9783 60.2547 66.3085 59.8317 66.5337 59.3658C66.759 58.9 66.8749 58.4005 66.8749 57.896C66.8749 57.3915 66.759 56.892 66.5337 56.4261C66.3085 55.9603 65.9783 55.5372 65.5623 55.1813L52.1997 43.7002C51.7854 43.3427 51.293 43.0591 50.7508 42.8655C50.2086 42.6719 49.6272 42.5723 49.04 42.5723C48.4529 42.5723 47.8715 42.6719 47.3293 42.8655C46.787 43.0591 46.2947 43.3427 45.8804 43.7002Z"
                      fill="black"
                    />
                  </svg>
                  <div className="space-y-2 p-4 px-20">
                    <p className="text-center text-2xl font-bold">
                      파일 업로드
                    </p>
                    <p className="text-center text-gray-500">
                      업로드할 .zip 파일을 선택해주세요. 여러개도 선택
                      가능합니다.
                    </p>
                  </div>
                </>
              ) : (
                <table className="table-auto border-collapse border-slate-400">
                  <thead>
                    <tr>
                      <th className="border p-2 w-52 text-lg border-slate-300 bg-slate-100">
                        File name
                      </th>
                      <th className="border p-2 w-24 text-lg border-slate-300 bg-slate-100">
                        Size
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files?.map((files, i) => {
                      const size = files.size;
                      const kbSize = Math.floor(size / 1000);
                      const mbSize = Math.floor(kbSize / 1000);

                      return (
                        <tr key={i}>
                          <td className="border p-2 pl-5 border-slate-300">
                            {files.name}
                          </td>
                          <td className="border p-2 text-center border-slate-300">
                            {size < 1000
                              ? size + "bite"
                              : kbSize > 1000
                              ? mbSize + "mb"
                              : kbSize + "kb"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Dropzone>
      <button
        onClick={onClick}
        disabled={isSubmitting}
        type="submit"
        className={`w-full my-8 tracking-widest text-white py-3 rounded-md ${
          isSubmitting ? "bg-gray-400" : "bg-header-gray"
        }`}
      >
        {(isSubmitting && (
          <svg
            aria-hidden="true"
            className="inline-block mr-2 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )) ||
          "업로드"}
      </button>
    </Wrapper>
  );
};

export default Upload;
