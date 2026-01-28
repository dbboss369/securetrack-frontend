// Production-ready configuration
export const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://securetrack-backend-5xlv.onrender.com'
    : 'http://localhost:4000');

export const CONTRACT_ADDRESS = '0x0fDab3D07a2aC7A7dBeC2682699e7c3eDD042B07';
