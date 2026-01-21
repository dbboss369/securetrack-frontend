// Base URL for backend API
const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token || ''}`
  };
};

// Function to get all shipments from backend (with role-based filtering)
export const getShipments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching shipments:', error);
    throw error;
  }
};

// Function to get stats (role-based)
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Function to get single shipment by ID
export const getShipmentById = async (shipmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch shipment');
    return await response.json();
  } catch (error) {
    console.error('Error fetching shipment:', error);
    throw error;
  }
};

// Function to create new shipment
export const createShipment = async (shipmentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(shipmentData)
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    return await response.json();
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
};

// Function to get telemetry data for a shipment
export const getTelemetry = async (shipmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/telemetry`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch telemetry');
    return await response.json();
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    throw error;
  }
};

// Function to log sensor data (from Pi or simulator)
export const logData = async (sensorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/telemetry`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sensorData)
    });
    if (!response.ok) throw new Error('Failed to log data');
    return await response.json();
  } catch (error) {
    console.error('Error logging data:', error);
    throw error;
  }
};

// Function to get customers (for CustomersPage)
export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return []; // Return empty array on error
  }
};
