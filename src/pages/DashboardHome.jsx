import React from 'react';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  MapIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const DashboardHome = () => {
  const quickStats = [
    { 
      title: 'Total Shipments', 
      value: '12,000', 
      change: '+12.3%', 
      trend: 'up',
      icon: TruckIcon 
    },
    { 
      title: 'In Transit', 
      value: '3,000', 
      change: '+8.2%', 
      trend: 'up',
      icon: ClockIcon 
    },
    { 
      title: 'Delivered', 
      value: '8,000', 
      change: '+15.1%', 
      trend: 'up',
      icon: CheckCircleIcon 
    },
    { 
      title: 'Issues', 
      value: '100', 
      change: '-23.5%', 
      trend: 'down',
      icon: ExclamationTriangleIcon 
    }
  ];

  const recentActivity = [
    { id: 'AB672MN45', action: 'Shipment dispatched', time: '2 minutes ago', status: 'success' },
    { id: 'CD831LM92', action: 'Delivery completed', time: '15 minutes ago', status: 'success' },
    { id: 'EF294NK73', action: 'Issue reported', time: '32 minutes ago', status: 'warning' },
    { id: 'GH597PQ84', action: 'Shipment created', time: '1 hour ago', status: 'info' },
    { id: 'IJ728RS95', action: 'Payment received', time: '2 hours ago', status: 'success' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'auto' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Dashboard</h1>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Welcome back! Here's what's happening with your shipments.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 16px',
              backgroundColor: '#F1FBFE',
              color: 'var(--primary-700)',
              border: '1px solid #D8F0F7',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Export Data
            </button>
            <button style={{
              padding: '10px 16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              New Shipment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px' }}>
        
        {/* Quick Stats */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {quickStats.map((stat, index) => (
              <div key={index} style={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)', 
                borderRadius: '12px', 
                padding: '20px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${index === 0 ? 'var(--primary)' : index === 1 ? 'var(--primary-600)' : index === 2 ? 'var(--primary-700)' : '#ef4444'}15`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <stat.icon style={{ width: '20px', height: '20px', color: index === 0 ? 'var(--primary)' : index === 1 ? 'var(--primary-600)' : index === 2 ? 'var(--primary-700)' : '#ef4444' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ArrowTrendingUpIcon style={{ width: '16px', height: '16px', color: stat.trend === 'up' ? 'var(--primary-600)' : '#ef4444', transform: stat.trend === 'down' ? 'rotate(180deg)' : 'none' }} />
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: stat.trend === 'up' ? 'var(--primary-600)' : '#ef4444'
                    }}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                  {stat.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          
          {/* Recent Activity */}
          <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: index < recentActivity.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: activity.status === 'success' ? 'var(--primary-600)' : 
                                   activity.status === 'warning' ? '#f59e0b' : 'var(--primary)'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: 'var(--text)', margin: 0, fontWeight: '500' }}>
                      #{activity.id} - {activity.action}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Performance Summary */}
            <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>This Week</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>New Shipments</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>280</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Completed</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-600)' }}>100</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Pending</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Success Rate</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--primary-600)' }}>96%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#F1FBFE',
                  color: 'var(--primary-700)',
                  border: '1px solid #D8F0F7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  <ChartBarIcon style={{ width: '16px', height: '16px' }} />
                  View Analytics
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#F1FBFE',
                  color: 'var(--primary-700)',
                  border: '1px solid #D8F0F7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  <MapIcon style={{ width: '16px', height: '16px' }} />
                  Track Location
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: '#F1FBFE',
                  color: 'var(--primary-700)',
                  border: '1px solid #D8F0F7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  <UsersIcon style={{ width: '16px', height: '16px' }} />
                  Manage Customers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
