import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const saved = localStorage.getItem('springtunes_settings');
  if (saved) {
    const settings = JSON.parse(saved);
    if (settings.lowPerf) {
      document.documentElement.classList.add('low-perf');
    }
  }
} catch (e) {
  console.error("Failed to parse settings:", e);
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <App />
)
