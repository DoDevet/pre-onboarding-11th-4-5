import { ISearchData } from "./responseData";

export interface GetSearchData {
  data: ISearchData[];
  expire: number;
}
