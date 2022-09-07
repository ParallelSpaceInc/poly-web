import Image from "next/image";
import { ModelInfos } from "pages/models";
import React, { Dispatch, SetStateAction, useState } from "react";

interface props {
  setModels: Dispatch<SetStateAction<ModelInfos | undefined>>
  isClickSort: boolean,
  closeSortingModel: () => void
  setIsClickSort: Dispatch<SetStateAction<boolean>>
}
type query = {
  sort: string,
  filterByName?: string
}
type sortType = "Last Added" | "Size" | "Alphabetic"
type srotTypes = sortType[]

function SearchBar({ setModels, isClickSort, closeSortingModel, setIsClickSort }: props) {

  const sortTypes: srotTypes = ["Last Added", "Size", "Alphabetic"]
  const [currentSortType, setCurrentSortType] = useState<string>(sortTypes[0])
  const isDescOfLastAdded = useState<boolean>(true)
  const isDescOfSize = useState<boolean>(true)
  const isDescOfAlphabetic = useState<boolean>(false)
  const [filterByName, setFilterByName] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("");



  const sortingModel = async (type: string) => {
    const [isDescState, setIsDescState] = sortTypeIsDesc(type)
    let isDesc = isDescState
    if (type === currentSortType) {
      setIsDescState(prev => !prev)
      isDesc = !isDesc
    }

    setCurrentSortType(type)

    await getModels(type, isDesc, filterByName);

    closeSortingModel();
  }


  const searchModel = async (e?: React.KeyboardEvent<HTMLInputElement>) => {

    if (e?.key !== 'Enter') {
      return
    }

    if (filterByName === inputValue) {
      return
    }

    setFilterByName(inputValue)

    const isDescState = sortTypeIsDesc(currentSortType)

    await getModels(currentSortType, isDescState[0], inputValue)

  }

  const sortTypeIsDesc = (type: string): [boolean, Dispatch<SetStateAction<boolean>>] => {
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

  const getQuery = (type: string, isDesc: boolean, filterByName: string) => {
    const sort = `${type.concat(`,${isDesc}`)}`
    const name = filterByName.replace(/\s/gi, "") !== "" ? filterByName.trim() : undefined
    let query: query = {
      sort: sort,
    }

    if (name) {
      query = { ...query, filterByName: name }
    }

    const queryString = new URLSearchParams(query).toString();
    return queryString
  }

  const getModels = async (type: string, isDescState: boolean, filterByName: string) => {
    const query = getQuery(type, isDescState, filterByName);
    const { data, error } = await fetch(`/api/models?${query}`, {
      method: "GET",
    }).then((res) => res.json())
    const loading = !data && !error;
    setModels({
      loading,
      data,
      error
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (

    <div className="w-full flex justify-between mt-6">
      <div className="w-3/4 relative ring-2 ring-gray-300 focus:ring-indigo-500 rounded-md outline-none flex justify-center items-center">
        <div className="p-2 border-none rounded-md outline-none pl-4 flex-1 text-xl">
          <input
            className="w-full outline-none"
            placeholder="Find model"
            defaultValue={inputValue}
            onChange={onChange}
            onKeyDown={(e) => searchModel(e)}
          />
        </div>

        <div className="pr-3 flex items-center cursor-pointer"
          onClick={() => searchModel()}
        >
          <Image src="/searchIcon.png" width="20px" height="20px" alt="find model" />
        </div>
      </div>
      <div id="sorting" className="rounded-md ring-2 ring-gray-300 md:w-1/6 w-[22%] text-center flex justify-center items-center relative cursor-pointer">
        <div className="w-full font-semibold text-gray-500 h-full text-sm border-none outline-none flex justify-center items-center"
          onClick={() => {
            setIsClickSort(!isClickSort)
          }}
        >
          <div className="w-full break-words md:text-sm text-[11px] px-1">{currentSortType} {sortTypeIsDesc(currentSortType)[0] ? <span>&darr;</span> : <span>&uarr;</span>}</div>
        </div>
        <ul className={`absolute top-12 left-0 z-10 divide-y-2 bg-white border-gray-300 border-2 rounded-md w-full shadow-md ${!isClickSort ? "hidden" : "block"} shadow-black `}>
          {sortTypes.map((list) => {
            return <li key={list} className="md:px-3  px-2 md:py-3 py-2  justify-center w-full text-sm font-semibold text-gray-500 flex items-center cursor-pointer" onClick={() => sortingModel(list)}>
              <p className="w-full break-words md:text-sm text-[11px] md:leading-normal leading-tight ">{list} {sortTypeIsDesc(list)[0] ? <span>&darr;</span> : <span>&uarr;</span>}
              </p>
            </li>
          })}
        </ul>
      </div>

    </div >

  );
}

export default SearchBar;
