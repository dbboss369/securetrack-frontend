import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  UsersIcon 
} from '@heroicons/react/24/outline';
import { getCustomers } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    { 
      title: `Total ${user.role === 'admin' ? 'Users' : 'Partners'}`, 
      value: customers.length, 
      color: '#11B0CD' 
    },
    { 
      title: 'Active Partners', 
      value: customers.length, 
      color: '#10B981' 
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <UsersIcon style={{ color: '#11B0CD' }} className="w-7 h-7" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'admin' ? 'All Users' : 'My Partners'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {user.role === 'admin' && 'Manage all system users'}
              {user.role === 'manufacturer' && 'Hospitals you ship vaccines to'}
              {user.role === 'hospital' && 'Manufacturers you receive vaccines from'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">
                {stat.title}
              </p>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              {user.role === 'admin' ? 'User List' : 'Partner List'}
            </h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 w-64 border border-gray-300 rounded-xl text-sm focus:outline-none transition-all"
                onFocus={(e) => {
                  e.target.style.borderColor = '#11B0CD';
                  e.target.style.boxShadow = '0 0 0 3px rgba(17, 176, 205, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-16 text-center">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600 text-sm">
                {customers.length === 0 
                  ? 'No partners found. Start shipping to see them here!' 
                  : 'No results match your search query'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <motion.tr
                    key={customer._id || customer.id}
                    whileHover={{ backgroundColor: '#F9FAFB', x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {customer.profilePhoto ? (
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            src={customer.profilePhoto}
                            alt={customer.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                          />
                        ) : (
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
                            style={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                          >
                            {customer.name?.charAt(0).toUpperCase() || '?'}
                          </motion.div>
                        )}
                        <span className="font-semibold text-gray-900">{customer.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                        style={{
                          backgroundColor: customer.role === 'admin' ? '#FEE2E2' : customer.role === 'manufacturer' ? '#DBEAFE' : '#D1FAE5',
                          color: customer.role === 'admin' ? '#991B1B' : customer.role === 'manufacturer' ? '#1E40AF' : '#065F46'
                        }}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {customer.organization || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
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

export default CustomersPage;
