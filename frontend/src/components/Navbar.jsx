import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token from storage
    navigate('/login');  // Redirect to login page
  };

  return (
    <nav>
      <Link to="/home">Home</Link>
      {!isLoggedIn ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;
