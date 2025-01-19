import { useState } from 'react'
import { Route, Routes } from 'react-router'
import Nav from './components/Nav'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import PropertiesPage from './pages/PropertiesPage'
import UserBookings from './pages/UserBookings'
import './App.css'
import { CheckSession } from './services/Auth'
import { useEffect } from 'react'
import PropertyDetails from './pages/PropertyDetails'

const App = () => {
  const [user, setUser] = useState(null)

  const handleLogOut = () => {
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.clear()
  }

  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Check if token exists before requesting to validate the token
    if (token) {
      checkToken()
    }
  }, [])

  return (
    <div className="App">
      <Nav user={user} handleLogOut={handleLogOut} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PropertiesPage />} />
          <Route
            path="/property/:propertyId"
            element={<PropertyDetails user={user} />}
          />
          <Route path="/bookings" element={<UserBookings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
