import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function DefaultRedirect() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (user?.rol === 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/registro" replace />
}