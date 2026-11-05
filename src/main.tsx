import '@/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/app';
import { ErrorBoundary } from '@/components/error-boundary';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
