import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const ProfilePhoto = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load photo on mount and listen for updates
  useEffect(() => {
    const loadPhoto = () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      
      if (userData?.profilePhoto) {
        console.log('📸 ProfilePhoto: Loading photo from localStorage');
        setPhotoURL(userData.profilePhoto);
      } else {
        console.log('⚠️ ProfilePhoto: No photo in localStorage');
        setPhotoURL('');
      }
    };

    // Load on mount
    loadPhoto();

    // ✅ Listen for storage updates (from Settings.jsx fetch)
    const handleStorageChange = () => {
      console.log('🔔 ProfilePhoto: Storage updated, reloading...');
      loadPhoto();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profilePhotoUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePhotoUpdated', handleStorageChange);
    };
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ Image size should be less than 2MB');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const photoData = reader.result;
      
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_URL}/api/auth/upload-photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          body: JSON.stringify({ photoData })
        });

        if (response.ok) {
          setPhotoURL(photoData);
          
          // Update localStorage
          userData.profilePhoto = photoData;
          localStorage.setItem('user', JSON.stringify(userData));
          
          // 🔔 Notify other components
          window.dispatchEvent(new Event('profilePhotoUpdated'));
          
          alert('✅ Profile photo updated successfully!');
        } else {
          const error = await response.json();
          alert('❌ Failed to upload photo: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('❌ Network error. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) {
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${API_URL}/api/auth/delete-photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (response.ok) {
        setPhotoURL('');
        
        // Update localStorage
        userData.profilePhoto = null;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 🔔 Notify other components
        window.dispatchEvent(new Event('profilePhotoUpdated'));
        
        alert('✅ Profile photo removed successfully!');
      } else {
        alert('❌ Failed to remove photo');
      }
    } catch (error) {
      console.error('Remove photo error:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          width: '128px', 
          height: '128px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          border: '4px solid #667eea',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          {photoURL ? (
            <img 
              src={photoURL} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontSize: '32px', 
              fontWeight: '600' 
            }}>
              {getInitials(user?.name)}
            </div>
          )}
        </div>

        {uploading && (
          <div style={{ 
            position: 'absolute', 
            inset: '0', 
            background: 'rgba(0,0,0,0.5)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg style={{ animation: 'spin 1s linear infinite', height: '32px', width: '32px' }} viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <label style={{ 
          padding: '10px 20px', 
          background: uploading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white', 
          borderRadius: '8px', 
          fontSize: '14px', 
          fontWeight: '600',
          cursor: uploading ? 'not-allowed' : 'pointer',
          border: 'none',
          boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.2s'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </label>

        {photoURL && !uploading && (
          <button
            onClick={handleRemovePhoto}
            style={{ 
              padding: '10px 20px', 
              background: '#ef4444', 
              color: 'white', 
              borderRadius: '8px', 
              fontSize: '14px', 
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            Remove
          </button>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
        Recommended: Square image, max 2MB
      </p>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ProfilePhoto;
