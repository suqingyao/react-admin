import { createContext, type PropsWithChildren } from 'react';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
};
