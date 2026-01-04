import { getScrollbarWidth, needsScrollbar } from '@nova-core/shared/utils';
// import { useLockBodyScroll } from 'react-use'; // Or implement custom if react-use not wanted, but ahooks doesn't seem to have full equivalent with padding handling?
// // Actually ahooks has useLockFn but that's different.
// // Let's implement manually using useEffect to match the padding logic.

import { useEffect, useState } from 'react';

export const SCROLL_FIXED_CLASS = `_scroll__fixed_`;

export function useScrollLock(shouldLock: boolean = false) {
  const [locked, setLocked] = useState(shouldLock);

  useEffect(() => {
    if (!locked) return;

    const scrollbarWidth = getScrollbarWidth();
    if (!needsScrollbar()) return;

    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalBodyOverflow = document.body.style.overflow;

    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    const layoutFixedNodes = document.querySelectorAll<HTMLElement>(`.${SCROLL_FIXED_CLASS}`);
    const nodes = [...layoutFixedNodes];
    const originalNodeStyles: { node: HTMLElement; transition: string; paddingRight: string }[] =
      [];

    if (nodes.length > 0) {
      nodes.forEach((node) => {
        originalNodeStyles.push({
          node,
          transition: node.style.transition,
          paddingRight: node.style.paddingRight,
        });
        node.dataset.transition = node.style.transition;
        node.style.transition = 'none';
        node.style.paddingRight = `${scrollbarWidth}px`;
      });
    }

    return () => {
      document.body.style.paddingRight = originalBodyPaddingRight;
      document.body.style.overflow = originalBodyOverflow;

      if (nodes.length > 0) {
        nodes.forEach((node, index) => {
          const original = originalNodeStyles[index];
          node.style.paddingRight = original.paddingRight;
          requestAnimationFrame(() => {
            node.style.transition = original.transition;
          });
        });
      }
    };
  }, [locked]);

  return [locked, setLocked] as const;
}
