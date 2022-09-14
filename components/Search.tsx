import Image from "next/image";
import { ModelInfos } from "pages/models";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
interface Props {
  setModels: Dispatch<SetStateAction<ModelInfos | undefined>>
  isClickSort: boolean,
  closeSortingModel: () => void
  setIsClickSort: Dispatch<SetStateAction<boolean>>
}
type Query = {
  sort: string,
  orderBy: string,
  filterByName?: string
}
type SortType = "Last Added" | "Size" | "Alphabetic"
type SortTypes = SortType[]
interface IsDescOfSortType {
  lastAdded: boolean,
  size: boolean,
  alphabetic: boolean
  [prop: string]: boolean;
}

interface OrderByKey {
  lastAdded: string,
  size: string,
  alphabetic: string
  [prop: string]: string;
}

const orderByKey: OrderByKey = {
  lastAdded: "createdAt",
  size: "modelSize",
  alphabetic: "name"
}

function SearchBar({ setModels, isClickSort, closeSortingModel, setIsClickSort }: Props) {

  const defaultIsDesc: IsDescOfSortType = {
    lastAdded: true,
    size: true,
    alphabetic: false
  }

  const sortTypes: SortTypes = ["Last Added", "Size", "Alphabetic"]
  const [currentSortType, setCurrentSortType] = useState<SortType>(sortTypes[0])
  const [isDesc, setIsDesc] = useState<IsDescOfSortType>({ ...defaultIsDesc })
  const [filterByName, setFilterByName] = useState<string>("")
  const [inputValue, setInputValue] = useState<string>("");

  const getModelsCallBack = useCallback(async () => {
    const isDescOfSort = isDesc[getSortTypeKey(currentSortType)]
    const sort = orderByKey[`${getSortTypeKey(currentSortType)}`]
    const orderBy = isDescOfSort ? "desc" : "asc"
    const filter = filterByName.replace(/\s/gi, "") !== "" ? filterByName.trim() : undefined
    const query: Query = {
      sort,
      orderBy
    }
    if (filter) {
      Object.assign(query, { filterByName: filter })
    }
    const queryString = new URLSearchParams(query).toString();
    const { data, error } = await fetch(`/api/models?${queryString}`, {
      method: "GET",
    }).then((res) => res.json())
    const loading = !data && !error;
    setModels({
      loading,
      data,
      error
    })
  }, [currentSortType, filterByName, isDesc, setModels])

  useEffect(() => {
    getModelsCallBack()
  }, [getModelsCallBack])


  const sortingModel = async (type: SortType) => {
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

  const getSortTypeKey = (type: SortType): string => {
    const sortType = (type.charAt(0).toLowerCase() + type.slice(1).replace(" ", ""));
    return sortType
  }

  const searchModel = async (e?: React.KeyboardEvent<HTMLInputElement>) => {

    if ((e && e?.key !== 'Enter') || filterByName === inputValue) {
      return
    }

    setFilterByName(inputValue)
  }



  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const arrowIcon = (sortType: SortType): React.ReactElement<HTMLSpanElement> => {
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
    <div className="space-y-5">
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
    </div>
  );
}

export default SearchBar;