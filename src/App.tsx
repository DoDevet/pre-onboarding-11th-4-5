import React, { useEffect, useRef, useState } from "react";
import useQuery from "./hooks/useQuery";

function App() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const { data, loading, error } = useQuery({ keyword });
  const divRef = useRef<HTMLDivElement>(null);
  const [searchListNum, setSearchListNum] = useState(-1);
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.currentTarget.value);

  useEffect(() => {
    const interval = setInterval(() => setKeyword(input), 500);
    return () => clearInterval(interval);
  }, [input]);

  useEffect(() => {
    if (data?.length && searchListNum !== -1) {
      const divNode = divRef.current;
      const anchorNode = divNode?.querySelectorAll("div > a") as
        | HTMLAnchorElement[]
        | undefined;
      console.log(anchorNode);
      anchorNode && anchorNode[searchListNum % data.length].focus();
    }
  }, [searchListNum, data]);

  const onPushKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data) {
      if (e.code === "ArrowDown") {
        setSearchListNum((prev) => (prev + 1) % data.length);
      } else if (e.code === "ArrowUp") {
        setSearchListNum((prev) =>
          prev - 1 < 0 ? data.length - 1 : (prev - 1) % data.length
        );
      } else setSearchListNum(-1);
    } else return;
  };
  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (divRef && divRef.current && e.code === "ArrowDown") {
      const anchorNode = divRef.current.querySelector(
        "div > a"
      ) as HTMLAnchorElement;
      anchorNode && anchorNode.focus();
    }
  };
  return (
    <div className="flex flex-col items-center max-w-sm min-h-screen mx-auto space-y-3">
      <h1 className="py-20">Search Data</h1>
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <input
          onKeyUp={enter}
          className="w-full px-2"
          placeholder="Input"
          value={input}
          onChange={onChangeText}
        />
      </form>

      <div className="bg-white p-2 w-full min-h-[48px] divide-y">
        <p>검색어</p>
        <div>{input}</div>

        <p>추천 검색어</p>
        <div ref={divRef} onKeyUpCapture={onPushKey} className="flex flex-col">
          {data?.map((data, index) => (
            <a
              href="/"
              key={index}
              className="rounded-md outline-none cursor-pointer focus:ring focus:ring-sky-400"
            >
              {data.sickNm}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
