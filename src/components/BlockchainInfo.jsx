import React from 'react';

const BlockchainInfo = ({ shipmentId, blockchainTxHash }) => {
  const contractAddress = '0x0fDab3D07a2aC7A7dBeC2682699e7c3eDD042B07';
  const polygonscanContractUrl = `https://amoy.polygonscan.com/address/${contractAddress}`;
  const polygonscanTxUrl = blockchainTxHash 
    ? `https://amoy.polygonscan.com/tx/${blockchainTxHash}` 
    : null;

  return (
    <div style={{ 
      padding: '24px', 
      borderBottom: '1px solid var(--border)',
      backgroundColor: '#F0F9FF'
    }}>
      <h3 style={{ 
        fontSize: '14px', 
        fontWeight: '500', 
        color: 'var(--text)', 
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        Blockchain Verification
      </h3>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '16px', 
        borderRadius: '8px',
        border: '1px solid #BFDBFE'
      }}>
        {/* Transaction Hash (if available) */}
        {blockchainTxHash && (
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
              Transaction Hash
            </p>
            <p style={{ 
              fontSize: '12px', 
              fontFamily: 'monospace', 
              color: '#1E40AF',
              wordBreak: 'break-all',
              backgroundColor: '#EFF6FF',
              padding: '8px',
              borderRadius: '4px'
            }}>
              {blockchainTxHash}
            </p>
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
            Contract Address
          </p>
          <p style={{ 
            fontSize: '13px', 
            fontFamily: 'monospace', 
            color: '#1E40AF',
            wordBreak: 'break-all'
          }}>
            {contractAddress}
          </p>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>
            Network
          </p>
          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
            Polygon Amoy Testnet
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
            Blockchain Features
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="#10B981" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                Immutable shipment data
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="#10B981" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                Temperature violations logged
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="#10B981" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                Public verification available
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* View Transaction Button (if txHash exists) */}
          {polygonscanTxUrl && (
            <a
              href={polygonscanTxUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#3B82F6',
                color: 'white',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
              View Transaction on Polygonscan
            </a>
          )}

          {/* View Contract Button */}
          <a
            href={polygonscanContractUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: polygonscanTxUrl ? 'white' : '#3B82F6',
              color: polygonscanTxUrl ? '#3B82F6' : 'white',
              border: polygonscanTxUrl ? '1px solid #3B82F6' : 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (polygonscanTxUrl) {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
              } else {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }
            }}
            onMouseLeave={(e) => {
              if (polygonscanTxUrl) {
                e.currentTarget.style.backgroundColor = 'white';
              } else {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
            </svg>
            View Smart Contract
          </a>
        </div>

        {/* Info Note */}
        <div style={{
          marginTop: '12px',
          padding: '10px',
          backgroundColor: '#DBEAFE',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#1E40AF',
          lineHeight: '1.4'
        }}>
          💡 <strong>Public Verification:</strong> Anyone can verify this shipment's authenticity on the blockchain explorer.
        </div>
      </div>
    </div>
  );
};

export default BlockchainInfo;
