import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/z-index.css'
import App from './App.jsx'

// Note: StrictMode is disabled to avoid issues with Leaflet map initialization
// In React 18, StrictMode causes components to mount/unmount twice in development,
// which conflicts with Leaflet's container initialization
createRoot(document.getElementById('root')).render(
  <App />,
)
