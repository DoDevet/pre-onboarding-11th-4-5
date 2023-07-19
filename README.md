## 성함
도지훈

## 캐싱구현
  Cache를 다루는 Context를 생성하여 구현.
  
  캐시데이터 구조는 object 형식
  ```jsx
  {
    "test2": { //키워드
        "data": [],
        "expire": 1689749294835
    },
    "test1": {
        "data": [],
        "expire": 1689749296800
    },
    "test4": {
        "data": [],
        "expire": 1689749297900
    },
    "test3": {
        "data": [],
        "expire": 1689749298942
    },
    "test6": {
        "data": [],
        "expire": 1689749299912
    }
}
  ```
  + 캐시 저장 코드
    ```jsx
    const setCacheData = useCallback((data: ISearchData[], keyword: string) => {
      setCache((prev) => {
        return { ...prev, [keyword]: { data, expire: Date.now() + EXPIRE_TIME } };
      });
    }, []);
    ```
    Api 호출을 통해 얻은 data와 keyword 를 매개변수로 받는다.
    keyword를 키값으로 취급하여 저장
  
  + 캐시 호출 코드
    ```jsx
    const getCacheData = useCallback(
      (keyword: string) => {
        if (cache) return cache[keyword]?.data;
      },
      [cache]
    );
    ```
    keyword 를 입력하면 캐시에 있는 data(검색 리스트)를 return 해준다.
  
  + 캐시 관리 (expire time 구현)
    ```jsx
    useEffect(() => {
    const handleCleanCache = (cache?: IGetSearchCache) => {
      if (cache && Object.keys(cache).length !== 0) {
        const keys = Object.keys(cache).filter(
          (key) => cache[key].expire < Date.now()
        );
        // Expire 데이터들의 키를 수집함
        if (keys.length !== 0) { // 캐시 데이터 삭제
          console.log("Delete Keys: ", keys);
          setCache((prev) => {
            const copyObj = { ...prev };
            keys.forEach((key) => delete copyObj[key]);
            return copyObj;
            
          });
        }
      }
    };
    const interval = setInterval(() => handleCleanCache(cache), 1000); // 매 1초마다 실행
    return () => clearInterval(interval); }, [cache]);
    ```
    1초마다 실행되는 코드로, expire time을 넘은 키값들을 수집하여 삭제한다.

  + Context Api
    ```jsx
    const GetCacheItem = createContext<{
      (keyword: string): ISearchData[] | undefined;
    } | null>(null);
    const SetCacheItem = createContext<{
      (data: ISearchData[], keyword: string): any;
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
    ```
    + Provider 적용 (index.tsx)
      ```jsx
      const root = ReactDOM.createRoot(
      document.getElementById("root") as HTMLElement
        );
        root.render(
          <CacheProvider>
            <App />
          </CacheProvider>
        );
      ```
## API 호출 훅 (useQuery)
키워드가 있고 캐시 Provider에 해당 키워드를 키값으로 하는 데이터가 없다면 API를 호출한다.
  ```jsx
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
  const setCache = useSetCache(); // 캐시 Provider 
  const getCache = useGetCache(); // 캐시 Provider

  useEffect(() => {
    const data = getCache ? getCache(keyword) : null;
    const handler = () => {
      if (data) setState((prev) => ({ ...prev, data })); // 캐시 데이터가 존재하면 그 데이터로 설정함.
      if (keyword === "") setState((prev) => ({ ...prev, data: undefined })); // 키워드가 없다면 호출하지 않음
      if (keyword !== "" && !data && setCache) { //키워드가 존재하고 캐시데이터가 없다면 호출 시작
        console.log("calling api");
        setState((prev) => ({ ...prev, loading: true }));
        fetch(DB_URL + `sick?q=${keyword}`)
          .then((res) => res.json())
          .catch((e) => setState((prev) => ({ ...prev, error: e })))
          .then((data) => {
            setState((prev) => ({ ...prev, data }));
            setCache(data, keyword); // 캐시에 저장
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
  ```

## API 호출 최적화

  ```jsx
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const { data, loading } = useQuery({ keyword });
  useEffect(() => {
      const interval = setInterval(() => setKeyword(input), 500);
      return () => clearInterval(interval);
    }, [input]);
  ```
  useQuery에 keyword를 넘기기 전 0.5초 딜레이를 주었다.

## 키보드만으로 추천 검색어들로 이동 가능하도록 구현

input에 한글을 작성한 뒤 버튼을 누르게 되면 버튼이 두번 동작하게 되는데

이를 방지하기 위해 isComposing 옵션으로 필터링 함.

키보드로 이동중에 keyword가 변경되는것을 방지하기 위해 listInfo state를 따로 만들었고

data list들은 a 태그로 매핑했기에 useEffect에서 버튼이 눌려 searchListNum의 변화가 일어나게 되면 

해당 a 태그의 innerText를 가져와 listInfo에 저장하도록 했다.

  ```jsx
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
  ```
![he](https://github-production-user-asset-6210df.s3.amazonaws.com/77131309/254498256-4d21103c-1a91-4b04-bfb3-e1d870bc239b.gif)

