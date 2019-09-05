import { IStore, DeepPartial, IStoreData, IWorkStore } from "./IStore";
import { APP_ID } from "./define";
import deepEqual from 'deep-equal';

const deepmerge = require('deepmerge');
const store = require('store');
const defaultsPlugin = require('store/plugins/defaults');
store.addPlugin(defaultsPlugin);

const emptyStore: IStore = {
  [APP_ID]: {
    version: '0.0.1',
    config: {
      update: (new Date()).getTime(),
    },
    works: {
    }
  }
}

const SAVE_INTERVAL = 100;

export class StoreManager {
  private emptyInStorage = false;
  private cache: IStoreData;
  private saveQueueId = -1;

  constructor() {
    this.cache = this.load();
  }

  public getWork(id: string): IWorkStore {
    if (this.cache.works.hasOwnProperty(id)) {
      return this.cache.works[id];
    }
    return null;
  }

  public update(obj: DeepPartial<IStoreData>) {
    const d = deepmerge(this.cache, obj);
    if (deepEqual(this.cache, d)) {
      return;
    }
    this.save(d);
  }

  private save(data: IStoreData): void {
    this.cache = data;
    window.clearTimeout(this.saveQueueId);
    this.saveQueueId = window.setTimeout(() => {
      store.set(APP_ID, this.cache);
    }, SAVE_INTERVAL);
  }

  private load(): IStoreData {
    let d = store.get(APP_ID);
    if (!d) {
      this.emptyInStorage = true;
      store.defaults(emptyStore);
      d = store.get(APP_ID);
    }
    return d;
  }
}

export const StoreManagerInstance = new StoreManager();
