import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateKeyPair } from '../utils/encryption';
import { ethers } from 'ethers';
import { API_URL } from '../config';
import Logo from '../assets/logo.svg';

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
  const [showPassword, setShowPassword] = useState(false);
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
          privateKey: privateKeyPem,
          walletAddress: walletAddress,
        }),
      });

      const data = await res.json();
      console.log('📦 Backend Response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      if (formData.role === 'hospital' && privateKeyPem) {
        localStorage.setItem('hospitalPrivateKey', privateKeyPem);
        console.log('🔑 Private key stored in localStorage');
      }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden px-4 py-8">
      {/* Animated Background Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        style={{ top: '-10%', left: '-10%' }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        style={{ bottom: '-10%', right: '-10%' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4"
            >
              <img 
                src={Logo} 
                alt="SecureTrack Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 text-sm"
            >
              Join SecureTrack today
            </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <span className="text-red-500 text-lg">⚠️</span>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm 
                         focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-300 bg-white/50"
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm 
                         focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-300 bg-white/50"
              />
            </motion.div>

            {/* Organization Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organization
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
                placeholder="Your Hospital/Company"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm 
                         focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-300 bg-white/50"
              />
            </motion.div>

            {/* Role Select */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm 
                         focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                         transition-all duration-300 bg-white/50"
              >
                <option value="hospital">Hospital</option>
                <option value="distributor">Distributor</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="admin">Admin</option>
              </motion.select>

              <AnimatePresence>
                {formData.role === 'hospital' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-blue-600 mt-2 flex items-center gap-1"
                  >
                    <span>✅</span>
                    MetaMask will be used to link your wallet. Your encryption keys will be securely stored.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl text-sm 
                           focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100
                           transition-all duration-300 bg-white/50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white text-base
                        shadow-lg transition-all duration-300 mt-2
                        ${loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
                        }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                  />
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-6 text-sm text-gray-600"
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all"
            >
              Sign in
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
