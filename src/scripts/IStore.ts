import { APP_ID } from './define';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface Store {
  [APP_ID]: StoreData;
}

export interface StoreData {
  version: string;
  config: ConfigStore;
  works: WorksStore;
}

export interface ConfigStore {
  update: number;
}

export interface WorksStore {
  [key: string]: WorkStore;
}

export interface WorkStore {
  autosave: PageStore;
  bookmark: PageStore;
}

export interface PageStore {
  page: string;
  scrolldepth: number;
  update: number;
}
