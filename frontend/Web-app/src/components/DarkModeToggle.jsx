import { useState, useEffect } from 'react'
import './DarkModeToggle.css'

export default function DarkModeToggle() {
  const [isChecked, setIsChecked] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

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