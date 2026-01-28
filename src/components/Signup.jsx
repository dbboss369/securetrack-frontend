import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { generateKeyPair } from '../utils/encryption';
import { ethers } from 'ethers';
import { API_URL } from '../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    role: 'hospital',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Signup attempt:', formData.email);

    try {
      let publicKeyPem = null;
      let walletAddress = null;
      let privateKeyPem = null;

      if (formData.role === 'hospital') {
        const keypair = generateKeyPair();
        publicKeyPem = keypair.publicKey;
        privateKeyPem = keypair.privateKey;

        console.log('🔑 Keys generated!');
        console.log('   Public key length:', publicKeyPem?.length);
        console.log('   Private key length:', privateKeyPem?.length);

        if (!window.ethereum) {
          throw new Error('MetaMask is required for hospital registration');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        walletAddress = await signer.getAddress();

        console.log('🏥 Hospital wallet:', walletAddress);
      }

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publicKey: publicKeyPem,
          privateKey: privateKeyPem,  // ✅ FIXED: Send to backend!
          walletAddress: walletAddress,
        }),
      });

      const data = await res.json();
      console.log('📦 Backend Response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // ✅ Store private key in localStorage (backup)
      if (formData.role === 'hospital' && privateKeyPem) {
        localStorage.setItem('hospitalPrivateKey', privateKeyPem);
        console.log('🔑 Private key stored in localStorage');
      }

      // ✅ Store complete user object with token
      const userWithToken = {
        ...data.user,
        token: data.token,
      };

      localStorage.setItem('user', JSON.stringify(userWithToken));
      
      console.log('✅ User saved:', {
        hasToken: !!userWithToken.token,
        hasPrivateKey: !!userWithToken.privateKey,
        role: userWithToken.role
      });
      
      console.log('✅ Navigating to dashboard...');

      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--primary)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            ST
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#111',
              margin: 0,
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '8px',
            }}
          >
            Join SecureTrack today
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px',
              border: '1px solid #fca5a5',
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              Organization
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              placeholder="Your Hospital/Company"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white',
              }}
            >
              <option value="hospital">Hospital</option>
              <option value="distributor">Distributor</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="admin">Admin</option>
            </select>

            {formData.role === 'hospital' && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#2563eb',
                  marginTop: '6px',
                }}
              >
                ✅ MetaMask will be used to link your wallet. Your encryption keys will be securely stored.
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#333',
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '14px',
            color: '#666',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
