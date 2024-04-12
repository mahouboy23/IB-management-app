import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../contexts/AuthContext';
import './CoordinatorDashboard.css';

function CoordinatorDashboard() {

  const { user, logout } = useContext(AuthContext);
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      <div className="logo-section">
          <h2>IB management</h2>
        </div>
        <nav className="menu-section">
          <NavLink exact to="/coordinator/users" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faIdCard} /> Users
          </NavLink>
          <NavLink to="/coordinator/classes-c" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> Classes
          </NavLink>
        </nav>
        <div className="logout-section">
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">
       <div className="grades-header">
          <div className="user-profile">
            <span className="username">{user?.fullName}</span>
            <img src="/MHA_IB_M_logo.png" alt="User" className="user-image" />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}



export default CoordinatorDashboard;
