import React from 'react';
import StatsCards from './StatsCards';
import ShipmentTable from './ShipmentTable';

const MainContent = ({ shipments, loading, selectedShipment, onSelectShipment }) => {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--card)',
          padding: '24px',
          borderBottom: '1px solid var(--border)',
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
      </div>

      {/* Statistics Cards */}
      <StatsCards />

      {/* Table Section */}
      <ShipmentTable
        shipments={shipments}
        loading={loading}
        selectedShipment={selectedShipment}
        onSelectShipment={onSelectShipment}
      />
    </div>
  );
};

export default MainContent;
