import { tryJSONStringify, tryParseJSON } from './utils';

const STORAGE_PREFIX = '__ReactAdmin__';

function createStorage({
  prefix = STORAGE_PREFIX,
  storage = localStorage,
}: {
  prefix?: string;
  storage?: Storage;
}) {
  const getStorageKey = (key: string) => `${prefix}__${key}`.toUpperCase();

  return {
    get(key: string) {
      return tryParseJSON(storage.getItem(getStorageKey(key)) || 'null') || null;
    },
    remove(key: string) {
      storage.removeItem(getStorageKey(key));
    },
    set(key: string, value: string) {
      storage.setItem(getStorageKey(key), tryJSONStringify(value) || '');
    },
    clear() {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => storage.removeItem(key));
    },
  };
}

const localStorageStorage = createStorage({ storage: localStorage });
const sessionStorageStorage = createStorage({ storage: sessionStorage });

export default {
  localStorage: localStorageStorage,
  sessionStorage: sessionStorageStorage,
};
