import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CheckSession } from '../services/Auth';
import { useNavigate } from 'react-router-dom'; // Import useState and useEffect

const Nav = ({ user, handleLogOut }) => {
  const [userData, setUserData] = useState(null); // Initialize user data state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {        
        const user = await CheckSession(); // Fetch user data
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/signin'); // Redirect to signin on error
      }
    };
    fetchUserData();
  }, [navigate]); // Dependency array: update on navigation change

  if (!userData) {
    return <div className="loading-container">Loading profile... or User not logged in.</div>; // Loading message
  }

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
        <img
            src={userData.picture}
            alt={`${userData.name}'s profile`}
            className="profile-picture2"
          />
        </div>
      </Link>
      {user ? userOptions : publicOptions}
    </header>
  )
}

export default Nav
