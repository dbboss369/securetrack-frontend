import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const TelemetryChart = ({ data }) => {
  // Format data for chart
  const chartData = data.map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    temperature: reading.temperature,
    shipmentId: reading.shipmentId
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Temperature Trends</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          {/* X-Axis: Time */}
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            interval="preserveStartEnd"
          />
          
          {/* Y-Axis: Temperature (0-10°C) */}
          <YAxis 
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
          />
          
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="line"
          />
          
          {/* Safe temperature zone reference lines */}
          <ReferenceLine 
            y={2} 
            stroke="#3b82f6" 
            strokeDasharray="5 5" 
            label={{ value: 'Min Safe (2°C)', position: 'left', fill: '#3b82f6', fontSize: 11 }}
          />
          <ReferenceLine 
            y={8} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            label={{ value: 'Max Safe (8°C)', position: 'left', fill: '#ef4444', fontSize: 11 }}
          />
          
          {/* Temperature line */}
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Temperature (°C)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Latest reading display */}
      <div className="mt-4 bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Latest Temperature</p>
        <p className="text-3xl font-bold text-purple-600">
          {chartData[chartData.length - 1]?.temperature?.toFixed(1) || 'N/A'}°C
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Shipment: {chartData[chartData.length - 1]?.shipmentId || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default TelemetryChart;
