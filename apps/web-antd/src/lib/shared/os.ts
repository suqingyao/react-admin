export const isWindows = () => navigator.userAgent.indexOf('Windows') !== -1;

export const isMac = () => navigator.userAgent.indexOf('Macintosh') !== -1;

export const isLinux = () => navigator.userAgent.indexOf('Linux') !== -1;

export const isIOS = () =>
  navigator.userAgent.indexOf('iPhone') !== -1 || navigator.userAgent.indexOf('iPad') !== -1;
