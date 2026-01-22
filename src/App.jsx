import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import ShipmentsPage from './pages/ShipmentsPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import TelemetryPage from './pages/TelemetryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserManagement from './pages/UserManagement';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateShipmentPage from './pages/CreateShipmentPage';

const ProtectedRoute = ({ children }) => {
  const stored = localStorage.getItem('user');
  let token = null;

  try {
    if (stored) {
      const user = JSON.parse(stored);
      token = user?.token;
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const stored = localStorage.getItem('user');
  let user = null;

  try {
    if (stored) {
      user = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="telemetry" element={<TelemetryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="create-shipment" element={<CreateShipmentPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route 
            path="user-management" 
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
