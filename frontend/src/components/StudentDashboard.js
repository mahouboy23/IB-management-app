import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
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
          <NavLink to="/student/classes-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faBook} /> Classes
          </NavLink>
          <NavLink to="/student/grades-s" activeClassName="active" className="menu-item">
            <FontAwesomeIcon icon={faChalkboardTeacher} /> Grades
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



export default StudentDashboard;
