import { Link } from 'react-router-dom'

const Nav = ({ user, handleLogOut }) => {
  let userOptions
  if (user) {
    userOptions = (
      <nav className="nav">
        <h3>Welcome {user.email}!</h3>

        <Link to="/home" className="nav-link">
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
        <Link onClick={handleLogOut} to="/" className="nav-link">
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
      <Link to="/">
        <div className="logo-wrapper" alt="logo">
          <img
            className="logo"
            src="https://avatars.dicebear.com/api/gridy/app.svg"
            alt="welcome banner"
          />
        </div>
      </Link>
      {user ? userOptions : publicOptions}
    </header>
  )
}

export default Nav
