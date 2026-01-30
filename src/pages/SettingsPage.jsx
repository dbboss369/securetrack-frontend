import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  ShieldCheckIcon,
  LinkIcon,
  Cog6ToothIcon
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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
          
          if (data.user) {
            const updatedUser = {
              ...userData,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              organization: data.user.organization,
              profilePhoto: data.user.profilePhoto || null
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            if (data.user.profilePhoto) {
              console.log('✅ Profile photo loaded from database!');
              window.dispatchEvent(new Event('storage'));
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
  }, []);

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
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Cog6ToothIcon style={{ color: '#11B0CD' }} className="w-7 h-7" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 p-6">
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(17, 176, 205, 0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#11B0CD' : '#6B7280',
                  fontWeight: activeTab === tab.id ? '600' : '500'
                }}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 bg-white">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && user && (
              <div key="profile" className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Profile Picture</label>
                  <ProfilePhoto />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user.name || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <input
                      type="text"
                      value={user.role?.toUpperCase() || 'USER'}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-700"
                    />
                  </div>
                  {user.organization && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Organization</label>
                      <input
                        type="text"
                        value={user.organization}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blockchain Tab */}
            {activeTab === 'blockchain' && user && (
              <div key="blockchain" className="max-w-3xl space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Blockchain Configuration</h2>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Network Information</h3>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">Network:</p>
                      <p className="font-semibold text-gray-900">Polygon Amoy</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Chain ID:</p>
                      <p className="font-semibold text-gray-900">80002</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Status:</p>
                      <p className="font-semibold text-green-600">✅ Connected</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-600 mb-2">RPC URL:</p>
                    <p className="text-xs font-mono bg-white px-3 py-2 rounded-lg border border-blue-200 text-gray-700 break-all">
                      https://rpc-amoy.polygon.technology
                    </p>
                  </div>
                </div>

                {user.walletAddress && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Wallet</h3>
                    
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Wallet Address</p>
                      <p className="text-xs font-mono bg-white px-3 py-2 rounded-lg border border-green-200 text-gray-700 break-all">
                        {user.walletAddress}
                      </p>
                    </div>

                    <p className="text-xs text-green-700 font-medium mt-3">
                      ✅ Connected to Polygon Amoy Testnet
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Smart Contract</h3>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Contract Address</p>
                    <p className="text-xs font-mono bg-white px-3 py-2 rounded-lg border border-yellow-200 text-gray-700 break-all">
                      0x0fDab3007a2aC7A7d8eC2682699e7c3eDD042B07
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && user && (
              <div key="security" className="max-w-3xl space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Encryption</h2>
                
                {user.role === 'hospital' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Encryption Keys (RSA)</h3>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                        <h4 className="text-sm font-bold text-gray-900">Public Key</h4>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">
                        Used by manufacturers to encrypt shipment data for you.
                      </p>
                      
                      <div className="bg-white p-3 rounded-lg border border-green-200 text-xs font-mono text-gray-700 max-h-24 overflow-auto break-all">
                        {publicKey ? publicKey.substring(0, 100) + '...' : 'No public key found'}
                      </div>

                      <p className="text-xs text-green-700 font-semibold mt-3">
                        ✅ Status: Active
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheckIcon className="w-5 h-5 text-red-600" />
                        <h4 className="text-sm font-bold text-gray-900">Private Key</h4>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">
                        Stored securely in your browser. Used to decrypt shipment details.
                      </p>

                      <p className="text-xs font-semibold mb-3" style={{ color: hasPrivateKey ? '#10B981' : '#EF4444' }}>
                        {hasPrivateKey ? '✅ Private key stored in browser' : '❌ Private key not found'}
                      </p>

                      {hasPrivateKey && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDownloadKey}
                          className="px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md"
                          style={{ backgroundColor: '#11B0CD' }}
                        >
                          Download Backup Key
                        </motion.button>
                      )}

                      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-800 font-medium">
                          ⚠️ Never share your private key with anyone!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Password Management</h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Update your password to keep your account secure.
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPasswordModal(true)}
                    className="px-6 py-3 text-white rounded-xl text-sm font-semibold shadow-md"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Change Password
                  </motion.button>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-300 shadow-sm">
                  <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">Delete Account</h4>
                  <p className="text-xs text-gray-700 mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (window.confirm('⚠️ WARNING: Are you ABSOLUTELY SURE you want to delete your account?\n\nThis action CANNOT be undone!\n\nAll your data will be permanently deleted.')) {
                        if (window.confirm('Final confirmation: Type your email mentally and click OK to proceed with account deletion.')) {
                          handleDeleteAccount();
                        }
                      }
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-red-700 transition-colors"
                  >
                    Delete My Account
                  </motion.button>
                  
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-800 font-medium">
                      ⚠️ This will permanently delete your account and all associated data!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePassword onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
