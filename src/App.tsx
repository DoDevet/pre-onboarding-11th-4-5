import React, { useEffect, useRef, useState } from "react";
import useQuery from "./hooks/useQuery";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");
  const { data, loading, error } = useQuery({ keyword });

  useEffect(() => {
    const interval = setInterval(
      () => inputRef && inputRef.current && setKeyword(inputRef.current.value),
      500
    );
    return () => clearInterval(interval);
  }, [inputRef]);

  return (
    <div className="flex items-center flex-col min-h-screen space-y-3 max-w-sm mx-auto ">
      <h1 className="py-20">Search Data</h1>
      <form className="w-full">
        <input ref={inputRef} className="w-full px-2" placeholder="Input" />
      </form>

      <div className="bg-white p-2 w-full min-h-[48px] divide-y">
        {keyword && (
          <>
            <p>검색어</p>
            <div>{keyword}</div>
          </>
        )}

        <div>
          <p>추천 검색어</p>
          {data?.map((data) => (
            <div key={data.sickCd}>{data.sickNm}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
