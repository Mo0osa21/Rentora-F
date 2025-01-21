import { useState } from 'react'
import { Route, Routes } from 'react-router'
import Nav from './components/Nav'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import PropertiesPage from './pages/PropertiesPage'
import UserBookings from './pages/UserBookings'
import PropertyForm from './components/PropertyForm'
import './App.css'
import { CheckSession } from './services/Auth'
import { useEffect } from 'react'
import PropertyDetails from './pages/PropertyDetails'
import UserPropertiesPage from './pages/UserPropertiesPage'
import EditPropertyForm from './components/EditPropertyForm'

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
      {user && <Nav user={user} handleLogOut={handleLogOut} />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/PropertiesPage" element={<PropertiesPage />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PropertiesPage />} />
          <Route path="/propertyform" element={<PropertyForm />} />
          <Route
            path="/property/:propertyId"
            element={<PropertyDetails user={user} />}
          />
          <Route path="/bookings" element={<UserBookings />} />
          <Route path="/my-properties" element={<UserPropertiesPage />} />
          <Route
            path="/edit-property/:propertyId"
            element={<EditPropertyForm />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
