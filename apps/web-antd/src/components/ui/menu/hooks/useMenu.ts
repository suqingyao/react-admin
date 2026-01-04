import { useMemo } from 'react';
import type { SubMenuProvider } from '../types';

/**
 * UseMenuOptions - 菜单路径、父级菜单配置选项
 * UseMenuOptions - menu path and parent menu configuration options
 */
interface UseMenuOptions {
  /** 当前菜单路径 / current menu path */
  path?: string;
  /** 父级菜单实例 / parent menu instance */
  parentMenu?: SubMenuProvider | null;
  /** 已有父级路径列表 / existing parent paths */
  parentPaths?: string[];
}

/**
 * UseMenuResult - useMenu 钩子返回结果
 * UseMenuResult - return value of useMenu hook
 */
interface UseMenuResult {
  /** 解析后的父级菜单实例 / resolved parent menu instance */
  parentMenu: SubMenuProvider | null;
  /** 计算后的父级路径数组 / computed parent paths array */
  parentPaths: string[];
}

/**
 * useMenu - 计算菜单父级路径与父级菜单
 * useMenu - compute parent paths and parent menu for current menu
 */
function useMenu(options: UseMenuOptions = {}): UseMenuResult {
  /** 解构配置项 / destructure options */
  const { path, parentMenu, parentPaths: initialParentPaths } = options;

  /**
   * parentPaths - 组合父级路径数组
   * parentPaths - combined parent paths array
   */
  const parentPaths = useMemo<string[]>(() => {
    /** paths - 父级路径副本 / copy of parent paths */
    const paths = [...(initialParentPaths || [])];
    if (path) {
      paths.push(path);
    }
    return paths;
  }, [initialParentPaths, path]);

  /**
   * resolvedParentMenu - 解析后的父级菜单实例
   * resolvedParentMenu - resolved parent menu instance
   */
  const resolvedParentMenu = useMemo<SubMenuProvider | null>(
    () => parentMenu ?? null,
    [parentMenu],
  );

  return {
    parentMenu: resolvedParentMenu,
    parentPaths,
  };
}

/**
 * useMenuStyle - 计算子菜单样式（层级）
 * useMenuStyle - compute submenu style (level)
 */
function useMenuStyle(menu?: SubMenuProvider) {
  /**
   * subMenuStyle - 子菜单内联样式（包含层级变量）
   * subMenuStyle - submenu inline style with level variable
   */
  const subMenuStyle = useMemo(() => {
    return {
      /** --menu-level - 菜单层级（根为 0，子级递增） / menu level (root is 0, children increment) */
      '--menu-level': menu ? (menu?.level ?? 0 + 1) : 0,
    };
  }, [menu]);
  return subMenuStyle;
}

export { useMenu, useMenuStyle };
