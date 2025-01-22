import { useState } from 'react'
import { RegisterUser } from '../services/Auth'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    picture: '' // Now stores the image URL
  })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await RegisterUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        picture: formValues.picture // Send the URL
      })

      setFormValues({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        picture: ''
      })
      navigate('/profile') // Navigate to profile page after successful registration
    } catch (error) {
      console.error('Registration error:', error)
      // Handle error, e.g., display an error message to the user
    }
  }

  return (
    <div className="signin col">
      <div className="card-overlay centered">
        <h1>Create New Account</h1>
        <h4>Already Registered? Login</h4>
        <form className="col" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="John Smith"
              value={formValues.name}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formValues.email}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={formValues.password}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="picture">Profile Picture URL</label>
            <input
              onChange={handleChange}
              type="url"
              name="picture"
              placeholder="Enter image URL"
              value={formValues.picture}
            />
          </div>
          <button
            disabled={
              !formValues.email ||
              !formValues.password ||
              formValues.password !== formValues.confirmPassword ||
              !formValues.picture
            }
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
