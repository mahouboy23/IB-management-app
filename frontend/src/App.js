import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Updated to named import
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';


const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token); // Use named import
            setUser(decoded);
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token); // Use named import
        setUser(decoded);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate replace to="/" />} />
                <Route path="/" element={
                    user ? (
                        <>
                            <div>Welcome, {user.role}</div>
                            {user.role === 'teacher' && <TeacherDashboard />}
                            {user.role === 'student' && <StudentDashboard />}
                            {user.role === 'coordinator' && <CoordinatorDashboard />}
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : <Navigate replace to="/login" />
                } />
            </Routes>
        </Router>
    );
};

export default App;
