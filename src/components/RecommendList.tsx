import React from "react";
import SearchIcon from "./SearchIcon";
import { ISearchData } from "../types/responseData";

const RecommendList = ({
  data,
  loading,
  input,
  focus,
}: {
  data: ISearchData[] | undefined;
  loading: boolean;
  input: string;
  focus: number;
}) => {
  return (
    <div className="bg-white p-6 w-full min-h-[48px] rounded-xl">
      <div className="flex items-center space-x-3">
        <SearchIcon className="w-3 h-3 text-gray-500" />
        <p className="font-semibold">{input}</p>
      </div>
      {loading && <p className="py-2 text-sm text-gray-500">검색중</p>}

      {data && data.length !== 0 && (
        <>
          <p className="py-2 text-sm text-gray-500">추천 검색어</p>
          <div className="flex flex-col space-y-3">
            {data.map((data, index) => {
              return (
                <div
                  key={data.sickCd}
                  className="flex items-center w-full space-x-3"
                >
                  <SearchIcon className="w-3 h-3 text-gray-500" />
                  <a
                    href="/"
                    onClick={() => alert(data.sickNm)}
                    className={`w-full rounded-md outline-none cursor-pointer ${
                      index === focus && "ring-2 ring-blue-500 ring-offset-2"
                    }`}
                  >
                    {data.sickNm}
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
      {data?.length === 0 && !loading && (
        <p className="py-2 text-sm text-gray-500">검색어 없음</p>
      )}
    </div>
  );
};

export default RecommendList;
