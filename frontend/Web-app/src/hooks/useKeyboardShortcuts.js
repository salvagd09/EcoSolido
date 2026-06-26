import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook personalizado para manejar atajos de teclado globales
 * @param {Object} shortcuts - Objeto con las combinaciones de teclas y sus callbacks
 * @param {boolean} enabled - Si los atajos están habilitados
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Ignorar si el foco está en un input, textarea o select
    const activeElement = document.activeElement;
    const isInputFocused = 
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' || 
      activeElement.tagName === 'SELECT';

    // Construir la clave del atajo
    const key = [];
    if (event.ctrlKey || event.metaKey) key.push('ctrl');
    if (event.altKey) key.push('alt');
    if (event.shiftKey) key.push('shift');
    key.push(event.key.toLowerCase());
    const shortcutKey = key.join('+');

    // Buscar si existe un atajo para esta combinación
    const shortcut = shortcutsRef.current[shortcutKey];
    if (shortcut) {
      // Si es un atajo con Ctrl y el foco está en un input, permitir que el input lo maneje
      // a menos que sea un atajo específico de la aplicación
      if (isInputFocused && shortcutKey.startsWith('ctrl')) {
        return;
      }
      event.preventDefault();
      shortcut(event);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
}

/**
 * Hook para atajos de navegación en la aplicación
 */
export function useNavigationShortcuts({ onHome, onReports, onSettings, onCloseModal }) {
  const shortcuts = {
    'alt+h': () => onHome && onHome(),
    'alt+1': () => onHome && onHome(),
    'alt+r': () => onReports && onReports(),
    'alt+2': () => onReports && onReports(),
    'alt+c': () => onSettings && onSettings(),
    'alt+3': () => onSettings && onSettings(),
    'escape': () => onCloseModal && onCloseModal(),
  };

  useKeyboardShortcuts(shortcuts, true);
}

/**
 * Hook para atajos del formulario de incidencias
 */
export function useFormShortcuts({ onSubmit, onSave }) {
  const shortcuts = {
    'ctrl+enter': () => onSubmit && onSubmit(),
    'ctrl+s': () => onSave && onSave(),
  };

  useKeyboardShortcuts(shortcuts, true);
}
