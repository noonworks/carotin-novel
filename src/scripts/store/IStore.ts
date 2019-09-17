import { APP_ID } from '../define';

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

export type SlidepadPosition = 'right' | 'left' | 'none';
export function isSlidepadPosition(str: string): str is SlidepadPosition {
  if (str == 'right' || str == 'left' || str == 'none') {
    return true;
  }
  return false;
}

export interface ConfigStore {
  update: number;
  slidepad: {
    position: SlidepadPosition;
  };
  theme: {
    id: string;
    namespace: string;
  };
  font: {
    id: string;
  };
}

export interface WorksStore {
  [key: string]: WorkStore;
}

export interface WorkStore {
  autosave?: PageStore;
  styles?: {
    overwriteTheme: boolean;
    overwriteFont: boolean;
  };
}

export interface PageStore {
  page: string;
  scrolldepth: number;
  update: number;
}
