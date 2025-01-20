import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'magic.css/dist/magic.min.css';
import './app.css';
import * as serviceWorkerRegistration from '@/serviceWorkerRegistration';

const rootElement = document.getElementById('root');

// StrictMode
// ReactDOMClient.createRoot(rootElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// Without StrictMode
ReactDOMClient.createRoot(rootElement).render(<App />);

// Register the service worker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    if (window.confirm('A new version of the app is available. Would you like to update now?')) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});
