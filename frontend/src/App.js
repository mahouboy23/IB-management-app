import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import Classes from './components/Classes';
import Grades from './components/Grades';
import Boundaries from './components/Boundaries';
import SClasses from './components/Classes-s';
import SGrades from './components/Grades-s';
import COverview from './components/Overview-c';
import CClasses from './components/Classes-c';
import Users from './components/Users';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <Navigate to="/login" />} />
      <Route path="/teacher/*" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/*" element={<ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>} />
      {/* Other routes */}
      <Route path="/teacher" element={<TeacherDashboard />}>
        <Route path="classes" element={<Classes />} />
        <Route path="grades" element={<Grades />} />
        <Route path='boundaries' element={<Boundaries />} />
      </Route>
      {/* Define other nested routes */}
      <Route path="/student" element={<StudentDashboard />}>
        <Route path="classes-s" element={<SClasses />} />
        <Route path="grades-s" element={<SGrades />} />
      </Route>
      {/* Other routes */}
      <Route path="/coordinator" element={<CoordinatorDashboard />}>
        <Route path="users" element={<Users />} />
        <Route path="overview" element={<COverview />} />
        <Route path="classes-c" element={<CClasses />} />
      </Route>
    </Routes>
  );
};

export default App;