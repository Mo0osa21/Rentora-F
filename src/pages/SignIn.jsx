import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useNavigate } from 'react-router-dom'

const SignIn = ({ setUser }) => {
  let navigate = useNavigate()
  const [formValues, setFormValues] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setFormValues({ email: '', password: '' })
    setUser(payload)
    navigate('/properties')
  }

  return (
    <div className="signin-page">
      <div className="signin-content-wrapper">
        <div className="form-section">
          <div className="overlay-card centered">
            <h1>Rentora</h1>
            <form className="form-column" onSubmit={handleSubmit}>
              <div className="input-group">
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
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  onChange={handleChange}
                  type="password"
                  name="password"
                  value={formValues.password}
                  required
                />
              </div>
              <button disabled={!formValues.email || !formValues.password}>
                Sign In
              </button>
              <a href="/register">
                <p>Sign up</p>
              </a>
            </form>
          </div>
        </div>
        <div className="image-section">
          <img
            src="https://i.pinimg.com/736x/c8/04/c2/c804c2c85c47f07845fbacdb288ece26.jpg"
            alt="Illustration"
          />
        </div>
      </div>
    </div>
  )
}

export default SignIn
