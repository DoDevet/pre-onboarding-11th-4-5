import React, { useEffect, useRef, useState } from "react";
import useQuery from "./hooks/useQuery";
import RecommendList from "./components/RecommendList";
import SearchIcon from "./components/SearchIcon";
import { FirstImage, SecondImage, TthirdImage } from "./components/SvgImages";
const DELAY = 500;
function App() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [listInfo, setListInfo] = useState("");
  const [searchListNum, setSearchListNum] = useState(-1);

  const { data, loading } = useQuery({ keyword });
  const divRef = useRef<HTMLDivElement>(null);

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchListNum(-1);
    setListInfo("");
    setInput(e.currentTarget.value);
  };

  const onKeyControl = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (divRef && divRef.current && data && data.length !== 0) {
      if (e.code === "ArrowDown") {
        setSearchListNum((prev) => prev + 1);
      }
      if (e.code === "ArrowUp") {
        if (searchListNum === -1) setSearchListNum(data.length - 1);
        else setSearchListNum((prev) => prev - 1);
      }
      if (e.code === "Enter") {
        if (listInfo) setInput(listInfo);
        setListInfo("");
        return;
      }
    }
  };

  useEffect(() => {
    const ControlKey = () => {
      if (data?.length && divRef && divRef.current) {
        let nodes = divRef.current.querySelectorAll("a");
        if (nodes[searchListNum]) {
          setListInfo(nodes[searchListNum].innerText);
        } else {
          setSearchListNum(-1);
          setListInfo("");
        }
      }
    };
    ControlKey();
  }, [data, divRef, searchListNum]);

  useEffect(() => {
    const interval = setInterval(() => setKeyword(input), DELAY);
    return () => clearInterval(interval);
  }, [input]);

  return (
    <div
      className="relative flex flex-col items-center max-w-md min-h-screen mx-auto space-y-3"
      ref={divRef}
      onKeyDown={onKeyControl}
    >
      <h1 className="py-10 mt-10 text-[38px] font-bold text-center">
        국내 모든 임상시험 검색하고 온라인으로 참여하기
      </h1>
      <form
        className="relative w-full"
        onSubmit={(e) => {
          e.preventDefault();
          alert(input);
          setInput("");
          setListInfo("");
        }}
      >
        <input
          className="w-full px-4 py-6 rounded-full outline-none focus:ring-blue-500 focus:ring-2"
          placeholder="질환명을 입력해주세요"
          value={listInfo ? listInfo : input}
          onChange={onChangeText}
        />
        <button className="bg-[#007BE9] p-3 rounded-full absolute right-3 top-3">
          <SearchIcon className="w-5 h-5 text-white" />
        </button>
      </form>
      {input && (
        <RecommendList
          data={data}
          input={input}
          loading={loading}
          focus={searchListNum}
        />
      )}
      <FirstImage />
      <SecondImage />
      <TthirdImage />
    </div>
  );
}

export default App;
