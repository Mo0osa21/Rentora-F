import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Import useState and useEffect

const Nav = ({ user, handleLogOut }) => {
  const [pictureUrl, setPictureUrl] = useState(''); // State to store user's picture URL

  useEffect(() => {
    if (user) {
      setPictureUrl(user.profile && user.profile.picture); // Update pictureUrl on user change
    }
  }, [user]); // Dependency array: update on user change

  let userOptions;
  if (user) {
    userOptions = (
      <nav>
        <h3>Welcome {user.name}</h3>
        <Link to="/properties">Home</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/bookings">Book</Link>
        <Link to="/my-properties">My Properties</Link>
        <Link to="/propertyform">Add new property</Link>
        <Link onClick={handleLogOut} to="/">
          Sign Out
        </Link>
      </nav>
    );
  }

  const publicOptions = (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/signin">Sign In</Link>
    </nav>
  );

  return (
    <header>
      <Link to="/profile">
        <div className="logo-wrapper" alt="logo">
          {pictureUrl ? ( // Conditionally render the user's picture
            <img
              className="logo"
              src={pictureUrl}
              alt="User Profile"
            />
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
  );
};

export default Nav;