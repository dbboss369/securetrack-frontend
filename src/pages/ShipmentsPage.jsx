import React, { useState, useEffect } from 'react';
import MainContent from '../components/MainContent';
import ShipmentDetailsPanel from '../components/ShipmentDetailsPanel';
import { getShipments, getStats } from '../services/api';
import axios from 'axios';
import { API_URL } from '../config';


const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [user, setUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);


  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    loadData();
  }, []);


  async function loadData() {
    try {
      const [shipmentsData, statsData] = await Promise.all([
        getShipments(),
        getStats()
      ]);

      setShipments(shipmentsData);
      setStats(statsData);

      if (shipmentsData.length > 0) {
        setSelectedShipment(shipmentsData[0]);
      }
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  }


  const handleMarkReceived = async (shipmentId) => {
    try {
      setUpdatingId(shipmentId);

      // ✅ FIXED: Get token directly from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      await axios.put(
        `${API_URL}/api/shipments/${shipmentId}/status`,
        { status: 'Delivered' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      await loadData();
    } catch (error) {
      console.error('Error marking shipment as received:', error);
    } finally {
      setUpdatingId(null);
    }
  };


  return (
    <div className="flex-1 flex">
      <MainContent
        shipments={shipments}
        stats={stats}
        loading={loading}
        selectedShipment={selectedShipment}
        onSelectShipment={setSelectedShipment}
        user={user}
        onMarkReceived={handleMarkReceived}
        updatingId={updatingId}
      />
      {selectedShipment && <ShipmentDetailsPanel shipment={selectedShipment} />}
    </div>
  );
};


export default ShipmentsPage;
