import { useState, useEffect } from 'react'
import './DarkModeToggle.css'
  const obtenerTemaInicial = () => {
    const temaGuardado = localStorage.getItem('theme');
    if (temaGuardado) {
      return temaGuardado === 'dark';
    }
    // Si no hay tema guardado, detecta si el sistema operativo del usuario ya usa modo oscuro
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
export default function DarkModeToggle() {
  const [isChecked, setIsChecked] = useState(() => obtenerTemaInicial())
  useEffect(() => {
    const root = document.documentElement
    if (isChecked) {
      root.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }, [isChecked])

  const handleChange = () => {
    setIsChecked(prev => !prev)
  }

  return (
    <label className="dark-mode-toggle" title={isChecked ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        aria-label="Alternar modo oscuro"
      />
      <span className="toggle-slider">
        <span className="toggle-icon sun">☀️</span>
        <span className="toggle-icon moon">🌙</span>
      </span>
    </label>
  )
}