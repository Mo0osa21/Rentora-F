import React, { useState, useEffect } from 'react';
import { CheckSession } from '../services/Auth'; // Import CheckSession
import { useNavigate } from 'react-router-dom';


const Profile = () => {
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

  return (
    <div className="profile-container">
      <h1 className="profile-header">My Profile</h1>
      <div className="profile-content">
        <div className="profile-image-container">
          <img
            src={userData.picture}
            alt={`${userData.name}'s profile`}
            className="profile-picture"
          />
        </div>
        <div className="profile-info-container">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <a href='UpdatePassword'>Reset Password</a>
        </div>
      </div>
    </div>
  );
};

export default Profile;