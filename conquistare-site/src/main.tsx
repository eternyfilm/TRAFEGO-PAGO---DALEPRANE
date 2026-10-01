import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { capturarUtm } from './lib/rastreio'
import './styles/fontes.css'
import './styles/global.css'

capturarUtm()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
