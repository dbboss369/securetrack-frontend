import React from 'react';
import { ArrowLeftIcon, PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const ShipmentDetailsPanel = ({ shipment }) => {
  const statusSteps = [
    { date: '3 February 2025', status: 'Collected from Sender — Awaiting Approval', completed: true },
    { date: '4 February 2025', status: 'At Transfer Center — In Loading Process', completed: true },
    { date: '5 February 2025', status: 'At Delivery Branch — Awaiting Distribution', completed: true },
    { date: '6 February 2025', status: 'Out for Delivery', completed: false },
    { date: '7 February 2025', status: 'Delivered', completed: false }
  ];

  return (
    <div style={{ 
      width: '384px', 
      backgroundColor: 'var(--card)', 
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ArrowLeftIcon style={{ width: '20px', height: '20px', color: 'var(--muted)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Shipment Details</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Shipment ID:</span>
          <span style={{ fontWeight: '500', color: 'var(--primary)' }}>#AB672MN45</span>
          <span style={{ 
            padding: '4px 8px', 
            backgroundColor: 'var(--chip-bg)', 
            color: 'var(--primary-700)', 
            fontSize: '12px', 
            borderRadius: '12px',
            fontWeight: '500'
          }}>
            Dispatched
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        
        {/* Carrier and Customer Info */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '12px' }}>Carrier Information</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face&auto=format" 
                  alt="Carrier" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>jon paul</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '6px 12px', 
                  backgroundColor: '#F1FBFE', 
                  color: 'var(--primary-700)', 
                  border: '1px solid #D8F0F7',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F8FC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1FBFE'}
                >
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  Call
                </button>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '6px 12px', 
                  backgroundColor: '#F1FBFE', 
                  color: 'var(--primary-700)', 
                  border: '1px solid #D8F0F7',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F8FC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1FBFE'}
                >
                  <ChatBubbleLeftIcon style={{ width: '16px', height: '16px' }} />
                  Message
                </button>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '12px' }}>Customer Information</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
                  alt="Customer" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>james</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '6px 12px', 
                  backgroundColor: '#F1FBFE', 
                  color: 'var(--primary-700)', 
                  border: '1px solid #D8F0F7',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F8FC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1FBFE'}
                >
                  <PhoneIcon style={{ width: '16px', height: '16px' }} />
                  Call
                </button>
                <button style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '6px 12px', 
                  backgroundColor: '#F1FBFE', 
                  color: 'var(--primary-700)', 
                  border: '1px solid #D8F0F7',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6F8FC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1FBFE'}
                >
                  <ChatBubbleLeftIcon style={{ width: '16px', height: '16px' }} />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Shipment Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Tracking Number</p>
              <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>ABC01-DE23FG4H</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Category</p>
              <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>White Goods</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Shipping Date</p>
              <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>3 February 2025</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Estimated Delivery Date</p>
              <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>7 February 2025</p>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Address</p>
            <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>kerala,ernakulam</p>
          </div>

          <div style={{ marginTop: '16px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Note</p>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>Please handle with care. Fragile.</p>
          </div>
        </div>

        {/* Shipment Status */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Shipment Status</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {statusSteps.map((step, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '4px' }}>
                  {step.completed ? (
                    <CheckCircleIcon style={{ width: '20px', height: '20px', color: 'var(--primary-600)' }} />
                  ) : (
                    <ClockIcon style={{ width: '20px', height: '20px', color: '#D1D5DB' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{step.date}</p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: step.completed ? 'var(--text)' : 'var(--muted)',
                    margin: 0
                  }}>
                    {step.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPanel;
