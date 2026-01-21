import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      
      {/* Main content area with left margin for fixed sidebar */}
      <div style={{
        marginLeft: '256px',  // ← ADDED: Match sidebar width
        flex: 1,              // ← ADDED: Take remaining space
        overflow: 'auto',     // ← ADDED: Allow scrolling
        height: '100vh'       // ← ADDED: Full viewport height
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
