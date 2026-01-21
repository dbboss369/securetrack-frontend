import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, LockClosedIcon, LockOpenIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import TelemetryChart from './TelemetryChart';
import BlockchainInfo from './BlockchainInfo';
import { hybridDecrypt } from '../utils/hybridEncryption';

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
      const res = await fetch(`http://localhost:4000/api/shipments/${shipmentId}/telemetry`);
      const data = await res.json();
      setTelemetry(data);
    } catch (err) {
      console.error('Failed to load telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  // Decrypt shipment details using hybrid encryption
  const handleDecrypt = async () => {
    if (!shipment?.encryptedDetails || !shipment?.encryptedKey) {
      setDecryptError('No encrypted details or encryption key available for this shipment.');
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

      console.log('🔓 Starting hybrid decryption...');
      console.log('   Encrypted data length:', shipment.encryptedDetails.length);
      console.log('   Encrypted key length:', shipment.encryptedKey.length);

      // Use the hybridDecrypt function from your utility
      const decryptedString = hybridDecrypt(
        shipment.encryptedDetails,  // AES-encrypted data (base64)
        shipment.encryptedKey,       // RSA-encrypted AES key (base64)
        privateKey                   // Hospital's RSA private key (PEM)
      );

      console.log('✅ Decryption successful!');
      
      // Parse JSON
      const decrypted = JSON.parse(decryptedString);
      setDecryptedData(decrypted);

    } catch (error) {
      console.error('❌ Decryption error:', error);
      setDecryptError('Failed to decrypt. This shipment may not be intended for you, or your private key is incorrect.');
    } finally {
      setDecrypting(false);
    }
  };

  const handleHideDetails = () => {
    setDecryptedData(null);
    setDecryptError(null);
  };

  const isHospital = user?.role === 'hospital';
  const hasEncryptedDetails = shipment?.encryptedDetails && shipment?.encryptedKey;

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
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* DECRYPTION PANEL - HYBRID ENCRYPTION */}
        {isHospital && hasEncryptedDetails && (
          <div style={{ 
            padding: '24px', 
            borderBottom: '1px solid var(--border)',
            backgroundColor: decryptedData ? '#F0FDF4' : '#FFF7ED'
          }}>
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
                  Secure Details (Decrypted)
                </>
              ) : (
                <>
                  <LockClosedIcon style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                  Encrypted Shipment Details
                </>
              )}
            </h3>

            {!decryptedData ? (
              <div>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--muted)', 
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  This shipment contains encrypted sensitive information. Click below to decrypt using your private key.
                </p>
                
                <button
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
                  {decrypting ? 'Decrypting...' : 'View Secure Details'}
                </button>

                {decryptError && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#991B1B'
                  }}>
                    ⚠️ {decryptError}
                  </div>
                )}
              </div>
            ) : (
              <div>
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

                <button
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
                </button>
              </div>
            )}
          </div>
        )}

        {/* Temperature Chart */}
        {telemetry.length > 0 && (
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <TelemetryChart data={telemetry} />
          </div>
        )}

        {/* Blockchain Verification */}
        <BlockchainInfo shipmentId={shipment.shipmentId} />

        {/* Shipment Details */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
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

          {/* ❌ REMOVED: Humidity display */}
        </div>

        {/* Telemetry Table */}
        {telemetry.length > 0 && (
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Recent Telemetry Data</h3>

            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted-bg)', textAlign: 'left' }}>
                    <th style={{ padding: '8px', color: 'var(--muted)' }}>Time</th>
                    <th style={{ padding: '8px', color: 'var(--muted)' }}>Temp (°C)</th>
                    {/* ❌ REMOVED: Humidity column */}
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
                      {/* ❌ REMOVED: Humidity cell */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
            Loading telemetry data...
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentDetailsPanel;
