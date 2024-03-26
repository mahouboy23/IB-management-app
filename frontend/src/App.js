import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import Classes from './components/Classes';
import Grades from './components/Grades';
import Boundaries from './components/Boundaries';
import SClasses from './components/Classes-s';
import SGrades from './components/Grades-s';
import COverview from './components/Overview-c'
import CClasses from './components/Classes-c';
import Users from './components/Users';

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
        console.log('Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        setUser(null);
    };         

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate replace to="/" />} />
                <Route path="/" element={
                    user ? (
                        <>
                            {user.role === 'teacher' && <TeacherDashboard onLogout={handleLogout} />}
                            {user.role === 'student' && <StudentDashboard onLogout={handleLogout} />}
                            {user.role === 'coordinator' && <CoordinatorDashboard onLogout={handleLogout} />}
                        </>
                    ) : <Navigate replace to="/login" />
                } />
                   {/* Other routes */}
                    <Route path="/teacher" element={<TeacherDashboard onLogout={handleLogout} />}>
                     <Route path="classes" element={<Classes onLogout={handleLogout} />} />
                     <Route path="grades" element={<Grades onLogout={handleLogout} />} />
                     <Route path='boundaries' element={<Boundaries onLogout={handleLogout} />} />
                    </Route>
                   {/* Define other nested routes */}
                    <Route path="/student" element={<StudentDashboard onLogout={handleLogout} />}>
                     <Route path="classes-s" element={<SClasses onLogout={handleLogout} />} />
                     <Route path="grades-s" element={<SGrades onLogout={handleLogout} />} />
                    </Route>
                   {/* Other routes */}
                   <Route path="/coordinator" element={<CoordinatorDashboard onLogout={handleLogout} />}>
                     <Route path="users" element={<Users onLogout={handleLogout} />} />
                     <Route path="overview" element={<COverview onLogout={handleLogout} />} />
                     <Route path="classes-c" element={<CClasses onLogout={handleLogout} />} />
                   </Route>
            </Routes>
        </Router>
    );
};

export default App;
