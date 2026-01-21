import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { hybridEncrypt } from '../utils/hybridEncryption';

const CreateShipmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    vaccine: '',
    origin: '',
    destination: '',
    estimatedArrival: '',
    batchNumber: '',
    internalNote: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        setError('Please log in first');
        setLoading(false);
        return;
      }

      const user = JSON.parse(stored);
      const token = user?.token;

      if (!token) {
        setError('Missing auth token. Please log in again.');
        setLoading(false);
        return;
      }

      // Get hospital public key
      const hospitalRes = await axios.get(
        `http://localhost:4000/api/users/hospital/${encodeURIComponent(
          formData.destination
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { publicKey, walletAddress } = hospitalRes.data;

      if (!publicKey) {
        setError('Destination hospital does not have a public key configured.');
        setLoading(false);
        return;
      }

      // Prepare sensitive data
      const sensitivePayload = {
        vaccine: formData.vaccine,
        batchNumber: formData.batchNumber,
        internalNote: formData.internalNote,
        origin: formData.origin,
        destination: formData.destination,
        estimatedArrival: formData.estimatedArrival,
        hospitalWallet: walletAddress,
      };

      console.log('Encrypting with hybrid encryption...');
      
      // Use hybrid encryption (AES + RSA)
      const { encryptedData, encryptedKey } = hybridEncrypt(
        sensitivePayload,
        publicKey
      );

      console.log('Encryption successful! Sending to backend...');

      // Send to backend
      await axios.post(
        'http://localhost:4000/api/create-shipment',
        {
          vaccine: formData.vaccine,
          origin: formData.origin,
          destination: formData.destination,
          estimatedArrival: formData.estimatedArrival,
          quantity: 100,
          batchNumber: formData.batchNumber,
          internalNote: formData.internalNote,
          encryptedDetails: encryptedData,
          encryptedKey: encryptedKey,  // NEW: send encrypted AES key
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Shipment created successfully!');
      navigate('/dashboard/shipments');
    } catch (err) {
      console.error('Error creating shipment:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        padding: '24px',
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '600',
            color: 'var(--text)',
            marginBottom: '24px',
          }}
        >
          Create Shipment
        </h1>

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Vaccine Type *
            </label>
            <input
              type="text"
              name="vaccine"
              value={formData.vaccine}
              onChange={handleChange}
              required
              placeholder="Pfizer COVID-19"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Origin *
            </label>
            <input
              type="text"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              placeholder="Mumbai"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder="maj"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Estimated Arrival *
            </label>
            <input
              type="datetime-local"
              name="estimatedArrival"
              value={formData.estimatedArrival}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Batch Number *
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              required
              placeholder="BATCH-2026-01"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              Internal Note
            </label>
            <textarea
              name="internalNote"
              value={formData.internalNote}
              onChange={handleChange}
              placeholder="Any special handling instructions, temperature requirements, or detailed notes (NO SIZE LIMIT!)..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loading ? '#9CA3AF' : 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/shipments')}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateShipmentPage;
