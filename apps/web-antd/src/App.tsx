import { AntdProvider, LangProvider, RouterProvider, ThemeProvider } from './providers';

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AntdProvider>
          <RouterProvider />
        </AntdProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
