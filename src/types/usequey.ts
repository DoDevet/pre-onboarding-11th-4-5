import { ISearchData } from "./responseData";

export interface IStateProps {
  data?: ISearchData[];
  error?: any;
  loading: boolean;
}
