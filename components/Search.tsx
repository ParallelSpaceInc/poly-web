import Image from "next/image";
import { ModelInfos } from "pages/models";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

interface props {
  setModels: Dispatch<SetStateAction<ModelInfos | undefined>>
  isClickSort: boolean,
  closeSortingModel: () => void
  setIsClickSort: Dispatch<SetStateAction<boolean>>
}
type sortType = "Last Added" | "Size" | "Alphabetic"
type srotTypes = sortType[]
function SearchBar({ setModels, isClickSort, closeSortingModel, setIsClickSort }: props) {

  const sortTypes: srotTypes = ["Last Added", "Size", "Alphabetic"]

  const { register } = useForm();

  const [currentSortType, setCurrentSortType] = useState<string>(sortTypes[0])
  const isDescOfLastAdded = useState<boolean>(true)
  const isDescOfSize = useState<boolean>(true)
  const isDescOfAlphabetic = useState<boolean>(false)

  const sortingModel = async (type: string) => {

    const [isDescState, setIsDesc] = sortTypeState(type)
    let isDesc = isDescState
    if (type === currentSortType) {
      setIsDesc(!isDesc)
      isDesc = !isDesc
    }
    setCurrentSortType(type)

    const { data, error } = await fetch(`/api/models?sort=${type.concat(`,${isDesc}`)}`, {
      method: "GET",
    }).then((res) => res.json())
    const loading = !data && !error;
    setModels({
      loading,
      data,
      error
    })

    closeSortingModel();
  }

  const sortTypeState = (type: string): [boolean, Dispatch<SetStateAction<boolean>>] => {
    switch (type) {
      case "Last Added":
        return isDescOfLastAdded
      case "Size":

        return isDescOfSize
      case "Alphabetic":

        return isDescOfAlphabetic
      default:
        return isDescOfLastAdded
    }

  }

  return (

    <div className="w-full flex justify-between mt-6">
      <div className="w-3/4 relative ring-2 ring-gray-300 focus:ring-indigo-500 rounded-md outline-none flex justify-center items-center">
        <form className="p-2 border-none rounded-md outline-none pl-4 flex-1 text-xl">
          <input
            className="w-full"
            placeholder="Find model"
            {...register("findModelName")}
          />
        </form>

        <div className="pr-3 flex items-center cursor-pointer">
          <Image src="/searchIcon.png" width="20px" height="20px" alt="find model" />
        </div>
      </div>
      <div id="sorting" className="rounded-md ring-2 ring-gray-300 w-1/6 text-center flex justify-center items-center relative cursor-pointer">
        <div className="w-full font-semibold text-gray-500 h-full text-sm border-none outline-none flex justify-center items-center"
          onClick={() => {
            setIsClickSort(!isClickSort)
          }}
        >
          <p>{currentSortType} {sortTypeState(currentSortType)[0] ? <span>&darr;</span> : <span>&uarr;</span>}</p>
        </div>
        <ul className={`absolute top-12 left-0 z-10 divide-y-2 bg-white border-gray-300 border-2 rounded-md w-full shadow-md ${!isClickSort ? "hidden" : "block"} shadow-black `}>
          {sortTypes.map((list) => {
            return <li key={list} className="px-3 py-3 justify-center w-full text-sm font-semibold text-gray-500 flex items-center cursor-pointer" onClick={() => sortingModel(list)}><p>{list} {sortTypeState(list)[0] ? <span>&darr;</span> : <span>&uarr;</span>}</p></li>
          })}
        </ul>
      </div>

    </div >

  );
}

export default SearchBar;
