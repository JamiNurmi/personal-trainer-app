/**
 * Application entry point
 * Renders the main App component into the DOM
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Find the root element where our React app will be mounted
const root = document.getElementById('root');
if (root) {
  // Create and render React root with StrictMode for additional development checks
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
