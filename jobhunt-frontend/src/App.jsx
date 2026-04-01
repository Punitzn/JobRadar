import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
