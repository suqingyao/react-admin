import { createStore } from 'zustand';
import { TableSizeEnum } from '@/enums/formEnum';

export interface TableState {
  tableSize: TableSizeEnum;
  isZebra: boolean;
  isBorder: boolean;
  isHeaderBackground: boolean;
  isFullScreen: boolean;
  setTableSize: (size: TableSizeEnum) => void;
  setIsZebra: (value: boolean) => void;
  setIsBorder: (value: boolean) => void;
  setIsHeaderBackground: (value: boolean) => void;
  setIsFullScreen: (value: boolean) => void;
}

export const useTableStore = createStore<TableState>((set) => ({
  tableSize: TableSizeEnum.DEFAULT,
  isZebra: false,
  isBorder: false,
  isHeaderBackground: false,
  isFullScreen: false,
  setTableSize: (size) => set({ tableSize: size }),
  setIsZebra: (value) => set({ isZebra: value }),
  setIsBorder: (value) => set({ isBorder: value }),
  setIsHeaderBackground: (value) => set({ isHeaderBackground: value }),
  setIsFullScreen: (value) => set({ isFullScreen: value }),
}));
