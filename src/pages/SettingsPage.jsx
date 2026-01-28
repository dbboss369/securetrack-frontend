import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  ShieldCheckIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import ChangePassword from '../components/ChangePassword';
import ProfilePhoto from '../components/ProfilePhoto';
import { API_URL } from '../config';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [publicKey, setPublicKey] = useState('');
  const [hasPrivateKey, setHasPrivateKey] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    const hospitalPublicKey = localStorage.getItem('hospitalPublicKey');
    const hospitalPrivateKey = localStorage.getItem('hospitalPrivateKey');
    
    if (hospitalPublicKey) {
      setPublicKey(hospitalPublicKey);
    }
    if (hospitalPrivateKey) {
      setHasPrivateKey(true);
    }
  }, []);

  // ✅ FIXED: Fetch fresh user data from database (including profile photo)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Get token from user object
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;
        
        if (!token) {
          console.log('⚠️ No token found in localStorage');
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('📸 Fresh user data from DB:', data.user);
          
          // ✅ Update localStorage with fresh data including profilePhoto
          if (data.user) {
            const updatedUser = {
              ...userData, // Keep existing data (including token!)
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              organization: data.user.organization,
              profilePhoto: data.user.profilePhoto || null
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            // Trigger ProfilePhoto component to reload
            if (data.user.profilePhoto) {
              console.log('✅ Profile photo loaded from database!');
              window.dispatchEvent(new Event('storage')); // Notify other components
            }
          }
        } else {
          console.error('❌ Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Run once when component mounts

  const handleDownloadKey = () => {
    const privateKey = localStorage.getItem('hospitalPrivateKey');
    if (privateKey) {
      const blob = new Blob([privateKey], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.name}_private_key_backup.pem`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('User not found');
        return;
      }

      const userData = JSON.parse(userStr);
      const response = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (response.ok) {
        alert('✅ Account deleted successfully. You will be logged out now.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('hospitalPrivateKey');
        localStorage.removeItem('profilePhoto');
        window.location.href = '/login';
      } else {
        const data = await response.json();
        alert('❌ Failed to delete account: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'blockchain', name: 'Blockchain', icon: LinkIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Settings</h1>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Manage your account settings and preferences</p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        <div style={{ width: '280px', backgroundColor: 'var(--card)', borderRight: '1px solid var(--border)', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: activeTab === tab.id ? '#E6F8FC' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <tab.icon style={{ width: '20px', height: '20px' }} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          
          {activeTab === 'profile' && user && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '24px' }}>Profile Information</h2>
              
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '16px' }}>Profile Picture</label>
                <ProfilePhoto />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Full Name</label>
                  <input
                    type="text"
                    value={user.name || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Email Address</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Role</label>
                  <input
                    type="text"
                    value={user.role?.toUpperCase() || 'USER'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg)'
                    }}
                  />
                </div>
                {user.organization && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>Organization</label>
                    <input
                      type="text"
                      value={user.organization}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'var(--bg)'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'blockchain' && user && (
            <div style={{ maxWidth: '700px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '24px' }}>Blockchain Configuration</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ padding: '20px', backgroundColor: '#F0F9FF', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Network Information</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', fontSize: '14px' }}>
                    <div style={{ color: 'var(--muted)' }}>Network:</div>
                    <div style={{ fontWeight: '500', color: 'var(--text)' }}>Polygon Amoy Testnet</div>
                    
                    <div style={{ color: 'var(--muted)' }}>Chain ID:</div>
                    <div style={{ fontWeight: '500', color: 'var(--text)' }}>80002</div>
                    
                    <div style={{ color: 'var(--muted)' }}>RPC URL:</div>
                    <div style={{ fontWeight: '400', color: 'var(--text)', fontSize: '12px', wordBreak: 'break-all' }}>
                      https://rpc-amoy.polygon.technology
                    </div>
                  </div>
                </div>

                {user.walletAddress && (
                  <div style={{ padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Your Wallet</h3>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Wallet Address</p>
                      <p style={{ 
                        fontSize: '13px', 
                        fontFamily: 'monospace', 
                        color: 'var(--text)', 
                        backgroundColor: '#FFFFFF',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #D1FAE5',
                        wordBreak: 'break-all',
                        margin: 0
                      }}>
                        {user.walletAddress}
                      </p>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                      ✅ Connected to Polygon Amoy Testnet
                    </p>
                  </div>
                )}

                <div style={{ padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Smart Contract</h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>Contract Address</p>
                    <p style={{ 
                      fontSize: '13px', 
                      fontFamily: 'monospace', 
                      color: 'var(--text)', 
                      backgroundColor: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #FDE68A',
                      wordBreak: 'break-all',
                      margin: 0
                    }}>
                      0x0fDab3007a2aC7A7d8eC2682699e7c3eDD042B07
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && user && (
            <div style={{ maxWidth: '700px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '24px' }}>Security & Encryption</h2>
              
              {user.role === 'hospital' && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Encryption Keys (RSA)</h3>
                  
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#F0FDF4', 
                    borderRadius: '12px', 
                    border: '1px solid #BBF7D0',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <ShieldCheckIcon style={{ width: '20px', height: '20px', color: '#10B981' }} />
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Public Key</h4>
                    </div>
                    
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                      Used by manufacturers to encrypt shipment data for you.
                    </p>
                    
                    <div style={{ 
                      backgroundColor: '#FFFFFF',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: 'var(--text)',
                      maxHeight: '100px',
                      overflow: 'auto',
                      wordBreak: 'break-all'
                    }}>
                      {publicKey ? publicKey.substring(0, 100) + '...' : 'No public key found'}
                    </div>

                    <p style={{ fontSize: '12px', color: '#10B981', marginTop: '8px', fontWeight: '500' }}>
                      ✅ Status: Active
                    </p>
                  </div>

                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#FEF2F2', 
                    borderRadius: '12px', 
                    border: '1px solid #FECACA'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <ShieldCheckIcon style={{ width: '20px', height: '20px', color: '#EF4444' }} />
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Private Key</h4>
                    </div>
                    
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                      Stored securely in your browser. Used to decrypt shipment details.
                    </p>

                    <p style={{ fontSize: '12px', color: hasPrivateKey ? '#10B981' : '#EF4444', fontWeight: '500', marginBottom: '12px' }}>
                      {hasPrivateKey ? '✅ Private key stored in browser' : '❌ Private key not found'}
                    </p>

                    {hasPrivateKey && (
                      <button
                        onClick={handleDownloadKey}
                        style={{
                          padding: '10px 16px',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Download Backup Key
                      </button>
                    )}

                    <div style={{ 
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#FFF7ED',
                      borderRadius: '6px',
                      border: '1px solid #FED7AA'
                    }}>
                      <p style={{ fontSize: '12px', color: '#C2410C', fontWeight: '500', margin: 0 }}>
                        ⚠️ Never share your private key with anyone!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Password Management</h3>
                
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#F9FAFB', 
                  borderRadius: '12px', 
                  border: '1px solid #E5E7EB'
                }}>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                    Update your password to keep your account secure.
                  </p>
                  
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Danger Zone</h3>
                
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#fef2f2', 
                  borderRadius: '12px', 
                  border: '2px solid #fca5a5'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
                    Delete Account
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('⚠️ WARNING: Are you ABSOLUTELY SURE you want to delete your account?\n\nThis action CANNOT be undone!\n\nAll your data will be permanently deleted.')) {
                        if (window.confirm('Final confirmation: Type your email mentally and click OK to proceed with account deletion.')) {
                          handleDeleteAccount();
                        }
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(220, 38, 38, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#b91c1c';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.3)';
                    }}
                  >
                    Delete My Account
                  </button>
                  
                  <div style={{ 
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: '#fff7ed',
                    borderRadius: '6px',
                    border: '1px solid #fed7aa'
                  }}>
                    <p style={{ fontSize: '12px', color: '#c2410c', fontWeight: '500', margin: 0 }}>
                      ⚠️ This will permanently delete your account and all associated data!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePassword onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default SettingsPage;
