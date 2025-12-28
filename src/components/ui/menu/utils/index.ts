import type { ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';

/**
 * ReactChildrenType - React 子节点类型别名
 * React children type alias for utilities
 */
export type ReactChildrenType = ReactNode;

/**
 * FlattenedChildrenType - 扁平化后的子节点数组类型
 * Flattened children array type
 */
export type FlattenedChildrenType = ReactNode[];

/**
 * findComponentUpward - 在 React children 树中查找指定组件
 * find component element by displayName/type name in React children tree
 *
 * @param children ReactChildrenType - 要搜索的子节点集合 / children to search
 * @param targetNames string[] - 目标组件名称数组（displayName 或 name）/ target display names
 * @returns ReactElement | null - 匹配到的组件元素或 null / matched element or null
 */
export function findComponentUpward(
  children: ReactChildrenType,
  targetNames: string[],
): ReactElement | null {
  let found: ReactElement | null = null;

  const search = (nodes: ReactChildrenType): void => {
    if (found) return;

    Children.forEach(nodes, (child) => {
      if (found) return;
      if (!isValidElement(child)) return;

      const type = child.type as { displayName?: string; name?: string };
      const name = type.displayName || type.name || '';

      if (targetNames.includes(name)) {
        found = child;
        return;
      }

      const element = child as ReactElement<{ children?: ReactChildrenType }>;
      if (element.props?.children) {
        search(element.props.children);
      }
    });
  };

  search(children);
  return found;
}

/**
 * flattedChildren - 扁平化 React 子节点集合
 * flatten React children to a simple array
 *
 * @param children ReactChildrenType - 原始 children 集合 / original children
 * @returns FlattenedChildrenType - 扁平化后的 children 数组 / flattened children array
 */
export function flattedChildren(children: ReactChildrenType): FlattenedChildrenType {
  const result: FlattenedChildrenType = [];

  Children.forEach(children, (child) => {
    // 过滤掉 null/undefined/boolean 等无效节点
    // filter out null/undefined/boolean
    if (child === null || child === undefined || typeof child === 'boolean') {
      return;
    }
    result.push(child);
  });

  return result;
}
