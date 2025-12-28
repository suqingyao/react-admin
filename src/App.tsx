import { Provider } from './providers';
import { RouterView } from './router';

function App() {
  return (
    <div className="size-full">
      <Provider>
        <RouterView />
      </Provider>
    </div>
  );
}

export default App;
