import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app.tsx'
import './assets/global.css'

createRoot(document.getElementById('root') as Element).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
