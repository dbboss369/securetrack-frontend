import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import ShipmentsPage from './pages/ShipmentsPage';  // ✅ CHANGED
import MessagesPage from './pages/MessagesPage';
import CustomersPage from './pages/CustomersPage';
import HelpSupportPage from './pages/HelpSupportPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="shipments" element={<ShipmentsPage />} />  {/* ✅ CHANGED */}
          <Route path="messages" element={<MessagesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="support" element={<HelpSupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
