import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import { hybridEncrypt } from '../utils/hybridEncryption';
import { API_URL } from '../config';

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
        `${API_URL}/api/users/hospital/${encodeURIComponent(
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
        `${API_URL}/api/create-shipment`,
        {
          vaccine: formData.vaccine,
          origin: formData.origin,
          destination: formData.destination,
          estimatedArrival: formData.estimatedArrival,
          quantity: 100,
          batchNumber: formData.batchNumber,
          internalNote: formData.internalNote,
          encryptedDetails: encryptedData,
          encryptedKey: encryptedKey,
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
      className="flex-1 flex flex-col bg-gray-50 overflow-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-gray-200 p-6"
        style={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <TruckIcon style={{ color: '#11B0CD' }} className="w-7 h-7" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to create a secure vaccine shipment</p>
          </div>
        </div>
      </motion.div>

      {/* Form Container */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid rgba(229, 231, 235, 0.5)'
          }}
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl flex items-start gap-3"
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5'
              }}
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-800 font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Vaccine Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vaccine Type *
              </label>
              <input
                type="text"
                name="vaccine"
                value={formData.vaccine}
                onChange={handleChange}
                required
                placeholder="e.g., Pfizer COVID-19, Moderna, etc."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  focusRingColor: '#11B0CD'
                }}
                onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </motion.div>

            {/* Origin & Destination Row */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Origin *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  placeholder="e.g., maj"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </motion.div>
            </div>

            {/* Estimated Arrival & Batch Number Row */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Arrival *
                </label>
                <input
                  type="datetime-local"
                  name="estimatedArrival"
                  value={formData.estimatedArrival}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., BATCH-2026-01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none transition-all"
                  onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </motion.div>
            </div>

            {/* Internal Note */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Internal Note <span className="text-gray-400 font-normal"></span>
              </label>
              <textarea
                name="internalNote"
                value={formData.internalNote}
                onChange={handleChange}
                placeholder="Special handling instructions, temperature requirements, or detailed notes..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none resize-vertical transition-all"
                onFocus={(e) => e.target.style.borderColor = '#11B0CD'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 pt-4"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all shadow-md"
                style={{
                  backgroundColor: loading ? '#9CA3AF' : '#11B0CD',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Shipment...
                  </span>
                ) : (
                  '✓ Create Shipment'
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate('/dashboard/shipments')}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateShipmentPage;
