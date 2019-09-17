import {
  Store,
  DeepPartial,
  StoreData,
  WorkStore,
  ConfigStore
} from './IStore';
import { APP_ID } from '../define';
import deepEqual from 'deep-equal';
import deepmerge from 'deepmerge';
import store from 'store/dist/store.modern';
import defaults from 'store/plugins/defaults';
import { DEFAULT_THEME_NAMESPACE } from '../theme/ThemeManager';

store.addPlugin(defaults);

interface DefaultPluginAdded extends StoreJsAPI {
  defaults: (defaultValue: {}) => {};
}

const emptyStore: Store = {
  [APP_ID]: {
    version: '0.0.1',
    config: {
      update: new Date().getTime(),
      slidepad: {
        position: 'right'
      },
      theme: {
        id: 'default',
        namespace: DEFAULT_THEME_NAMESPACE
      },
      font: {
        id: 'serif'
      }
    },
    works: {}
  }
};

const SAVE_INTERVAL = 100;

function migrate(obj: {}): StoreData {
  const merged = deepmerge(emptyStore[APP_ID], obj);
  return merged;
}

export class StoreManager {
  private emptyInStorage = false;
  private cache: StoreData;
  private saveQueueId = -1;

  constructor() {
    this.cache = this.load();
  }

  public get config(): ConfigStore {
    return this.cache.config;
  }

  public getWork(id: string): WorkStore | null {
    if (Object.hasOwnProperty.call(this.cache.works, id)) {
      return this.cache.works[id];
    }
    return null;
  }

  public update(obj: DeepPartial<StoreData>): void {
    const d = deepmerge(this.cache, obj);
    if (deepEqual(this.cache, d)) {
      return;
    }
    this.save(d as StoreData);
  }

  public updateWork(id: string, obj: WorkStore): void {
    const d = deepmerge(this.cache, { works: { [id]: obj } });
    this.save(d as StoreData);
  }

  public updateConfig(obj: ConfigStore): void {
    const d = deepmerge(this.cache, { config: obj });
    this.save(d as StoreData);
  }

  private save(data: StoreData): void {
    this.cache = data;
    window.clearTimeout(this.saveQueueId);
    this.saveQueueId = window.setTimeout(() => {
      store.set(APP_ID, this.cache);
    }, SAVE_INTERVAL);
  }

  private load(): StoreData {
    let d = store.get(APP_ID);
    if (!d) {
      this.emptyInStorage = true;
      (store as DefaultPluginAdded).defaults(emptyStore);
      d = store.get(APP_ID);
    }
    const migrated = migrate(d);
    if (!deepEqual(d, migrated)) {
      this.save(migrated);
    }
    return migrated;
  }
}

export const StoreManagerInstance = new StoreManager();
