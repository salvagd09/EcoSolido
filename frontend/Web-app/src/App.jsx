
import Header from './components/Header'
import RegistrarIncidencias from './components/RegistrarIncidencias'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <Sidebar />
        <RegistrarIncidencias />
      </div>
    </div>
  )
}

export default App