import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
