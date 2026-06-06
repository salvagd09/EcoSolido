import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import RegistrarIncidencias from './components/RegistrarIncidencias'
import SeguimientoIncidencias from './components/SeguimientoIncidencias'
import EducacionMedioAmbiental from './components/EducacionMedioAmbiental'
import './App.css'
import Registrarse from './components/Registrarse'
import RestablecerContra from './components/RestablecerContraseña'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function toggleMenu() {
    setMenuAbierto(prev => !prev)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  // Verificar autenticación del usuario
  const token = localStorage.getItem('token')
  const estaAutenticado = !!token

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Registrarse />} /> 
        <Route path="/restablecer" element={<RestablecerContra/>}/>
        <Route path="/*" element={
          estaAutenticado ? (
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
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </Router>
  )
}

export default App