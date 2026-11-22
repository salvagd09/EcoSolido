import { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useOutletContext, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import RegistrarReportes from './components/RegistrarReporte'
import SeguimientoIncidencias from './components/SeguimientoIncidencias'
import RecompensasCiudadano from './components/RecompensasCiudadano'
import './App.css'
import Registrarse from './components/Registrarse'
import RestablecerContra from './components/RestablecerContraseña'
import { useNavigationShortcuts } from './hooks/useKeyboardShortcuts'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import ManejarIncidencias from './components/ManejarIncidencias'
import DefaultRedirect from './components/DefaultRedirect'

// Componente de diseño para el layout principal (con Header y Sidebar)
function MainLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [reportes, setReportes] = useState([])
  const navigate = useNavigate()

  function toggleMenu() {
    setMenuAbierto(prev => !prev)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  // Función para agregar nueva incidencia (será pasada como prop)
  function agregarReporte(nuevoReporte) {
    setReportes(prev => [...prev, nuevoReporte])
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
          <Outlet context={{ reportes, agregarReporte }} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/restablecer" element={<RestablecerContra />} />
        
        {/* Ruta del layout principal */}
        <Route element={<MainLayout />}>
          <Route path="/registro" element={
            <ProtectedRoute module="registro">
              <RegistrarConLayout />
            </ProtectedRoute>
          } />
          <Route path="/seguimiento" element={
            <ProtectedRoute module="seguimiento">
              <SeguimientoConLayout />
            </ProtectedRoute>
          } />
          <Route path="/gestion" element={
            <ProtectedRoute module="gestion">
              < ManejarIncidencias/>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute module="dashboard">
              < Dashboard/>
            </ProtectedRoute>
          } />
          <Route path="/recompensas" element={
            <ProtectedRoute module="insignias">
              <RecompensasCiudadano />
            </ProtectedRoute>
          } />
        <Route index element={<DefaultRedirect />} />
        </Route>
        
        {/* Redirigir rutas desconocidas */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </Router>
  )
}

// Componentes wrapper para acceder al contexto del layout
function RegistrarConLayout() {
  const { agregarReporte } = useOutletContext();
  return <RegistrarReportes onReporteRegistrado={agregarReporte} />;
}

function SeguimientoConLayout() {
const { reportes } = useOutletContext();
return <SeguimientoIncidencias incidencias={reportes}/>
}

export default App;
