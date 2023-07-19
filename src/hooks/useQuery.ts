import { useEffect, useState } from "react";
import { useGetCache, useSetCache } from "../context/cacheContext";
import { IStateProps } from "../types/usequey";

const DB_URL = "http://localhost:4000/";

interface useQueryProps {
  keyword: string;
}

const useQuery = ({ keyword = "" }: useQueryProps) => {
  const [state, setState] = useState<IStateProps>({
    data: undefined,
    error: undefined,
    loading: true,
  });
  const setCache = useSetCache();
  const getCache = useGetCache();

  useEffect(() => {
    const data = getCache ? getCache(keyword) : null;
    const handler = () => {
      if (data) setState((prev) => ({ ...prev, data }));
      if (keyword === "") setState((prev) => ({ ...prev, data: undefined }));
      if (keyword !== "" && !data && setCache) {
        console.log("calling api");
        setState((prev) => ({ ...prev, loading: true }));
        fetch(DB_URL + `sick?q=${keyword}`)
          .then((res) => res.json())
          .catch((e) => setState((prev) => ({ ...prev, error: e })))
          .then((data) => {
            setState((prev) => ({ ...prev, data }));
            setCache(data, keyword);
            return data;
          })
          .catch((e) => setState((prev) => ({ ...prev, error: e })))
          .finally(() => setState((prev) => ({ ...prev, loading: false })));
      }
    };
    handler();
  }, [keyword, setCache, getCache]);

  return { ...state };
};

export default useQuery;
