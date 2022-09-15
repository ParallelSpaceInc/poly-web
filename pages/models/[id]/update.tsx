import ErrorDiv from "@components/ErrorDiv";
import Wrapper from "@components/Wrapper";
import { UploadForm } from "@customTypes/model";
import { useModelInfo, useUser } from "@libs/client/AccessDB";
import { hasRight } from "@libs/server/Authorization";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";

const UpdatePage: NextPage = () => {
  const router = useRouter();
  const modelId = router.query.id as string;
  const user = useUser();
  const model = useModelInfo(modelId);
  const { register, handleSubmit, formState } = useForm<UploadForm>({
    defaultValues: {
      name: model.data?.name,
      category: model.data?.category,
      description: model.data?.description,
    },
  });
  const loading = user.loading || model.loading;
  if (loading) return null;
  if (!hasRight({ method: "update", theme: "model" }, user.data, model.data)) {
    router.push(`/models/${modelId}`);
  }
  const onValid = async (form: FieldValues) => {
    const res = await fetch(`/api/models/${modelId}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    }).then((res) => res.json());
    if (!res.ok) {
      alert(`업데이트에 실패하였습니다. ${res.message ?? ""}`);
      return "error";
    }

    router.push(`/models/${modelId}`);
  };
  return (
    <Wrapper>
      <div className="grid lg:grid-cols-2 gap-x-10">
        <div className="mt-10 lg:mt-0 text-lg border rounded-md shadow-md bg-slate-400 aspect-[4/3] text-white text-center ">
          Thumbnail
        </div>
        <div className="flex-col space-y-10 mt-10 lg:mt-0">
          <form onSubmit={handleSubmit(onValid)} className="flex-col space-y-5">
            <div className="flex flex-col space-y-3">
              <label htmlFor="name" className="tracking-[0.3rem]  font-bold">
                모델명*
              </label>
              <input
                id="name"
                {...register("name", {
                  required: "모델명을 입력해주세요.",
                })}
                className="pl-3 py-2 border border-black rounded-md"
              />
              <ErrorDiv error={formState.errors.name}></ErrorDiv>
            </div>
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="description"
                className=" tracking-[0.3rem] font-bold"
              >
                내용
              </label>
              <input
                id="description"
                {...register("description")}
                className="pl-3 py-1  h-32 border border-black rounded-md"
              />
            </div>
            <div className="flex flex-col space-y-3">
              <label htmlFor="category" className="tracking-[0.3rem] font-bold">
                카테고리*
              </label>
              <select
                id="category"
                {...register("category", {
                  required: "카테고리를 선택해주세요.",
                })}
                defaultValue="MISC"
                className="pl-3 py-2 border border-black rounded-md"
              >
                <option></option>
                <option value="MISC">MISC</option>
                <option>FURNITURE</option>
                <option>ARCHITECTURE</option>
                <option>ANIMALS</option>
                <option>FOOD</option>
                <option>CHARACTERS</option>
                <option>NATURE</option>
                <option>VEHICLES</option>
                <option>SCENES</option>
                <option>ACCESSORIES</option>
                <option>HEALTH</option>
                <option>INSTRUMENTS</option>
                <option>PLANTS</option>
                <option>WEAPONS</option>
                <option>TECHNOLOGY</option>
              </select>
              <ErrorDiv error={formState.errors.category}></ErrorDiv>
            </div>
            <div className="flex flex-col space-y-3">
              <label htmlFor="tag" className="tracking-[0.3rem] font-bold">
                태그
              </label>
              <input
                id="tag"
                {...register("tag")}
                className="pl-3 py-2 border border-black rounded-md"
              />
            </div>
            <div className="flex space-x-5">
              <button
                onClick={() => {
                  router.push(`/models/${modelId}`);
                }}
                className="w-full tracking-widest text-white py-3 rounded-md bg-slate-500"
              >
                취소
              </button>
              <button
                disabled={formState.isSubmitting}
                type="submit"
                className={`w-full tracking-widest text-white py-3 rounded-md ${
                  formState.isSubmitting ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {(formState.isSubmitting && (
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
                  "확인"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default UpdatePage;
