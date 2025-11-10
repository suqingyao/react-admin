import { createStore } from 'zustand';

export interface Store {
  count: number;
  increment: () => void;
}

export const useStore = createStore<Store>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
