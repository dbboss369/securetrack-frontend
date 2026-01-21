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
import Login from './components/Login';
import Signup from './components/Signup';
import CreateShipmentPage from './pages/CreateShipmentPage';

// Protected Route Component using user.token
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes under /dashboard */}
          <Route index element={<DashboardHome />} />
          <Route path="shipments" element={<ShipmentsPage />} />
          <Route path="telemetry" element={<TelemetryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="create-shipment" element={<CreateShipmentPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
