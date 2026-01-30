import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowDownTrayIcon,
  InboxIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_URL } from '../config';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    totalShipments: 0,
    activeShipments: 0,
    completedShipments: 0,
    totalViolations: 0,
    violationRate: 0,
    shipmentsWithViolations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setError(null);

      const telRes = await fetch(`${API_URL}/api/telemetry/all`);
      if (!telRes.ok) throw new Error('Failed to fetch telemetry');
      const allTelemetryData = await telRes.json();

      const shipRes = await fetch(`${API_URL}/api/shipments/all`);
      if (!shipRes.ok) throw new Error('Failed to fetch shipments');
      const allShipments = await shipRes.json();

      if (allShipments.length === 0) {
        setAnalytics({
          totalShipments: 0,
          activeShipments: 0,
          completedShipments: 0,
          totalViolations: 0,
          violationRate: 0,
          shipmentsWithViolations: []
        });
        setLoading(false);
        return;
      }

      const violationMap = {};
      const violationDetails = {};

      allTelemetryData.forEach(reading => {
        if (reading.temperature < 2 || reading.temperature > 8) {
          if (!violationMap[reading.shipmentId]) {
            violationMap[reading.shipmentId] = 0;
            violationDetails[reading.shipmentId] = [];
          }
          violationMap[reading.shipmentId]++;
          violationDetails[reading.shipmentId].push(reading);
        }
      });

      const shipmentsWithViolations = allShipments
        .filter(s => violationMap[s.shipmentId])
        .map(s => ({
          ...s,
          violationCount: violationMap[s.shipmentId],
          violations: violationDetails[s.shipmentId]
        }))
        .sort((a, b) => b.violationCount - a.violationCount);

      const activeShipments = allShipments.filter(
        s => s.status === 'In Transit' || s.status === 'Pending'
      ).length;
      
      const completedShipments = allShipments.filter(
        s => s.status === 'Delivered'
      ).length;

      const totalViolations = Object.values(violationMap).reduce((sum, count) => sum + count, 0);
      const violationRate = allShipments.length > 0 
        ? ((shipmentsWithViolations.length / allShipments.length) * 100).toFixed(1)
        : 0;

      setAnalytics({
        totalShipments: allShipments.length,
        activeShipments,
        completedShipments,
        totalViolations,
        violationRate,
        shipmentsWithViolations
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (analytics.shipmentsWithViolations.length === 0) {
      alert('No violation data to export');
      return;
    }

    const headers = ['Shipment ID', 'Origin', 'Destination', 'Status', 'Violation Count', 'Timestamps'];
    const rows = analytics.shipmentsWithViolations.map(s => [
      s.shipmentId,
      s.origin,
      s.destination,
      s.status,
      s.violationCount,
      s.violations.map(v => new Date(v.timestamp).toLocaleString()).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `violation-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-gray-600 mb-4">Unable to load analytics data.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setLoading(true); setError(false); fetchAnalytics(); }}
            style={{ backgroundColor: '#11B0CD' }}
            className="px-5 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  if (analytics.totalShipments === 0) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <ChartBarIcon style={{ color: '#11B0CD' }} className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600 text-sm mt-1">Temperature violation reports and shipment analytics</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
            <InboxIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shipment Data Yet</h3>
            <p className="text-gray-600 text-sm mb-4">Create your first shipment to see analytics here.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/dashboard/shipments'}
              style={{ backgroundColor: '#11B0CD' }}
              className="px-5 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
            >
              Go to Shipments
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Shipments', value: analytics.totalShipments, bgColor: '#DBEAFE', borderColor: '#93C5FD', textColor: '#1E40AF', valueColor: '#1E3A8A' },
    { title: 'Active', value: analytics.activeShipments, bgColor: '#FEF3C7', borderColor: '#FCD34D', textColor: '#92400E', valueColor: '#78350F' },
    { title: 'Completed', value: analytics.completedShipments, bgColor: '#D1FAE5', borderColor: '#86EFAC', textColor: '#065F46', valueColor: '#047857' },
    { title: 'Total Violations', value: analytics.totalViolations, bgColor: '#FEE2E2', borderColor: '#FCA5A5', textColor: '#991B1B', valueColor: '#7F1D1D' },
    { 
      title: 'Violation Rate', 
      value: `${analytics.violationRate}%`, 
      bgColor: analytics.violationRate > 10 ? '#FEE2E2' : '#D1FAE5',
      borderColor: analytics.violationRate > 10 ? '#FCA5A5' : '#86EFAC',
      textColor: analytics.violationRate > 10 ? '#991B1B' : '#065F46',
      valueColor: analytics.violationRate > 10 ? '#7F1D1D' : '#047857'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChartBarIcon style={{ color: '#11B0CD' }} className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600 text-sm mt-1">Temperature violation reports and shipment analytics</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV} 
            disabled={analytics.shipmentsWithViolations.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all shadow-md"
            style={{
              backgroundColor: analytics.shipmentsWithViolations.length === 0 ? '#E5E7EB' : '#11B0CD',
              color: analytics.shipmentsWithViolations.length === 0 ? '#9CA3AF' : 'white',
              cursor: analytics.shipmentsWithViolations.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-xl cursor-pointer shadow-sm"
              style={{
                backgroundColor: stat.bgColor,
                border: `1px solid ${stat.borderColor}`
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: stat.textColor }}>
                {stat.title}
              </p>
              <p className="text-3xl font-bold" style={{ color: stat.valueColor }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Violations Table */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Shipments with Temperature Violations
          </h2>
        </div>

        <div className="flex-1 overflow-auto">
          {analytics.shipmentsWithViolations.length === 0 ? (
            <div className="p-16 text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Violations Found</h3>
              <p className="text-gray-600 text-sm">All shipments are maintaining proper temperature ranges (2-8°C)</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.shipmentsWithViolations.map((shipment) => (
                  <motion.tr 
                    key={shipment.shipmentId}
                    whileHover={{ backgroundColor: '#F9FAFB', x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold" style={{ color: '#11B0CD' }}>
                      {shipment.shipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {shipment.origin} → {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">
                          {shipment.violationCount} reading{shipment.violationCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        shipment.violationCount > 5 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.violationCount > 5 ? 'High' : 'Medium'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
