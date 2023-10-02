import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUser } from '../Authentication/UserContext';
import './NavBar.css';

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the home page after logout
  };

  return (
  <div className="navbar-container">
      <h1 id="webHeader">PostHub.</h1>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/add-blog">Add Blog</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login">Log In</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};


export default Navbar;
