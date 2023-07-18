import { ISearchData } from "../hooks/useQuery";

export const FilterData = (data: ISearchData[], keyword: string) => {
  return data.filter(
    (prev) => prev.sickNm[keyword.length - 1] === keyword[keyword.length - 1]
  );
};
