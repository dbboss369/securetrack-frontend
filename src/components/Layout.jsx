import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      
      {/* Main content area */}
      <div style={{
        marginLeft: '256px',  
        flex: 1,              
        overflow: 'auto',     
        height: '100vh'       
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
