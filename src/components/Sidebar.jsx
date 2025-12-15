import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TruckIcon, 
  ChatBubbleLeftIcon, 
  UsersIcon, 
  QuestionMarkCircleIcon, 
  CogIcon
} from '@heroicons/react/24/outline';
import logo from '../assets/logo.svg';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Home' },
    { path: '/dashboard/shipments', icon: TruckIcon, label: 'Shipments' },
    { path: '/dashboard/messages', icon: ChatBubbleLeftIcon, label: 'Messages' },
    { path: '/dashboard/customers', icon: UsersIcon, label: 'Customers' },
    { path: '/dashboard/support', icon: QuestionMarkCircleIcon, label: 'Help & Support' },
    { path: '/dashboard/settings', icon: CogIcon, label: 'Settings' }
  ];

  return (
    <div style={{ 
      width: '256px', 
      height: '100vh',  // Added: Full viewport height
      backgroundColor: 'var(--primary-800)',
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid var(--border)'
    }}>
      
      {/* Header with Logo */}
      <div style={{ padding: '24px' }}>
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
      <div style={{ flex: 1, padding: '0 16px' }}>
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
      </div>

      {/* User Profile */}
      <div style={{ padding: '24px', borderTop: '1px solid var(--primary-700)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
            alt="User" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>james</p>
            <p style={{ fontSize: '12px', color: '#9CCEE0', margin: 0 }}>james@gmail.coms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
