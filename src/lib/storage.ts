import { StorageManager } from '@suqingyao/utils';

const sessionStorageManager = new StorageManager({
  prefix: '__REACT_ADMIN__',
  storageType: 'sessionStorage',
});

const localStorageManager = new StorageManager({
  prefix: '__REACT_ADMIN__',
  storageType: 'localStorage',
});

export { sessionStorageManager, localStorageManager };
