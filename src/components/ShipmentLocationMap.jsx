import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons in React + Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ShipmentLocationMap = ({ telemetryData = [], shipment }) => {
  // Get latest telemetry with GPS coordinates
  const latestTelemetry = telemetryData && telemetryData.length > 0 
    ? telemetryData[telemetryData.length - 1] 
    : null;

  // Check if we have GPS coordinates
  if (!latestTelemetry || !latestTelemetry.latitude || !latestTelemetry.longitude) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: '1px dashed var(--border)'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
        <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
          No GPS data available for this shipment
        </div>
      </div>
    );
  }

  const currentLocation = [latestTelemetry.latitude, latestTelemetry.longitude];

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      borderRadius: '12px', 
      overflow: 'hidden',
      border: '1px solid var(--border)'
    }}>
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap Tiles - FREE! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current Location Marker */}
        <Marker position={currentLocation}>
          <Popup>
            <div style={{ padding: '8px', minWidth: '200px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#1e293b'
              }}>
                📦 Shipment Location
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <div><strong>ID:</strong> {shipment?.shipmentId || 'N/A'}</div>
                <div><strong>Status:</strong> {shipment?.status || 'N/A'}</div>
                <div><strong>Temperature:</strong> {latestTelemetry.temperature}°C</div>
                <div><strong>Humidity:</strong> {latestTelemetry.humidity}%</div>
                <div style={{ 
                  marginTop: '8px', 
                  paddingTop: '8px',
                  borderTop: '1px solid #e2e8f0',
                  color: '#64748b', 
                  fontSize: '12px' 
                }}>
                  📍 {latestTelemetry.latitude.toFixed(4)}, {latestTelemetry.longitude.toFixed(4)}
                  <br />
                  🕒 {new Date(latestTelemetry.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Circle around current location */}
        <CircleMarker
          center={currentLocation}
          radius={15}
          pathOptions={{
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.15,
            weight: 2
          }}
        />
      </MapContainer>
    </div>
  );
};

export default ShipmentLocationMap;
