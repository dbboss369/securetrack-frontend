// src/pages/ShipmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainContent from '../components/MainContent';
import ShipmentDetailsPanel from '../components/ShipmentDetailsPanel';
import { getShipments, getStats } from '../services/api';
import axios from 'axios';

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

  // Hospital confirmation: mark a shipment as received (Delivered)
  const handleMarkReceived = async (shipmentId) => {
    try {
      setUpdatingId(shipmentId);

      const stored = localStorage.getItem('user');
      if (!stored) {
        console.error('No user in localStorage');
        return;
      }

      const parsedUser = JSON.parse(stored);
      const token = parsedUser?.token;
      if (!token) {
        console.error('No token on stored user');
        return;
      }

      await axios.put(
        `http://localhost:4000/api/shipments/${shipmentId}/status`,
        { status: 'Delivered' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Refresh data so table + stats + details update
      await loadData();
    } catch (error) {
      console.error('Error marking shipment as received:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div 
      style={{ flex: 1, display: 'flex' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
};

export default ShipmentsPage;
