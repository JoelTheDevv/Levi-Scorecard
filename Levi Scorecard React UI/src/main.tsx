import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ScoreboardProvider } from './context/ScoreboardContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScoreboardProvider>
      <App />
    </ScoreboardProvider>
  </StrictMode>
);