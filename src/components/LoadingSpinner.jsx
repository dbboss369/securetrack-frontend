import React from 'react';


const LoadingSpinner = () => {
  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      <div
        style={{
          position: 'fixed',           // NEW: Fixed positioning
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          backgroundColor: 'var(--bg)', // NEW: Background color
          zIndex: 9999                   // NEW: On top of everything
        }}
      >
        {/* Three Bouncing Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0891B2',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.32s'
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0891B2',
              animation: 'bounce 1.4s infinite ease-in-out both',
              animationDelay: '-0.16s'
            }}
          />
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#0891B2',
              animation: 'bounce 1.4s infinite ease-in-out both'
            }}
          />
        </div>


        {/* Loading Text */}
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}
        >
          Loading...
        </p>
      </div>
    </>
  );
};


export default LoadingSpinner;
