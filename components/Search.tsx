import { Categories } from "@libs/client/Util";
import Image from "next/image";
import { ModelInfos } from "pages/models";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
interface Props {
  setModels: Dispatch<SetStateAction<ModelInfos | undefined>>;
}
type Query = {
  sort: string;
  orderBy: string;
  filterByName?: string;
};
type SortType = "Last Added" | "Size" | "Alphabetic" | "Popularity";
type SortTypes = SortType[];
interface IsDescOfSortType {
  lastAdded: boolean;
  size: boolean;
  alphabetic: boolean;
  popularity: boolean;
  [prop: string]: boolean;
}

interface OrderByKey {
  lastAdded: string;
  size: string;
  alphabetic: string;
  [prop: string]: string;
}

const orderByKey: OrderByKey = {
  lastAdded: "createdAt",
  size: "modelSize",
  alphabetic: "name",
  popularity: "viewed",
};

const categories: string[] = ["All categories", ...Categories];

function SearchBar({ setModels }: Props) {
  const defaultIsDesc: IsDescOfSortType = {
    lastAdded: true,
    size: true,
    alphabetic: false,
    popularity: true,
  };

  const sortTypes: SortTypes = [
    "Popularity",
    "Last Added",
    "Size",
    "Alphabetic",
  ];
  const [currentSortType, setCurrentSortType] = useState<SortType>(
    sortTypes[0]
  );
  const [isDesc, setIsDesc] = useState<IsDescOfSortType>({ ...defaultIsDesc });
  const [filterByName, setFilterByName] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>(categories[0]);

  const [isClickSort, setIsClickSort] = useState<boolean>(false);
  const [isClickCategory, setIsClickCategory] = useState<boolean>(false);

  const closeSortingModel = () => {
    setIsClickSort(false);
  };
  const closeCategoryModel = () => {
    setIsClickCategory(false);
  };

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (e.target instanceof Element) {
        const isModalClicked = !!e.target.closest("#sorting");
        if (isModalClicked) {
          closeCategoryModel();
          return;
        }
        const isCategoryModalClicked = !!e.target.closest("#category");
        if (isCategoryModalClicked) {
          closeSortingModel();
          return;
        }
      }
      closeCategoryModel();
      closeSortingModel();
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const getModelsCallBack = useCallback(async () => {
    const isDescOfSort = isDesc[getSortTypeKey(currentSortType)];
    const sort = orderByKey[`${getSortTypeKey(currentSortType)}`];
    const orderBy = isDescOfSort ? "desc" : "asc";
    const filter =
      filterByName.replace(/\s/gi, "") !== "" ? filterByName.trim() : undefined;
    const query: Query = {
      sort,
      orderBy,
    };
    if (filter) {
      Object.assign(query, { filterByName: filter });
    }

    if (currentCategory !== categories[0]) {
      Object.assign(query, { category: currentCategory });
    }

    const queryString = new URLSearchParams(query).toString();

    const { data, error } = await fetch(`/api/models?${queryString}`, {
      method: "GET",
    }).then((res) => res.json());
    const loading = !data && !error;
    setModels({
      loading,
      data,
      error,
    });
  }, [currentSortType, filterByName, isDesc, setModels, currentCategory]);

  useEffect(() => {
    getModelsCallBack();
  }, [getModelsCallBack]);

  const sortingModel = async (type: SortType) => {
    const sortType = getSortTypeKey(type);
    const sortTypeIsDesc = isDesc[sortType];
    if (type === currentSortType) {
      isDesc[sortType] = !sortTypeIsDesc;
      setIsDesc({ ...isDesc });
    } else {
      setCurrentSortType(type);
    }
    closeSortingModel();
  };

  const getSortTypeKey = (type: SortType): string => {
    const sortType =
      type.charAt(0).toLowerCase() + type.slice(1).replace(" ", "");
    return sortType;
  };

  const searchModel = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e && e?.key !== "Enter") || filterByName === inputValue) {
      return;
    }

    setFilterByName(inputValue);
  };

  const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const arrowIcon = (
    sortType: SortType
  ): React.ReactElement<HTMLSpanElement> => {
    const wahtArrow = (isDesc: boolean) => {
      if (isDesc) {
        return <span>&darr;</span>;
      }
      return <span>&uarr;</span>;
    };

    if (sortType === currentSortType) {
      return wahtArrow(!isDesc[getSortTypeKey(sortType)]);
    }
    return wahtArrow(isDesc[getSortTypeKey(sortType)]);
  };

  const onChangeCategory = (category: string) => {
    setCurrentCategory(category);
    setIsClickCategory(false);
  };

  return (
    <div className="space-y-5">
      <div className="w-full flex justify-between mt-6">
        <div className="w-3/4 relative ring-2 ring-gray-300 focus:ring-indigo-500 rounded-md outline-none flex justify-center items-center">
          <div className="p-2 border-none rounded-md outline-none pl-4 flex-1 text-xl">
            <input
              className="w-full outline-none"
              placeholder="Find model"
              defaultValue={inputValue}
              onChange={onChangeFilter}
              onKeyDown={(e) => searchModel(e)}
            />
          </div>

          <div
            className="pr-3 flex items-center cursor-pointer"
            onClick={() => searchModel()}
          >
            <Image
              src="/searchIcon.png"
              width="20px"
              height="20px"
              alt="find model"
            />
          </div>
        </div>
        <div
          id="sorting"
          className="rounded-md ring-2 ring-gray-300 md:w-1/6 w-[22%] text-center flex justify-center items-center relative cursor-pointer"
        >
          <div
            className="w-full font-semibold text-gray-500 h-full text-sm border-none outline-none flex justify-center items-center"
            onClick={() => {
              setIsClickSort(!isClickSort);
            }}
          >
            <div className="w-full break-words md:text-sm text-[11px] px-1">
              {currentSortType}{" "}
              {isDesc[getSortTypeKey(currentSortType)] ? (
                <span>&darr;</span>
              ) : (
                <span>&uarr;</span>
              )}
            </div>
          </div>
          <ul
            className={`absolute top-12 left-0 z-10 divide-y-2 bg-white border-gray-300 border-2 rounded-md w-full shadow-md ${
              !isClickSort ? "hidden" : "block"
            } shadow-black `}
          >
            {sortTypes.map((list) => {
              return (
                <li
                  key={list}
                  className="md:px-3  px-2 md:py-3 py-2  justify-center w-full text-sm font-semibold text-gray-500 flex items-center cursor-pointer"
                  onClick={() => sortingModel(list)}
                >
                  <p className="w-full break-words md:text-sm text-[11px] md:leading-normal leading-tight ">
                    {list} {arrowIcon(list)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="py-2w-full space-x-3 flex item-center flex-row">
        <div
          className="text-center  md:w-[12%] w-1/2 cursor-pointer text-sm text-gray-500  relative"
          id="category"
        >
          <div
            className="space-x-1 md:p-2 py-2 w-full rounded-md border-2"
            onClick={() => setIsClickCategory(!isClickCategory)}
          >
            <p className="inline-block">{currentCategory}</p>
            <p className="inline-block">
              <Image
                src="/list_gray.png"
                width="10px"
                height="10px"
                alt="list"
              />
            </p>
          </div>
          <div className="absolute w-full z-10 left-0 top-11">
            <ul
              className={`w-full divide-y border-2 shadow-md rounded-md  bg-white overflow-hidden ${
                isClickCategory ? "block" : "hidden border-none"
              }`}
            >
              {categories.map((list) => {
                return (
                  <li
                    key={list}
                    className="py-2 text-xs"
                    onClick={() => onChangeCategory(list)}
                  >
                    {list}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
