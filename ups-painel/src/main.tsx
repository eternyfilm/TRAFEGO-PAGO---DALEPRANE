import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/theme.css'
import { App } from './App'
import { StoreProvider } from './state/store'
import { PortaSenha } from './ui/PortaSenha'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortaSenha>
      <StoreProvider>
        <App />
      </StoreProvider>
    </PortaSenha>
  </React.StrictMode>,
)
