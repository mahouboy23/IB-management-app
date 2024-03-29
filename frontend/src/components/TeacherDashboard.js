import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faChalkboardTeacher, faShapes, faClipboardList, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';  // Corrected import
import './TeacherDashboard.css';

function TeacherDashboard({ onLogout }) {
  const navigate = useNavigate(); // Using useNavigate hook for navigation
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to the login page
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token decoding failed", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const username = localStorage.getItem('fullName');

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    setUser(null);
    navigate('/login'); // Navigate to the login page after logout
  };

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
          <button onClick={handleLogout}>Log out</button>
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

export default TeacherDashboard;