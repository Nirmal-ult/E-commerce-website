import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';

const DashBoard = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <>
      <nav className="header">
        <ul className="ul">
        
          <Link to="/productlist" className="link">
            <li>Product List</li>
          </Link>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>

    </>
  );
};

export default DashBoard;
