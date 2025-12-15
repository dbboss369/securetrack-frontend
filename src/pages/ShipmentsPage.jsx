import React, { useState, useEffect } from 'react';
import MainContent from '../components/MainContent';
import ShipmentDetailsPanel from '../components/ShipmentDetailsPanel';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    async function loadShipments() {
      try {
        const res = await fetch('http://localhost:4000/api/shipments');
        const data = await res.json();
        setShipments(data);
        if (data.length > 0) {
          setSelectedShipment(data[0]); // auto-select first shipment
        }
      } catch (err) {
        console.error('Failed to load shipments', err);
      } finally {
        setLoading(false);
      }
    }

    loadShipments();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <MainContent
        shipments={shipments}
        loading={loading}
        selectedShipment={selectedShipment}
        onSelectShipment={setSelectedShipment}
      />
      {selectedShipment && <ShipmentDetailsPanel shipment={selectedShipment} />}
    </div>
  );
};

export default ShipmentsPage;
