import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootEl = document.getElementById('root')!;

// 404.html is served with a real 404 status; keep its static "not found" page instead of mounting the app.
if (rootEl.dataset.page !== '404') createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
