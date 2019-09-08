import { Store, DeepPartial, StoreData, WorkStore } from './IStore';
import { APP_ID } from './define';
import deepEqual from 'deep-equal';
import deepmerge from 'deepmerge';
import store from 'store/dist/store.modern';
import defaults from 'store/plugins/defaults';

store.addPlugin(defaults);

interface DefaultPluginAdded extends StoreJsAPI {
  defaults: (defaultValue: {}) => {};
}

const emptyStore: Store = {
  [APP_ID]: {
    version: '0.0.1',
    config: {
      update: new Date().getTime()
    },
    works: {}
  }
};

const SAVE_INTERVAL = 100;

export class StoreManager {
  private emptyInStorage = false;
  private cache: StoreData;
  private saveQueueId = -1;

  constructor() {
    this.cache = this.load();
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
    return d;
  }
}

export const StoreManagerInstance = new StoreManager();
