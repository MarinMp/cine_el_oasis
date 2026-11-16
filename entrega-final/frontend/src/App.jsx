import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Encabezado from './components/Encabezado.jsx'
import PiePagina from './components/PiePagina.jsx'
import Cartelera from './pages/Cartelera.jsx'
import Compra from './pages/Compra.jsx'
import DetallePelicula from './pages/DetallePelicula.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'
import Reportes from './pages/Reportes.jsx'

export default function App() {
  const { pathname } = useLocation()

  // Cada pagina nueva empieza arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Encabezado />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Cartelera />} />
          <Route path="/pelicula/:id" element={<DetallePelicula />} />
          <Route path="/comprar/:idFuncion" element={<Compra />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PiePagina />
    </div>
  )
}
