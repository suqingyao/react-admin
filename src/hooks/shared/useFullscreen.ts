import { useFullscreen as useAhooksFullscreen } from 'ahooks';
import { useMemo } from 'react';

export interface UseFullscreenOptions {
  onExit?: () => void;
  onEnter?: () => void;
}

export function useFullscreen(target?: HTMLElement | null, options?: UseFullscreenOptions) {
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen, isEnabled }] =
    useAhooksFullscreen(target, options);

  return useMemo(
    () => ({
      isSupported: isEnabled,
      isFullscreen,
      enter: enterFullscreen,
      exit: exitFullscreen,
      toggle: toggleFullscreen,
    }),
    [isEnabled, isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen],
  );
}
