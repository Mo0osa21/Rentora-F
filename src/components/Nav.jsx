import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react' // Import useState and useEffect

const Nav = ({ user, handleLogOut }) => {
  const [pictureUrl, setPictureUrl] = useState('') // State to store user's picture URL

  useEffect(() => {
    if (user) {
      setPictureUrl(user.profile && user.profile.picture) // Update pictureUrl on user change
    }
  }, [user]) // Dependency array: update on user change

  let userOptions
  if (user) {
    userOptions = (
      <nav className="nav">
        <h3>Welcome {user.name}!</h3>

        <Link to="/properties" className="nav-link">
          Home
        </Link>
        <Link to="/offers" className="nav-link">
          Offers
        </Link>

        <Link to="/bookings" className="nav-link">
          Book
        </Link>
        <Link to="/my-properties" className="nav-link">
          My Properties
        </Link>

        <Link to="propertyform" className="nav-link">
          Add new property
        </Link>
        <Link onClick={handleLogOut} to="/signin" className="nav-link">
          Sign Out
        </Link>
      </nav>
    )
  }

  const publicOptions = (
    <nav>
      <Link to="/home" className="nav-link">
        Home
      </Link>
      <Link to="/register" className="nav-link">
        Register
      </Link>
      <Link to="/signin" className="nav-link">
        Sign In
      </Link>
    </nav>
  )

  return (
    <header>
      <Link to="/profile">
        <div className="logo-wrapper" alt="logo">
          {pictureUrl ? ( // Conditionally render the user's picture
            <img className="logo" src={pictureUrl} alt="User Profile" />
          ) : (
            <img
              className="logo"
              src="https://avatars.dicebear.com/api/gridy/app.svg"
              alt="Default Logo"
            />
          )}
        </div>
      </Link>
      {user ? userOptions : publicOptions}
    </header>
  )
}

export default Nav
