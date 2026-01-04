import SecureLS from 'secure-ls';
import type { StateStorage } from 'zustand/middleware';

export interface InitStoreOptions {
  namespace: string;
}

let secureLsInstance: SecureLS | null = null;

function getSecureLS(namespace: string) {
  if (!secureLsInstance) {
    secureLsInstance = new SecureLS({
      encodingType: 'aes',
      encryptionSecret: import.meta.env.VITE_APP_STORE_SECURE_KEY,
      isCompression: true,
      metaKey: `${namespace}-secure-meta`,
    });
  }
  return secureLsInstance;
}

export const createSecureStorage = (namespace: string): StateStorage => {
  const ls = getSecureLS(namespace);

  return {
    getItem: (name: string): string | null => {
      if (import.meta.env.DEV) {
        return localStorage.getItem(name);
      }
      return ls.get(name);
    },
    setItem: (name: string, value: string): void => {
      if (import.meta.env.DEV) {
        localStorage.setItem(name, value);
      } else {
        ls.set(name, value);
      }
    },
    removeItem: (name: string): void => {
      if (import.meta.env.DEV) {
        localStorage.removeItem(name);
      } else {
        ls.remove(name);
      }
    },
  };
};

// Deprecated or no-op for React/Zustand compatibility if previously used
export async function initStores(_app: any, _options: InitStoreOptions) {
  // No-op: Zustand stores are initialized lazily
}

export function resetAllStores() {
  // TODO: Implement a registry if global reset is needed
}
