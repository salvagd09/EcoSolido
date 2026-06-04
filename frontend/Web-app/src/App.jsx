import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import RegistrarIncidencias from './components/RegistrarIncidencias'
import SeguimientoIncidencias from './components/SeguimientoIncidencias'
import EducacionMedioAmbiental from './components/EducacionMedioAmbiental'
import './App.css'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function toggleMenu() {
    setMenuAbierto(prev => !prev)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <Router>
      <div className="app">
        <Header onMenuClick={toggleMenu} />
        <div className="app__body">
          <Sidebar isOpen={menuAbierto} onClose={cerrarMenu} />
          <Routes>
            <Route path="/registro" element={<RegistrarIncidencias />} />
            <Route path="/seguimiento" element={<SeguimientoIncidencias />} />
            <Route path="/educacion" element={<EducacionMedioAmbiental />} />
            <Route path="/" element={<Navigate to="/registro" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App