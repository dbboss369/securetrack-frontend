const ShipmentTable = ({ shipments = [], loading, selectedShipment, onSelectShipment }) => {
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

  return (
    <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', overflow: 'hidden' }}>
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
              Customer / Vaccine
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
              Carrier
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
              Address / Route
            </th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr
              key={shipment.id}
              onClick={() => onSelectShipment(shipment)}
              style={{
                backgroundColor:
                  selectedShipment?.id === shipment.id ? '#E6F8FC' : 'transparent',
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
                  #{shipment.id}
                </span>
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text)' }}>
                {shipment.customer || shipment.vaccineName || '—'}
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text)' }}>
                {shipment.carrier || '—'}
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--muted)' }}>
                {shipment.address || `${shipment.from} → ${shipment.to}` || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
