import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ProtectedRoute.css';

/**
 * Componente para proteger rutas que requiere autenticación y permisos específicos
 * @param {Object} children - Componentes hijos a renderizar si tiene acceso
 * @param {string} module - Nombre del módulo para verificar permisos ('registro', 'seguimiento', 'educacion')
 * @param {boolean} requireAdmin - Si es true, solo permite acceso a administradores
 */
export default function ProtectedRoute({ children, module, requireAdmin = false }) {
  const { isAuthenticated, hasPermission, isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to={user?.rol === 'ADMIN' ? '/dashboard' : '/registro'} replace />;
  }

  if (module && !hasPermission(module)) {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a este módulo.</p>
        <button onClick={() => window.history.back()}>Volver</button>
      </div>
    );
  }

  return children;
}

/**
 * Componente para rutas públicas (login, registro, etc.)
 * Si el usuario ya está autenticado, lo redirige a home
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si ya está autenticado y viene de login, redirigir a home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to={user?.rol === 'ADMIN' ? '/dashboard' : '/registro'} replace />;
  }

  return children;
}
