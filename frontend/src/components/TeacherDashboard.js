import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faChalkboardTeacher, faShapes, faClipboardList, faCog, faSearch } from '@fortawesome/free-solid-svg-icons'; 
import './TeacherDashboard.css';

function TeacherDashboard() {

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
          <NavLink to="/teacher/classes" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> Classes
          </NavLink>
          <NavLink to="/teacher/grades" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faChalkboardTeacher} /> Grades
          </NavLink>
          <NavLink to="/teacher/boundaries" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faShapes} /> Boundaries
          </NavLink>
          <NavLink to="/teacher/report-card" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faClipboardList} /> Report card
          </NavLink>
          <NavLink to="/teacher/settings" activeClassName="active" className="menu-item">
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
          <span className="username">{user?.fullName}</span> {/* Dynamic username */}
            <img src="/MHA_IB_M_logo.png" alt="User" className="user-image" />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default TeacherDashboard;