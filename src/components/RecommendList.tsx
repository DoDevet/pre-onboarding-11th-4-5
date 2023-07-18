import { useEffect, useState } from "react";
import { ISearchData } from "../hooks/useQuery";

const RecommendList = ({
  data,
  loading,
  input,
}: {
  data: ISearchData[] | undefined;
  loading: boolean;
  input: string;
}) => {
  return input ? (
    <div className="bg-white p-2 w-full min-h-[48px] divide-y">
      <p>검색어</p>
      <div>{input}</div>
      {data && data.length !== 0 && (
        <>
          <p>추천 검색어</p>
          <div className="flex flex-col">
            {data.map((data, index) => (
              <a
                href="/"
                key={index}
                className="rounded-md outline-none cursor-pointer focus:ring focus:ring-sky-400"
              >
                {data.sickNm}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  ) : (
    <div></div>
  );
};

export default RecommendList;
