import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SpacesList from './pages/SpacesList'
import SpaceDetails from './pages/SpaceDetails'
import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import ManageSpaces from './pages/ManageSpaces'
import Testimonials from './pages/Testimonials'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'

function App() {
  const location = useLocation()
  const { checkAuthStatus } = useAuth()
  
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/spaces" element={<SpacesList />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
          <Route path="/testimonials" element={<Testimonials />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manage-spaces" 
            element={
              <ProtectedRoute roleRequired="SPACE_OWNER">
                <ManageSpaces />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App