import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar la autenticación y permisos
 * @returns {Object} Estado de autenticación y funciones relacionadas
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    canRegister: false,
    canTrack: false,
    canAccessEducation: false,
    isAdmin: false
  });

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const userPermissions = localStorage.getItem('permissions');
    const puntosGuardados = localStorage.getItem('puntos');

    if (token && nombreUsuario) {
      setIsAuthenticated(true);
      setUser({ nombreUsuario, puntos: puntosGuardados ? parseInt(puntosGuardados, 10) : 0 });
      
      // Parsear permisos si existen
      if (userPermissions) {
        try {
          setPermissions(JSON.parse(userPermissions));
        } catch (e) {
          // Si no se pueden parsear, usar permisos por defecto
          setPermissions({
            canRegister: true,
            canTrack: true,
            canAccessEducation: true,
            isAdmin: false
          });
        }
      } else {
        // Permiso por defecto para todos los módulos
        setPermissions({
          canRegister: true,
          canTrack: true,
          canAccessEducation: true,
          isAdmin: false
        });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setPermissions({
        canRegister: false,
        canTrack: false,
        canAccessEducation: false,
        isAdmin: false
      });
    }
    
    setIsLoading(false);
  }, []);

  // Función de login
  const login = useCallback(async (nombreUsuario, contrasena) => {
    try {
      const respuesta = await fetch('http://localhost:8080/usuario/autenticar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreUsuario, contrasena })
      });

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        throw new Error(errorText);
      }

      const data = await respuesta.json();
      
      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('nombreUsuario', data.nombreUsuario);
      localStorage.setItem('puntos', data.puntos ?? 0);
      
      // Guardar permisos (pueden venir del backend o ser por defecto)
      const userPermissions = data.permissions || {
        canRegister: true,
        canTrack: true,
        canAccessEducation: true,
        isAdmin: false
      };
      localStorage.setItem('permissions', JSON.stringify(userPermissions));
      
      setIsAuthenticated(true);
      setUser({ nombreUsuario: data.nombreUsuario, puntos: data.puntos ?? 0 });
      setPermissions(userPermissions);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('puntos');
    localStorage.removeItem('permissions');
    
    setIsAuthenticated(false);
    setUser(null);
    setPermissions({
      canRegister: false,
      canTrack: false,
      canAccessEducation: false,
      isAdmin: false
    });
  }, []);

  // Verificar si tiene permiso para un módulo específico
  const hasPermission = useCallback((module) => {
    if (!isAuthenticated) return false;
    
    switch (module) {
      case 'registro':
        return permissions.canRegister;
      case 'seguimiento':
        return permissions.canTrack;
      case 'educacion':
        return permissions.canAccessEducation;
      default:
        return false;
    }
  }, [isAuthenticated, permissions]);

  // Verificar si es administrador
  const isAdmin = useCallback(() => {
    return isAuthenticated && permissions.isAdmin;
  }, [isAuthenticated, permissions]);

  // Actualizar puntos del usuario
  const updatePuntos = useCallback((nuevosPuntos) => {
    localStorage.setItem('puntos', nuevosPuntos);
    setUser((prev) => ({ ...prev, puntos: nuevosPuntos }));
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    permissions,
    login,
    logout,
    hasPermission,
    isAdmin,
    updatePuntos
  };
}

/**
 * Hook para verificar permisos en componentes específicos
 * @param {string} module - Nombre del módulo a verificar
 * @returns {boolean} True si el usuario tiene permiso
 */
export function useModulePermission(module) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  
  if (isLoading) return null; // Still loading
  if (!isAuthenticated) return false;
  
  return hasPermission(module);
}