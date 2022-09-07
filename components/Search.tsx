import Image from "next/image";
import { ModelInfos } from "pages/models";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
interface isDescOfSortType {
  lastAdded: boolean,
  size: boolean,
  alphabetic: boolean
  [prop: string]: boolean;
}

function SearchBar({ setModels, isClickSort, closeSortingModel, setIsClickSort }: props) {

  const defaultIsDesc = {
    lastAdded: true,
    size: true,
    alphabetic: false
  }

  const sortTypes: srotTypes = ["Last Added", "Size", "Alphabetic"]
  const [currentSortType, setCurrentSortType] = useState<string>(sortTypes[0])
  const [isDesc, setIsDesc] = useState<isDescOfSortType>({ ...defaultIsDesc })
  const [filterByName, setFilterByName] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {

    (async () => {
      console.log(filterByName)
      await getModels(currentSortType, filterByName);
    })();
  }, [currentSortType, JSON.stringify(isDesc), filterByName])

  const sortingModel = async (type: string) => {
    const sortType = getSortTypeKey(type)
    const sortTypeIsDesc = isDesc[sortType]
    if (type === currentSortType) {
      isDesc[sortType] = !sortTypeIsDesc
      setIsDesc({ ...isDesc })
    } else {
      setCurrentSortType(type)
    }
    closeSortingModel();
  }

  const getSortTypeKey = (type: string): string => {
    const sortType = (type.charAt(0).toLowerCase() + type.slice(1).replace(" ", ""));
    return sortType
  }

  const searchModel = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e?.key !== 'Enter') {
      return
    }

    if (filterByName === inputValue) {
      return
    }
    setFilterByName(inputValue)
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

  const getModels = async (type: string, filterByName: string) => {
    const isDescOfSort = isDesc[getSortTypeKey(type)]
    const query = getQuery(type, isDescOfSort, filterByName);
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

  const arrowIcon = (sortType: string): React.ReactElement<HTMLSpanElement> => {
    const wahtArrow = (isDesc: boolean) => {
      if (isDesc) {
        return <span>&darr;</span>
      }
      return <span>&uarr;</span>
    }

    if (sortType === currentSortType) {
      return wahtArrow(!isDesc[getSortTypeKey(sortType)])
    }
    return wahtArrow(isDesc[getSortTypeKey(sortType)])

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

        >
          <Image src="/searchIcon.png" width="20px" height="20px" alt="find model"
            onClick={() => searchModel()}
          />
        </div>
      </div>
      <div id="sorting" className="rounded-md ring-2 ring-gray-300 md:w-1/6 w-[22%] text-center flex justify-center items-center relative cursor-pointer">
        <div className="w-full font-semibold text-gray-500 h-full text-sm border-none outline-none flex justify-center items-center"
          onClick={() => {
            setIsClickSort(!isClickSort)
          }}
        >
          <div className="w-full break-words md:text-sm text-[11px] px-1">{currentSortType} {isDesc[getSortTypeKey(currentSortType)] ? <span>&darr;</span> : <span>&uarr;</span>}</div>
        </div>
        <ul className={`absolute top-12 left-0 z-10 divide-y-2 bg-white border-gray-300 border-2 rounded-md w-full shadow-md ${!isClickSort ? "hidden" : "block"} shadow-black `}>
          {sortTypes.map((list) => {
            return <li key={list} className="md:px-3  px-2 md:py-3 py-2  justify-center w-full text-sm font-semibold text-gray-500 flex items-center cursor-pointer"
              onClick={() => sortingModel(list)}>
              <p className="w-full break-words md:text-sm text-[11px] md:leading-normal leading-tight ">{list} {arrowIcon(list)}
              </p>
            </li>
          })}
        </ul>
      </div>
    </div >

  );
}

export default SearchBar;
