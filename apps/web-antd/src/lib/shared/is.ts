export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

export const isInFrame = isClient && window !== window.top;
