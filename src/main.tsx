import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupI18n } from '@/locales';
import App from './App';
import 'antd/dist/reset.css';
import '@/styles/core/tailwind.css';
import '@/styles/index.scss';
import { setupDayjs } from './plugins/dayjs';

(function bootstrap() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  setupI18n();
  setupDayjs();
})();
