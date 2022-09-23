import Wrapper from "@components/Wrapper";
import { useModelInfos } from "@libs/client/AccessDB";
import { AddUnit } from "@libs/client/Util";
import { SyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { AllSettleResult, SuccessCounter } from "./upload";

const DeleteModelsPage = () => {
  const models = useModelInfos();
  const { mutate: componentMutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm();

  return (
    <Wrapper>
      <form
        onSubmit={handleSubmit((form) =>
          onValid(form, () => {
            componentMutate("/api/models");
          })
        )}
      >
        <div>
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                <th className="border-b pb-3">
                  Check
                  <input
                    id="main-checkbox"
                    type="checkbox"
                    onClick={(e: SyntheticEvent<HTMLInputElement>) => {
                      const boxes = watch();
                      const bool = e.currentTarget.checked;
                      Object.entries(boxes).forEach(([key, val]) => {
                        setValue(key, bool);
                      });
                    }}
                    className="flex m-auto h-5 w-5"
                  ></input>
                </th>
                <th className="border-b pb-3 text-left pl-3">Name</th>
                <th className="border-b pb-3">UploadAt</th>
                <th className="border-b pb-3">Size</th>
                <th className="border-b pb-3">Uploader</th>
              </tr>
            </thead>
            <tbody>
              {models.data?.map((model, i) => (
                <tr key={model.id} className="align-middle">
                  <td className="pt-1 border-b text-lg text-center">
                    <input
                      type="checkbox"
                      {...register(model.id)}
                      onClick={UncheckMainboxIfslaveUnchecked}
                      className="form-checkbox h-5 w-5 mx-auto flex"
                    ></input>
                  </td>
                  <td className="pt-1 pl-3 border-b text-lg whitespace-nowrap">
                    {model.name}
                  </td>
                  <td className="pt-1 border-b text-lg text-center">
                    {new Date(model.createdAt).toUTCString()}
                  </td>
                  <td className="pt-1 border-b text-lg text-center">
                    {AddUnit(model.modelSize) + "B"}
                  </td>
                  <td className="pt-1 border-b text-lg text-center">
                    {model.uploader?.name ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="fixed right-32 bottom-32 text-lg border-blue-200 bg-blue-100 border-2 p-3 rounded-lg">
          선택된 모델 개수 :{" "}
          {Object.entries(watch()).filter(([key, val]) => val === true).length}
        </div>
        <button
          disabled={isSubmitting}
          type="submit"
          className={`p-3 flex mx-auto mt-10 tracking-widest text-white py-3 rounded-md ${
            isSubmitting ? "bg-gray-400" : "bg-red-400"
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
            "삭제하기"}
        </button>
      </form>
    </Wrapper>
  );
};

export default DeleteModelsPage;

async function onValid(form: object, refresh: () => void) {
  const formBody = new FormData();
  const targetModels = Object.entries(form)
    .filter(([id, isChecked]) => isChecked)
    .forEach((list) => formBody.append("modelList", list[0]));

  const res: AllSettleResult[] = await fetch("/api/models?massive=true", {
    method: "DELETE",
    body: formBody,
  }).then((res) => res.json());
  const count = SuccessCounter(res);
  alert(
    `삭제요청의 수 : ${count.total}\n 성공한 삭제 수  : ${count.successCnt}`
  );
  count.successCnt === count.total
    ? null
    : alert(
        res
          .filter((report) => report.status === "rejected")
          .reduce((prev, cur) => prev + `${cur.reason}\n`, "실패한 이유 \n")
      );
  refresh();
}

function UncheckMainboxIfslaveUnchecked(e: SyntheticEvent<HTMLInputElement>) {
  const masterCheckbox = document.getElementById(
    "main-checkbox"
  ) as HTMLInputElement;
  if (e.currentTarget.checked === false) {
    masterCheckbox.checked = false;
  }
}
