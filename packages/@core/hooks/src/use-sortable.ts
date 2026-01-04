import { useEffect, useRef } from 'react';
import type Sortable from 'sortablejs';
import type { SortableOptions } from 'sortablejs';

function useSortable<T extends HTMLElement>(options: SortableOptions = {}) {
  const containerRef = useRef<T>(null);
  const sortableRef = useRef<Sortable | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!containerRef.current) return;

      const SortableModule = await import(
        // @ts-expect-error - This is a dynamic import
        'sortablejs/modular/sortable.complete.esm.js'
      );

      // Clean up previous instance if any
      if (sortableRef.current) {
        sortableRef.current.destroy();
      }

      sortableRef.current = SortableModule.default.create(containerRef.current, {
        animation: 300,
        delay: 400,
        delayOnTouchOnly: true,
        ...options,
      });
    };

    init();

    return () => {
      sortableRef.current?.destroy();
      sortableRef.current = null;
    };
  }, [options]); // Be careful with options object stability

  return {
    containerRef,
    sortableInstance: sortableRef,
  };
}

export { useSortable };
export type { Sortable };
