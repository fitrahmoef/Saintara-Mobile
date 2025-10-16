'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    pendingPayments: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Welcome, {user?.fullName || 'Customer'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-gray-600 mb-2">Total Tests</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalTests}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-gray-600 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">{stats.completedTests}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-gray-600 mb-2">Pending Payment</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.pendingPayments}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition">
              Create Bulk Test
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition">
              View Participants
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
