import React from 'react';

const ShipmentTable = ({
  shipments = [],
  loading,
  selectedShipment,
  onSelectShipment,
  user,
  onMarkReceived,
  updatingId,
}) => {
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        Loading shipments...
      </div>
    );
  }

  if (!shipments.length) {
    return (
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        No shipments found.
      </div>
    );
  }

  const isHospital = user?.role === 'hospital';

  const getStatusStyles = (status) => {
    if (status === 'Delivered') {
      return {
        bg: '#D1FAE5',
        dot: '#10B981',
        text: '#065F46',
      };
    }
    if (status === 'In Transit') {
      return {
        bg: '#DBEAFE',
        dot: '#3B82F6',
        text: '#1E40AF',
      };
    }
    if (status === 'Delayed') {
      return {
        bg: '#FEE2E2',
        dot: '#EF4444',
        text: '#991B1B',
      };
    }
    if (status === 'Pending') {
      return {
        bg: '#E5E7EB',
        dot: '#9CA3AF',
        text: '#374151',
      };
    }
    return {
      bg: '#F3F4F6',
      dot: '#9CA3AF',
      text: '#6B7280',
    };
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 260px)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th
              style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}
            >
              Shipment ID
            </th>
            <th
              style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}
            >
              Vaccine Type
            </th>
            <th
              style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: '12px 24px',
                textAlign: 'left',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}
            >
              Route
            </th>
            {isHospital && (
              <th
                style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => {
            const isSelected = selectedShipment?._id === shipment._id;
            const isInTransit = shipment.status === 'In Transit';
            const styles = getStatusStyles(shipment.status);

            return (
              <tr
                key={shipment._id}
                onClick={() => onSelectShipment(shipment)}
                style={{
                  backgroundColor: isSelected ? '#E6F8FC' : 'transparent',
                  borderBottom: '1px solid #F3F4F6',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      color: 'var(--primary)',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {shipment.shipmentId}
                  </span>
                </td>

                <td
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    color: 'var(--text)',
                  }}
                >
                  {shipment.vaccine || '—'}
                </td>

                <td style={{ padding: '16px 24px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      minWidth: '90px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '600',
                      lineHeight: 1.1,
                      backgroundColor: styles.bg,
                      color: styles.text,
                      textTransform: 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '999px',
                        backgroundColor: styles.dot,
                      }}
                    />
                    <span style={{ textAlign: 'center' }}>
                      {shipment.status === 'In Transit' ? (
                        <>
                          In
                          <br />
                          Transit
                        </>
                      ) : (
                        shipment.status
                      )}
                    </span>
                  </span>
                </td>

                <td
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    color: 'var(--muted)',
                  }}
                >
                  {shipment.origin} → {shipment.destination}
                </td>

                {isHospital && (
                  <td style={{ padding: '16px 24px' }}>
                    {isInTransit ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onMarkReceived) {
                            onMarkReceived(shipment._id);
                          }
                        }}
                        disabled={updatingId === shipment._id}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor:
                            updatingId === shipment._id
                              ? '#9CA3AF'
                              : 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor:
                            updatingId === shipment._id
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                      >
                        {updatingId === shipment._id
                          ? 'Updating...'
                          : 'Mark as Received'}
                      </button>
                    ) : (
                      <span
                        style={{ fontSize: '12px', color: 'var(--muted)' }}
                      >
                        —
                      </span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
