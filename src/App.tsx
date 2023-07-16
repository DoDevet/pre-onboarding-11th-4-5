import React, { useEffect, useState } from "react";

interface Keyword {
  keyword: string;
  search_data: ISearchData[];
}

interface ISearchData {
  sickCd: string;
  sickNm: string;
}

function App() {
  const [searchData, setSearchData] = useState<Keyword[]>([
    { keyword: "", search_data: [] },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const getSearchParams = () => {
      if (
        input !== "" &&
        searchData?.findIndex((prev) => prev.keyword === input) === -1
      )
        (async () => {
          const data: ISearchData[] = await (
            await fetch(`http://localhost:4000/sick?q=${input}`)
          ).json();
          console.log("calling api");
          setSearchData((prev) => {
            const searchList = prev ? [...prev] : [];
            searchList?.push({
              keyword: input,
              search_data: data?.filter(
                (prev) =>
                  prev.sickNm[input.length - 1] === input[input.length - 1]
              ),
            });
            return searchList;
          });
        })();
    };
    const interval = setInterval(getSearchParams, 150);
    return () => clearInterval(interval);
  }, [input, searchData]);

  return (
    <>
      <div className="flex items-center flex-col min-h-screen space-y-3 max-w-sm mx-auto ">
        <h1 className="py-20">Search Data</h1>
        <form className="w-full">
          <input
            className="w-full px-2"
            placeholder="Input"
            onChange={(e) => setInput(e.currentTarget.value)}
          />
        </form>

        <div className="bg-white p-2 w-full min-h-[48px] divide-y">
          {input && (
            <>
              <p>검색어</p>
              <div>{input}</div>
            </>
          )}

          <div>
            <p>추천 검색어</p>
            {searchData?.map((data) =>
              data.keyword === input
                ? data.search_data.map((data) => (
                    <div key={data.sickCd}>{data.sickNm}</div>
                  ))
                : ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
