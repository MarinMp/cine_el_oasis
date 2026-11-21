import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ProveedorModoTecnico } from './modoTecnico.jsx'
import { ProveedorSesion } from './sesion.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorSesion>
        <ProveedorModoTecnico>
          <App />
        </ProveedorModoTecnico>
      </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>,
)
