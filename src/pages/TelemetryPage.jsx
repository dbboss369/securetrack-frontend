import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import ShipmentLocationMap from '../components/ShipmentLocationMap';
import { API_URL } from '../config';

const TelemetryPage = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [stats, setStats] = useState({
    totalReadings: 0,
    avgTemp: 0,
    minTemp: 0,
    maxTemp: 0,
    violations: 0
  });

  useEffect(() => {
    fetchAllTelemetry();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchAllTelemetry, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllTelemetry = async () => {
    try {
      const response = await fetch(`${API_URL}/api/telemetry/all`);
      const data = await response.json();
      
      setTelemetryData(data);
      calculateStats(data);
      
      // Auto-select first shipment if none selected
      if (!selectedShipmentId && data.length > 0) {
        setSelectedShipmentId(data[0].shipmentId);
      }
    } catch (error) {
      console.error('Failed to fetch telemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ totalReadings: 0, avgTemp: 0, minTemp: 0, maxTemp: 0, violations: 0 });
      return;
    }

    const temps = data.map(d => d.temperature);
    const totalReadings = data.length;
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / totalReadings).toFixed(1);
    const minTemp = Math.min(...temps).toFixed(1);
    const maxTemp = Math.max(...temps).toFixed(1);
    const violations = data.filter(d => d.temperature < 2 || d.temperature > 8).length;

    setStats({ totalReadings, avgTemp, minTemp, maxTemp, violations });
  };

  // Get unique shipment IDs for dropdown
  const uniqueShipments = [...new Set(telemetryData.map(t => t.shipmentId))];

  // Get telemetry data for selected shipment
  const selectedShipmentData = selectedShipmentId 
    ? telemetryData.filter(t => t.shipmentId === selectedShipmentId)
    : [];

  // Get shipment details from first reading
  const shipmentDetails = selectedShipmentData.length > 0 ? {
    shipmentId: selectedShipmentData[0].shipmentId,
    origin: selectedShipmentData[0].origin,
    destination: selectedShipmentData[0].destination,
    status: selectedShipmentData[0].status || 'In Transit'
  } : null;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px' }}>🌡️</div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
              Temperature Telemetry
            </h1>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
              Real-time temperature monitoring • Auto-refreshes every 10s
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          
          <motion.div
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <ChartBarIcon style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>Total Readings</p>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text)', margin: 0 }}>
              {stats.totalReadings}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              backgroundColor: '#DBEAFE',
              borderRadius: '12px',
              border: '1px solid #93C5FD',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '13px', color: '#1E40AF', margin: '0 0 8px 0' }}>Avg Temperature</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E3A8A', margin: 0 }}>
              {stats.avgTemp}°C
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              backgroundColor: '#DBEAFE',
              borderRadius: '12px',
              border: '1px solid #93C5FD',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '13px', color: '#1E40AF', margin: '0 0 8px 0' }}>Min Temperature</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E3A8A', margin: 0 }}>
              {stats.minTemp}°C
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              backgroundColor: '#FEE2E2',
              borderRadius: '12px',
              border: '1px solid #FCA5A5',
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '13px', color: '#991B1B', margin: '0 0 8px 0' }}>Max Temperature</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7F1D1D', margin: 0 }}>
              {stats.maxTemp}°C
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, boxShadow: `0 4px 12px ${stats.violations > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}` }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              backgroundColor: stats.violations > 0 ? '#FEE2E2' : '#D1FAE5',
              borderRadius: '12px',
              border: `1px solid ${stats.violations > 0 ? '#FCA5A5' : '#86EFAC'}`,
              cursor: 'pointer'
            }}
          >
            <p style={{ fontSize: '13px', color: stats.violations > 0 ? '#991B1B' : '#065F46', margin: '0 0 8px 0' }}>
              Violations
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: stats.violations > 0 ? '#7F1D1D' : '#047857', margin: 0 }}>
              {stats.violations}
            </p>
          </motion.div>

        </div>
      </div>

      {/* GPS MAP SECTION */}
      {uniqueShipments.length > 0 && (
        <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
          
          {/* Shipment Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: 'var(--text)',
              marginBottom: '8px'
            }}>
              📦 Select Shipment for GPS Tracking
            </label>
            <select
              value={selectedShipmentId || ''}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              {uniqueShipments.map(shipmentId => (
                <option key={shipmentId} value={shipmentId}>
                  {shipmentId}
                </option>
              ))}
            </select>
          </div>

          {/* GPS Map */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '16px' 
          }}>
            <span style={{ fontSize: '20px' }}>📍</span>
            <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
              Current GPS Location
            </h3>
          </div>
          
          <ShipmentLocationMap 
            telemetryData={selectedShipmentData} 
            shipment={shipmentDetails}
          />
        </div>
      )}

      {/* Telemetry Table */}
      <div style={{ flex: 1, backgroundColor: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
            All Temperature Readings
          </h2>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {telemetryData.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌡️</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
                No Telemetry Data Available
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                Start the simulator to see temperature readings here.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Shipment ID</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Route</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Temperature</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Location</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Blockchain</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {telemetryData.map((reading, index) => {
                  const isViolation = reading.temperature < 2 || reading.temperature > 8;
                  
                  return (
                    <motion.tr
                      key={`${reading.shipmentId}-${index}`}
                      whileHover={{ 
                        backgroundColor: isViolation ? '#FEE2E2' : '#F9FAFB',
                        x: 4,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        borderBottom: '1px solid #F3F4F6',
                        backgroundColor: isViolation ? '#FEF2F2' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--primary)' }}>
                        {reading.shipmentId}
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--muted)', fontSize: '14px' }}>
                        {reading.origin} → {reading.destination}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: isViolation ? '#DC2626' : '#0891B2'
                        }}>
                          {reading.temperature}°C
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--muted)' }}>
                        {reading.latitude && reading.longitude ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPinIcon style={{ width: '14px', height: '14px' }} />
                            <a 
                              href={`https://www.google.com/maps?q=${reading.latitude},${reading.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', textDecoration: 'none' }}
                            >
                              {reading.latitude.toFixed(4)}, {reading.longitude.toFixed(4)}
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: isViolation ? '#FEE2E2' : '#D1FAE5',
                          color: isViolation ? '#991B1B' : '#065F46'
                        }}>
                          {isViolation ? '⚠️ Violation' : '✓ Normal'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {reading.blockchainTx ? (
                          <a
                            href={`https://amoy.polygonscan.com/tx/${reading.blockchainTx}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '12px',
                              color: 'var(--primary)',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            ⛓️ View TX
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--muted)', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ClockIcon style={{ width: '14px', height: '14px' }} />
                          {new Date(reading.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemetryPage;
