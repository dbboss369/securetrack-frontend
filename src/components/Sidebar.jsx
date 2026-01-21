import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  TruckIcon, 
  UsersIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  SignalIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Home' },
    { path: '/dashboard/shipments', icon: TruckIcon, label: 'Shipments' },
    { path: '/dashboard/telemetry', icon: SignalIcon, label: 'Telemetry' },
    { path: '/dashboard/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/dashboard/customers', icon: UsersIcon, label: 'Customers' },
    { path: '/dashboard/settings', icon: CogIcon, label: 'Settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ 
      width: '256px', 
      height: '100vh',            // ← FIXED: Always 100vh
      backgroundColor: 'var(--primary-800)',
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      position: 'fixed',          // ← FIXED: Fixed positioning
      top: 0,                     // ← FIXED: Stick to top
      left: 0,                    // ← FIXED: Stick to left
      zIndex: 100,                // ← FIXED: Above other content
      overflow: 'hidden'          // ← FIXED: No scroll on sidebar itself
    }}>
      
      {/* Header with Logo */}
      <div style={{ 
        padding: '24px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            flexShrink: 0
          }}>
            <img 
              src={logo} 
              alt="SecureTrack Logo" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }} 
            />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>SecureTrack</h1>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ 
        flex: 1, 
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ 
            color: '#9CCEE0',
            fontSize: '12px', 
            fontWeight: '500', 
            textTransform: 'uppercase',
            marginBottom: '12px',
            paddingLeft: '8px'
          }}>MAIN MENU</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px', 
                  backgroundColor: location.pathname === item.path ? 'var(--primary-700)' : 'transparent',
                  color: location.pathname === item.path ? 'white' : '#CDEAF3',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-700)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#CDEAF3';
                  }
                }}
              >
                <item.icon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '12px',
            marginTop: 'auto',
            marginBottom: '12px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#CDEAF3',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '400',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#CDEAF3';
          }}
        >
          <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />
          <span>Logout</span>
        </button>
      </div>

      {/* User Profile */}
      <div style={{ 
        padding: '24px', 
        borderTop: '1px solid var(--primary-700)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.name || 'User'}
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: '#9CCEE0', 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
