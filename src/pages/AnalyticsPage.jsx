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


      // Fetch telemetry
      const telRes = await fetch(`${API_URL}/api/telemetry/all`);
      if (!telRes.ok) throw new Error('Failed to fetch telemetry');
      const allTelemetryData = await telRes.json();


      // Fetch all shipments
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


      // Calculate violations
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
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <ExclamationTriangleIcon style={{ width: '64px', height: '64px', color: '#EF4444', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>Failed to Load Analytics</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>Unable to load analytics data.</p>
          <button onClick={() => { setLoading(true); setError(false); fetchAnalytics(); }}
            style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (analytics.totalShipments === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
        <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChartBarIcon style={{ width: '28px', height: '28px', color: 'var(--primary)' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Analytics & Reports</h1>
              <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Temperature violation reports and shipment analytics</p>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card)' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <InboxIcon style={{ width: '64px', height: '64px', color: '#9CA3AF', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>No Shipment Data Yet</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>Create your first shipment to see analytics here.</p>
            <button onClick={() => window.location.href = '/dashboard/shipments'}
              style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Go to Shipments
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChartBarIcon style={{ width: '28px', height: '28px', color: 'var(--primary)' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Analytics & Reports</h1>
              <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Temperature violation reports and shipment analytics</p>
            </div>
          </div>
          <button onClick={exportToCSV} disabled={analytics.shipmentsWithViolations.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              backgroundColor: analytics.shipmentsWithViolations.length === 0 ? '#E5E7EB' : 'var(--primary)',
              color: analytics.shipmentsWithViolations.length === 0 ? '#9CA3AF' : '#FFFFFF',
              border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
              cursor: analytics.shipmentsWithViolations.length === 0 ? 'not-allowed' : 'pointer'
            }}>
            <ArrowDownTrayIcon style={{ width: '18px', height: '18px' }} />
            Export CSV
          </button>
        </div>
      </div>


      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ padding: '20px', backgroundColor: '#DBEAFE', borderRadius: '12px', border: '1px solid #93C5FD' }}>
            <p style={{ fontSize: '13px', color: '#1E40AF', margin: '0 0 8px 0' }}>Total Shipments</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1E3A8A', margin: 0 }}>{analytics.totalShipments}</p>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FCD34D' }}>
            <p style={{ fontSize: '13px', color: '#92400E', margin: '0 0 8px 0' }}>Active</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#78350F', margin: 0 }}>{analytics.activeShipments}</p>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ padding: '20px', backgroundColor: '#D1FAE5', borderRadius: '12px', border: '1px solid #86EFAC' }}>
            <p style={{ fontSize: '13px', color: '#065F46', margin: '0 0 8px 0' }}>Completed</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#047857', margin: 0 }}>{analytics.completedShipments}</p>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ padding: '20px', backgroundColor: '#FEE2E2', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
            <p style={{ fontSize: '13px', color: '#991B1B', margin: '0 0 8px 0' }}>Total Violations</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#7F1D1D', margin: 0 }}>{analytics.totalViolations}</p>
          </motion.div>


          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{
              padding: '20px', borderRadius: '12px',
              backgroundColor: analytics.violationRate > 10 ? '#FEE2E2' : '#D1FAE5',
              border: `1px solid ${analytics.violationRate > 10 ? '#FCA5A5' : '#86EFAC'}`
            }}>
            <p style={{ fontSize: '13px', color: analytics.violationRate > 10 ? '#991B1B' : '#065F46', margin: '0 0 8px 0' }}>Violation Rate</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: analytics.violationRate > 10 ? '#7F1D1D' : '#047857', margin: 0 }}>{analytics.violationRate}%</p>
          </motion.div>


        </div>
      </div>


      <div style={{ flex: 1, backgroundColor: 'var(--card)', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>
            Shipments with Temperature Violations
          </h2>
        </div>


        <div style={{ flex: 1, overflow: 'auto' }}>
          {analytics.shipmentsWithViolations.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <CheckCircleIcon style={{ width: '64px', height: '64px', color: '#10B981', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>No Violations Found</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>All shipments are maintaining proper temperature ranges (2-8°C)</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Shipment ID</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Route</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Violations</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase' }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {analytics.shipmentsWithViolations.map((shipment, index) => (
                  <motion.tr key={shipment.shipmentId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--primary)' }}>{shipment.shipmentId}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--muted)', fontSize: '14px' }}>{shipment.origin} → {shipment.destination}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                        {shipment.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationTriangleIcon style={{ width: '18px', height: '18px', color: '#DC2626' }} />
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#DC2626' }}>
                          {shipment.violationCount} reading{shipment.violationCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                        backgroundColor: shipment.violationCount > 5 ? '#FEE2E2' : '#FEF3C7',
                        color: shipment.violationCount > 5 ? '#991B1B' : '#92400E'
                      }}>
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
