import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  TruckIcon, 
  UsersIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon,
  SignalIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setProfilePhoto(userData.profilePhoto || null);
    }
  }, []);

  // Listen for profile photo changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setProfilePhoto(userData.profilePhoto || null);
      }
    };

    // Listen to storage events (across tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen to custom event (same tab)
    window.addEventListener('profilePhotoUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePhotoUpdated', handleStorageChange);
    };
  }, []);

  const baseMenuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Home' },
    { path: '/dashboard/shipments', icon: TruckIcon, label: 'Shipments' },
    { path: '/dashboard/telemetry', icon: SignalIcon, label: 'Telemetry' },
    { path: '/dashboard/analytics', icon: ChartBarIcon, label: 'Analytics' },
    { path: '/dashboard/customers', icon: UsersIcon, label: 'Customers' },
  ];

  const adminMenuItems = [
    { path: '/dashboard/user-management', icon: UserGroupIcon, label: 'User Management' }
  ];

  const settingsMenuItem = { path: '/dashboard/settings', icon: CogIcon, label: 'Settings' };

  const menuItems = user?.role === 'admin' 
    ? [...baseMenuItems, ...adminMenuItems, settingsMenuItem]
    : [...baseMenuItems, settingsMenuItem];

  const handleLogout = () => {
    // Save private keys before clearing localStorage
    const hospitalPrivateKey = localStorage.getItem('hospitalPrivateKey');
    const manufacturerPrivateKey = localStorage.getItem('manufacturerPrivateKey');
    
    // Remove only session-specific data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Restore private keys (they should persist across sessions like a device keychain)
    if (hospitalPrivateKey) {
      localStorage.setItem('hospitalPrivateKey', hospitalPrivateKey);
    }
    if (manufacturerPrivateKey) {
      localStorage.setItem('manufacturerPrivateKey', manufacturerPrivateKey);
    }
    
    console.log('✅ Logged out - Private keys preserved');
    navigate('/login');
  };

  return (
    <div style={{ 
      width: '256px', 
      height: '100vh',
      backgroundColor: 'var(--primary-800)',
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      overflow: 'hidden'
    }}>
      
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
            flexShrink: 0,
            overflow: 'hidden',
            border: '2px solid var(--primary-500)'
          }}>
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
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
