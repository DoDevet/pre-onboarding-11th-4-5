import React, { useEffect, useRef, useState } from "react";
import useQuery from "./hooks/useQuery";
import RecommendList from "./components/RecommendList";

function App() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchListNum, setSearchListNum] = useState(-1);
  const { data, loading, error } = useQuery({ keyword });
  const divRef = useRef<HTMLDivElement>(null);
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.currentTarget.value);

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (divRef && divRef.current && data && data.length !== 0) {
      if (e.code === "ArrowDown") setSearchListNum((prev) => prev + 1);
      if (e.code === "ArrowUp") {
        searchListNum <= 0
          ? setSearchListNum(data.length)
          : setSearchListNum((prev) => prev - 1);
      }
    } else return;
  };

  useEffect(() => {
    const ControlKey = () => {
      if (data?.length && divRef && divRef.current) {
        let nodes = [
          divRef.current.querySelector("input"),
          ...divRef.current.querySelectorAll("a"),
        ];
        nodes[searchListNum]!.focus();
      }
    };
    ControlKey();
  }, [data, divRef, searchListNum]);

  useEffect(() => {
    const interval = setInterval(() => setKeyword(input), 500);
    return () => clearInterval(interval);
  }, [input]);

  return (
    <div
      className="flex flex-col items-center max-w-sm min-h-screen mx-auto space-y-3"
      ref={divRef}
      onKeyUpCapture={enter}
    >
      <h1 className="py-20">Search Data</h1>
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <input
          className="w-full px-2"
          placeholder="Input"
          value={input}
          onChange={onChangeText}
        />
      </form>

      <RecommendList data={data} input={input} loading={loading} />
    </div>
  );
}

export default App;
