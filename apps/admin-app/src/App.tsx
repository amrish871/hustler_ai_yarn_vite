import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import AuthLayout from './components/AuthLayout';
import { useAuth } from '@myorg/auth';
import AdminDashboard from './screens/AdminDashboard';


export default function App() {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated"+isAuthenticated);
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect based on login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              // <Navigate to="/login" replace />
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route element={<AuthLayout isAuthenticated={isAuthenticated} />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
          {/* Add more authenticated routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
