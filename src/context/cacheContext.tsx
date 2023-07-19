import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ISearchData } from "../types/responseData";
import { GetSearchData } from "../types/cache";

export interface IGetSearchCache {
  [keyword: string]: GetSearchData;
}

const GetCacheItem = createContext<{
  (keyword: string): ISearchData[] | undefined;
} | null>(null);
const SetCacheItem = createContext<{
  (data: ISearchData[], keyword: string): void;
} | null>(null);

const EXPIRE_TIME = 10000;

export const useGetCache = () => useContext(GetCacheItem);
export const useSetCache = () => useContext(SetCacheItem);

const CacheProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cache, setCache] = useState<IGetSearchCache>();
  const setCacheData = useCallback((data: ISearchData[], keyword: string) => {
    setCache((prev) => {
      return { ...prev, [keyword]: { data, expire: Date.now() + EXPIRE_TIME } };
    });
  }, []);
  const getCacheData = useCallback(
    (keyword: string) => {
      if (cache) return cache[keyword]?.data;
    },
    [cache]
  );

  useEffect(() => {
    const handleCleanCache = (cache?: IGetSearchCache) => {
      if (cache && Object.keys(cache).length !== 0) {
        const keys = Object.keys(cache).filter(
          (key) => cache[key].expire < Date.now()
        );
        if (keys.length !== 0) {
          console.log("Delete Keys: ", keys);
          setCache((prev) => {
            const copyObj = { ...prev };
            keys.forEach((key) => delete copyObj[key]);
            return copyObj;
          });
        }
      }
    };
    const interval = setInterval(() => handleCleanCache(cache), 1000);
    return () => clearInterval(interval);
  }, [cache]);

  return (
    <SetCacheItem.Provider value={setCacheData}>
      <GetCacheItem.Provider value={getCacheData}>
        {children}
      </GetCacheItem.Provider>
    </SetCacheItem.Provider>
  );
};

export default CacheProvider;
