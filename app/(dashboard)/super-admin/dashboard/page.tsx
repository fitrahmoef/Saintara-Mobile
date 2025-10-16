'use client';

import { useEffect, useState } from 'react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstansi: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Super Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <h3 className="text-gray-600 mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <h3 className="text-gray-600 mb-2">Total Instansi</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.totalInstansi}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <h3 className="text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold text-green-600">Rp {stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <h3 className="text-gray-600 mb-2">Pending Orders</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition">
              Manage Users
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition">
              Manage Instansi
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-xl transition">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
