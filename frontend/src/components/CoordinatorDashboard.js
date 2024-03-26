import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faCog, faSearch, faIdCard } from '@fortawesome/free-solid-svg-icons';
import './CoordinatorDashboard.css';

function CoordinatorDashboard({ onLogout }) {
  const username = localStorage.getItem('fullName');
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      <div className="logo-section">
          <h2>IB management</h2>
        </div>
        <nav className="menu-section">
          <NavLink exact to="/coordinator/overview" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faHome} /> Overview
          </NavLink>
          <NavLink exact to="/coordinator/users" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faIdCard} /> Users
          </NavLink>
          <NavLink to="/coordinator/classes-c" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> Classes
          </NavLink>
          <NavLink to="/coordinator/settings-c" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faCog} /> Settings
          </NavLink>
        </nav>
        <div className="logout-section">
          <button onClick={onLogout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">
       <div className="grades-header">
          <div className="header-search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <button type="button" className="search-button"><FontAwesomeIcon icon={faSearch} /></button> 
          </div>
          <div className="user-profile">
            <span className="username">{username}</span> {/* Dynamic username */}
            <img src="/MHA_IB_M_logo.png" alt="User" className="user-image" />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}



export default CoordinatorDashboard;
