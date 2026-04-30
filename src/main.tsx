import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Layout
import Menu from './components/layout/Menu';

// Páginas
import Dashboard from './pages/Dashboard/Dashboard'
import Oportunidades from './pages/Oportunidades/Oportunidade'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Menu>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
        </Routes>
      </Menu>
    </BrowserRouter>
  </StrictMode>,
)