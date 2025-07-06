import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StyledEngineProvider } from '@mui/material'

createRoot(document.getElementById('root')!).render(
  <StyledEngineProvider injectFirst>
    <StrictMode>
      <App />
    </StrictMode>
  </StyledEngineProvider>
)
