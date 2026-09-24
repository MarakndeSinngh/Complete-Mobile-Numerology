
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { LanguageProvider } from './src/i18n';
import ErrorBoundary from './src/components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="LeoFamily Application Initialization">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
