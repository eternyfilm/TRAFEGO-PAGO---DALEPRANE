import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { capturarUtm } from './lib/rastreio'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import '@fontsource-variable/plus-jakarta-sans/wght-italic.css'
import './styles/global.css'

capturarUtm()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
