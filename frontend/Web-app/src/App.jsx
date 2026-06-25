import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useOutletContext, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import RegistrarIncidencias from './components/RegistrarIncidencias'
import SeguimientoIncidencias from './components/SeguimientoIncidencias'
import EducacionMedioAmbiental from './components/EducacionMedioAmbiental'
import './App.css'
import Registrarse from './components/Registrarse'
import RestablecerContra from './components/RestablecerContraseña'
import { useNavigationShortcuts } from './hooks/useKeyboardShortcuts'

// Componente de diseño para el layout principal (con Header y Sidebar)
function MainLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [incidencias, setIncidencias] = useState([])
  const navigate = useNavigate()

  function toggleMenu() {
    setMenuAbierto(prev => !prev)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  // Función para agregar nueva incidencia (será pasada como prop)
  function agregarIncidencia(nuevaIncidencia) {
    setIncidencias(prev => [...prev, nuevaIncidencia])
  }

  // Atajos de navegación con teclado
  useNavigationShortcuts({
    onHome: () => navigate('/registro'),
    onReports: () => navigate('/seguimiento'),
    onSettings: () => navigate('/educacion'),
    onCloseModal: () => cerrarMenu()
  })

  return (
    <div className="app">
      <Header onMenuClick={toggleMenu} onLogout={() => window.location.href = '/login'} />
      <div className="app__body">
        <Sidebar isOpen={menuAbierto} onClose={cerrarMenu} />
        <div className="app__content">
          <Outlet context={{ incidencias, agregarIncidencia }} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/restablecer" element={<RestablecerContra />} />
        {/* Ruta protegida que usa el layout principal */}
        <Route element={<MainLayout />}>
          <Route path="/registro" element={<RegistrarConLayout />} />
          <Route path="/seguimiento" element={<SeguimientoConLayout />} />
          <Route path="/educacion" element={<EducacionMedioAmbiental />} />
          <Route index element={<Navigate to="/registro" replace />} />
        </Route>
        {/* Redirigir rutas desconocidas */}
        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Routes>
    </Router>
  )
}

// Componentes wrapper para acceder al contexto del layout
function RegistrarConLayout() {
  const { incidencias, agregarIncidencia } = useOutletContext();
  return <RegistrarIncidencias onIncidenciaRegistrada={agregarIncidencia} />;
}

function SeguimientoConLayout() {
  const { incidencias } = useOutletContext();
  return <SeguimientoIncidencias incidencias={incidencias} />;
}

export default App