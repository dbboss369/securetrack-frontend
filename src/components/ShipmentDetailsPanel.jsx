import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, LockClosedIcon, LockOpenIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import TelemetryChart from './TelemetryChart';
import BlockchainInfo from './BlockchainInfo';
import { hybridDecrypt } from '../utils/hybridEncryption';
import { API_URL } from '../config';


const ShipmentDetailsPanel = ({ shipment }) => {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState(null);
  const [user, setUser] = useState(null);


  // Get user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);


  // Fetch telemetry data when shipment changes
  useEffect(() => {
    if (shipment?.shipmentId) {
      fetchTelemetry(shipment.shipmentId);
      // Reset decryption when shipment changes
      setDecryptedData(null);
      setDecryptError(null);
    }
  }, [shipment]);


  const fetchTelemetry = async (shipmentId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/telemetry/${shipmentId}`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoading(false);
    }
  };


  // Decrypt shipment details using blockchain key
  const handleDecrypt = async () => {
    if (!shipment?.encryptedDetails) {
      setDecryptError('No encrypted details available for this shipment.');
      return;
    }


    setDecrypting(true);
    setDecryptError(null);


    try {
      // Get private key from localStorage
      const privateKey = localStorage.getItem('hospitalPrivateKey');
      
      if (!privateKey) {
        setDecryptError('Private key not found. Please re-login to retrieve your key.');
        setDecrypting(false);
        return;
      }


      console.log('🔐 Fetching encrypted key from blockchain...');
      console.log('Shipment ID:', shipment.shipmentId);
      
      // ✅ FIXED: Get token directly from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('User not logged in');
      }
      
      // Construct URL using config
      const fullUrl = `${API_URL}/api/shipments/${shipment.shipmentId}/encryption-key`;
      console.log('Fetching from URL:', fullUrl);
      
      // Fetch encrypted key from blockchain via backend
      const keyResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });


      console.log('Response status:', keyResponse.status);


      if (!keyResponse.ok) {
        const errorText = await keyResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch encryption key: ${keyResponse.status}`);
      }


      const responseData = await keyResponse.json();
      const { encryptedKey } = responseData;
      
      console.log('✅ Got encrypted key from blockchain!');
      console.log('Encrypted key length:', encryptedKey?.length);


      if (!encryptedKey) {
        throw new Error('No encryption key returned from blockchain');
      }


      console.log('🔓 Starting hybrid decryption...');
      console.log('   Encrypted data length:', shipment.encryptedDetails.length);
      console.log('   Encrypted key length:', encryptedKey.length);


      // Decrypt using hybrid decryption
      const decryptedString = hybridDecrypt(
        shipment.encryptedDetails,  // From MongoDB
        encryptedKey,               // From Blockchain
        privateKey                  // From localStorage
      );


      console.log('✅ Decryption successful!');
      
      // Parse JSON
      const decrypted = JSON.parse(decryptedString);
      setDecryptedData(decrypted);


    } catch (error) {
      console.error('❌ Decryption error:', error);
      setDecryptError(`Failed to decrypt: ${error.message}`);
    } finally {
      setDecrypting(false);
    }
  };


  const handleHideDetails = () => {
    setDecryptedData(null);
    setDecryptError(null);
  };


  const isHospital = user?.role === 'hospital';
  const hasEncryptedDetails = shipment?.encryptedDetails;


  if (!shipment) {
    return (
      <div style={{
        width: '384px',
        backgroundColor: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)'
      }}>
        Select a shipment to view details
      </div>
    );
  }


  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={shipment.shipmentId}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ 
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.8
        }}
        style={{
          width: '384px',
          backgroundColor: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.08)'
        }}
      >
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ArrowLeftIcon style={{ width: '20px', height: '20px', color: 'var(--muted)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Shipment Details</h2>
            </div>
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>Shipment ID:</span>
            <span style={{ fontWeight: '500', color: 'var(--primary)' }}>{shipment.shipmentId}</span>
            <span style={{
              padding: '4px 8px',
              backgroundColor: 'var(--chip-bg)',
              color: 'var(--primary-700)',
              fontSize: '12px',
              borderRadius: '12px',
              fontWeight: '500'
            }}>
              {shipment.status || 'In Transit'}
            </span>
          </div>
        </motion.div>


        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>


          {/* DECRYPTION PANEL - BLOCKCHAIN INTEGRATION */}
          {isHospital && hasEncryptedDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ 
                padding: '24px', 
                borderBottom: '1px solid var(--border)',
                backgroundColor: decryptedData ? '#F0FDF4' : '#FFF7ED'
              }}
            >
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: 'var(--text)', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {decryptedData ? (
                  <>
                    <LockOpenIcon style={{ width: '16px', height: '16px', color: '#10B981' }} />
                    Secure Details (Decrypted via Blockchain)
                  </>
                ) : (
                  <>
                    <LockClosedIcon style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                    Encrypted Shipment Details
                  </>
                )}
              </h3>


              <AnimatePresence mode="wait">
                {!decryptedData ? (
                  <motion.div
                    key="encrypted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p style={{ 
                      fontSize: '13px', 
                      color: 'var(--muted)', 
                      marginBottom: '12px',
                      lineHeight: '1.5'
                    }}>
                      This shipment contains encrypted sensitive information. The encryption key is stored on the blockchain for immutability and security.
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDecrypt}
                      disabled={decrypting}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: decrypting ? '#9CA3AF' : 'var(--primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: decrypting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <EyeIcon style={{ width: '16px', height: '16px' }} />
                      {decrypting ? 'Decrypting from Blockchain...' : 'View Secure Details'}
                    </motion.button>


                    {decryptError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: '#FEE2E2',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: '#991B1B'
                        }}
                      >
                        ⚠️ {decryptError}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="decrypted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ 
                      backgroundColor: '#FFFFFF',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid #D1FAE5'
                    }}>
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Vaccine Type</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
                          {decryptedData.vaccine || 'N/A'}
                        </p>
                      </div>


                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Batch Number</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
                          {decryptedData.batchNumber || 'N/A'}
                        </p>
                      </div>


                      {decryptedData.quantity && (
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Quantity</p>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
                            {decryptedData.quantity} doses
                          </p>
                        </div>
                      )}


                      {decryptedData.internalNote && (
                        <div>
                          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Internal Notes</p>
                          <p style={{ fontSize: '13px', color: 'var(--text)', margin: 0, lineHeight: '1.5' }}>
                            {decryptedData.internalNote}
                          </p>
                        </div>
                      )}
                    </div>


                    <div style={{
                      padding: '12px',
                      backgroundColor: '#E6F8FC',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#0e7490',
                      marginBottom: '12px'
                    }}>
                      🔗 Decrypted using encryption key retrieved from Polygon Amoy blockchain
                    </div>


                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleHideDetails}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        backgroundColor: '#F3F4F6',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <EyeSlashIcon style={{ width: '16px', height: '16px' }} />
                      Hide Details
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}


          {/* Temperature Chart */}
          {telemetry.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}
            >
              <TelemetryChart data={telemetry} />
            </motion.div>
          )}


          {/* Blockchain Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <BlockchainInfo shipmentId={shipment.shipmentId} />
          </motion.div>


          {/* Shipment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Shipment Information</h3>


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div>
                <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Origin</p>
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>{shipment.origin || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Destination</p>
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>{shipment.destination || 'N/A'}</p>
              </div>
              <div>
                <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Start Date</p>
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>
                  {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--muted)', marginBottom: '4px' }}>Estimated Delivery</p>
                <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>
                  {shipment.estimatedArrival ? new Date(shipment.estimatedArrival).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>


            <div style={{ marginTop: '16px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Temperature</p>
              <p style={{ fontWeight: '500', color: 'var(--text)', margin: 0 }}>
                {shipment.temperature ? `${shipment.temperature}°C` : 'N/A'}
              </p>
            </div>
          </motion.div>


          {/* Telemetry Table */}
          {telemetry.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Recent Telemetry Data</h3>


              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted-bg)', textAlign: 'left' }}>
                      <th style={{ padding: '8px', color: 'var(--muted)' }}>Time</th>
                      <th style={{ padding: '8px', color: 'var(--muted)' }}>Temp (°C)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.slice(-10).reverse().map((reading, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '8px', color: 'var(--text)' }}>
                          {new Date(reading.timestamp).toLocaleTimeString()}
                        </td>
                        <td style={{
                          padding: '8px',
                          color: reading.temperature < 2 || reading.temperature > 8 ? '#EF4444' : 'var(--text)',
                          fontWeight: reading.temperature < 2 || reading.temperature > 8 ? '600' : '400'
                        }}>
                          {reading.temperature}°C
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}


          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}
            >
              Loading telemetry data...
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


export default ShipmentDetailsPanel;
