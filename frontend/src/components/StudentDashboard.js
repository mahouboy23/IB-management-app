import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faChalkboardTeacher, faClipboardList, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../contexts/AuthContext';
import './StudentDashboard.css';

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      <div className="logo-section">
          <h2>IB management</h2>
        </div>
        <nav className="menu-section">
          <NavLink exact to="/teacher/overview" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faHome} /> Overview
          </NavLink>
          <NavLink to="/student/classes-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> Classes
          </NavLink>
          <NavLink to="/student/grades-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faChalkboardTeacher} /> Grades
          </NavLink>
          <NavLink to="/student/report-card-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faClipboardList} /> Report card
          </NavLink>
          <NavLink to="/student/settings-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faCog} /> Settings
          </NavLink>
        </nav>
        <div className="logout-section">
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">
       <div className="grades-header">
          <div className="header-search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <button type="button" className="search-button"><FontAwesomeIcon icon={faSearch} /></button> 
          </div>
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



export default StudentDashboard;
