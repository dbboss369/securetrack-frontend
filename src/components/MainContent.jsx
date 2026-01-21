import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCards from './StatsCards';
import ShipmentTable from './ShipmentTable';

const MainContent = ({
  shipments,
  loading,
  selectedShipment,
  onSelectShipment,
  stats,
  user,
  onMarkReceived,
  updatingId,
}) => {
  const navigate = useNavigate();
  const isManufacturer = user?.role === 'manufacturer';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--card)',
          padding: '24px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Shipments
          </h1>
          {isManufacturer && (
            <button
              type="button"
              onClick={() => navigate('/dashboard/create-shipment')}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              + Create Shipment
            </button>
          )}
        </div>
      </div>

      <StatsCards stats={stats} />

      <ShipmentTable
        shipments={shipments}
        loading={loading}
        selectedShipment={selectedShipment}
        onSelectShipment={onSelectShipment}
        user={user}
        onMarkReceived={onMarkReceived}
        updatingId={updatingId}
      />
    </div>
  );
};

export default MainContent;
