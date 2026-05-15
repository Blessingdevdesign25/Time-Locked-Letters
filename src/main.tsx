import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

window.onerror = function(msg, url, line, col, error) {
  console.error("GLOBAL ERROR:", msg, "at", url, line, col, error);
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
