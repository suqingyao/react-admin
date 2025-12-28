import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { MenuProvider as MenuContextValue } from '../types';

/**
 * MenuProviderProps - 菜单上下文提供者组件属性
 * MenuProviderProps - props of menu context provider component
 */
interface MenuProviderProps {
  /** 子节点元素 / children elements */
  children: ReactNode;
  /** 菜单上下文值 / menu context value */
  value: MenuContextValue;
}

/**
 * MenuContext - 菜单全局上下文
 * MenuContext - global menu context
 */
const MenuContext = createContext<MenuContextValue | null>(null);

/**
 * SubMenuPathContextValue - 子菜单路径与层级上下文
 * SubMenuPathContextValue - context value of submenu path and level
 */
interface SubMenuPathContextValue {
  /** 当前组件的父级路径链路（包含自身）/ parent paths including self */
  parentPaths: string[];
  /** 当前菜单层级 / current menu level */
  level: number;
}

/**
 * SubMenuPathContext - 子菜单路径上下文
 * SubMenuPathContext - submenu path context
 */
const SubMenuPathContext = createContext<SubMenuPathContextValue | null>(null);

/**
 * SubMenuPathProviderProps - 子菜单路径提供者属性
 * SubMenuPathProviderProps - props of submenu path provider
 */
interface SubMenuPathProviderProps {
  /** 子节点元素 / children elements */
  children: ReactNode;
  /** 父级路径链路（包含自身）/ parent path chain including self */
  parentPaths: string[];
  /** 当前菜单层级 / current menu level */
  level: number;
}

/**
 * useMenuContext - 读取菜单上下文
 * useMenuContext - read menu context
 */
const useMenuContext = () => {
  /** context - 当前菜单上下文 / current menu context */
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};

/**
 * MenuProvider - 菜单上下文提供者组件
 * MenuProvider - menu context provider component
 */
const MenuProvider = ({ children, value }: MenuProviderProps) => {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

/**
 * SubMenuPathProvider - 子菜单路径上下文提供者组件
 * SubMenuPathProvider - submenu path context provider component
 */
const SubMenuPathProvider = ({ children, level, parentPaths }: SubMenuPathProviderProps) => {
  return (
    <SubMenuPathContext.Provider value={{ level, parentPaths }}>
      {children}
    </SubMenuPathContext.Provider>
  );
};

/**
 * useSubMenuPathContext - 读取子菜单路径上下文
 * useSubMenuPathContext - read submenu path context
 */
const useSubMenuPathContext = (): SubMenuPathContextValue => {
  /** context - 当前子菜单路径上下文 / current submenu path context */
  const context = useContext(SubMenuPathContext);
  if (!context) {
    return {
      level: 0,
      parentPaths: [],
    };
  }
  return context;
};

export {
  MenuContext,
  MenuProvider,
  SubMenuPathContext,
  SubMenuPathProvider,
  useMenuContext,
  useSubMenuPathContext,
};
export type {
  MenuContextValue,
  MenuProviderProps,
  SubMenuPathContextValue,
  SubMenuPathProviderProps,
};
