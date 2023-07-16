import { useEffect, useState } from "react";

//type UseQueryReturnType<T>
const DB_URL = "http://localhost:4000/";

interface useQueryProps {
  keyword: string;
}
interface ISearchData {
  sickCd: string;
  sickNm: string;
}

interface IGetSearchData {
  data: ISearchData[];
  expire: number;
}
interface IStateProps {
  data?: ISearchData[];
  error?: any;
  loading: boolean;
}

const getLocalCache = (keyword: string) => {
  const localCache = localStorage.getItem(keyword);
  if (localCache) {
    const { expire, data }: IGetSearchData = JSON.parse(localCache);
    if (expire < Date.now()) {
      localStorage.removeItem(keyword);
      return;
    }
    return data;
  }
};
const setLocalCache = (keyword: string, data: ISearchData[]) => {
  const date = new Date();
  localStorage.setItem(
    keyword,
    JSON.stringify({
      data,
      expire: date.setMinutes(date.getMinutes() + 1),
    })
  );
};

const FilterData = (data: ISearchData[], keyword: string) => {
  return data.filter(
    (prev) => prev.sickNm[keyword.length - 1] === keyword[keyword.length - 1]
  );
};

const useQuery = ({ keyword = "" }: useQueryProps) => {
  const [state, setState] = useState<IStateProps>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  useEffect(() => {
    const data = getLocalCache(keyword);

    const handler = () => {
      if (data) setState((prev) => ({ ...prev, data }));
      if (keyword === "") setState((prev) => ({ ...prev, data: [] }));
      if (keyword !== "" && !data) {
        setState((prev) => ({ ...prev, loading: true }));
        fetch(DB_URL + `sick?q=${keyword}`)
          .then((res) => res.json())
          .then((data) => {
            const filterData = FilterData(data, keyword);
            setState((prev) => ({ ...prev, data: filterData }));
            setLocalCache(keyword, filterData);
            return data;
          })
          .catch((e) => setState((prev) => ({ ...prev, error: e })))
          .finally(() => setState((prev) => ({ ...prev, loading: false })));
      }
    };
    handler();
  }, [keyword]);

  return { ...state };
};

export default useQuery;
