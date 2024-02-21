import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './TeacherDashboard.css'; // Ensure you have a corresponding CSS file

function TeacherDashboard({ onLogout }) {
  // Placeholder for account name, replace with actual state/logic as needed
  const accountName = "Teacher's Name";
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <h2>LOGO</h2>
        </div>
        <div className="account-name">
          <p>{accountName}</p>
        </div>

        <nav className="menu-section">
          <div className="menu-item">
            <p>Class Management</p>
            <div className="dropdown">
              <Link to="/teacher/classes">Classes</Link>
              <Link to="/teacher/grades">Grades</Link>
              <Link to="/teacher/boundaries">Boundaries</Link>
              <Link to="/teacher/other-menu">Other Menu</Link>
            </div>
          </div>

          <div className="menu-item">
            <p>Settings</p>
            <div className="dropdown">
              <Link to="/teacher/reset-password">Reset Password</Link>
              <Link to="/teacher/other-setting">Other Setting</Link>
            </div>
          </div>
        </nav>

        <div className="disconnect">
                {/* Use the onLogout prop when the button is clicked */}
                <button onClick={onLogout}>DISCONNECT</button>
        </div>
      </aside>

      <main className="main-content">
        <h1>Welcome to the Teacher Dashboard</h1>
        <Outlet /> {/* Nested routes will render here */}
      </main>
    </div>
  );
}

export default TeacherDashboard;