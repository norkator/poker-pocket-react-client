import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

const rootElement = document.getElementById('root');

ReactDOMClient.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
