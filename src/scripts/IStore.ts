import { APP_ID } from "./define";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface IStore {
  [APP_ID]: IStoreData,
}

export interface IStoreData {
  version: string;
  config: IConfigStore;
  works: IWorksStore;
}

export interface IConfigStore {
  update: number;
}

export interface IWorksStore {
  [key: string]: IWorkStore;
}

export interface IWorkStore {
  autosave: IPageStore;
  bookmark: IPageStore;
}

export interface IPageStore {
  page: string;
  scrolldepth: number;
  update: number;
}
