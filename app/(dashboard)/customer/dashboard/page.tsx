'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status: string;
  instansi?: {
    id: string;
    name: string;
    type: string;
  };
  _count: {
    testOrders: number;
    testResults: number;
  };
}

interface Statistics {
  totalTests: number;
  completedTests: number;
  pendingPayments: number;
  totalParticipants: number;
  activeOrders: number;
  recentResults: any[];
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Statistics>({
    totalTests: 0,
    completedTests: 0,
    pendingPayments: 0,
    totalParticipants: 0,
    activeOrders: 0,
    recentResults: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userResponse = await fetch('/api/users/me');
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }
      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch statistics
      const statsResponse = await fetch('/api/statistics/customer');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.statistics);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.fullName || 'Customer'}!
          </h1>
          <p className="text-gray-600 mt-2">{user?.email}</p>
          {user?.instansi && (
            <p className="text-gray-500 text-sm mt-1">
              Organization: {user.instansi.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide mb-2">Total Tests</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalTests}</p>
            <p className="text-gray-500 text-sm mt-2">All test orders</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600">{stats.completedTests}</p>
            <p className="text-gray-500 text-sm mt-2">Finished tests</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide mb-2">Pending Payment</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.pendingPayments}</p>
            <p className="text-gray-500 text-sm mt-2">Awaiting payment</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-gray-600 text-sm uppercase tracking-wide mb-2">Total Participants</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.totalParticipants}</p>
            <p className="text-gray-500 text-sm mt-2">Test takers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => router.push('/customer/test-orders/create')}
                className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-xl transition"
              >
                <span className="text-lg font-semibold">Create New Test Order</span>
                <p className="text-sm opacity-90 mt-1">Start a new personality test</p>
              </button>
              <button
                onClick={() => router.push('/customer/test-orders')}
                className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition"
              >
                <span className="text-lg font-semibold">View Test Orders</span>
                <p className="text-sm opacity-90 mt-1">Manage your test orders</p>
              </button>
              <button
                onClick={() => router.push('/customer/test-results')}
                className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-xl transition"
              >
                <span className="text-lg font-semibold">View Results</span>
                <p className="text-sm opacity-90 mt-1">See completed test results</p>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Recent Results</h2>
            {stats.recentResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No results yet</p>
                <p className="text-sm mt-2">Complete a test to see your results here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentResults.map((result: any) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push(`/customer/test-results/${result.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{result.participantName}</p>
                        <p className="text-sm text-gray-500">{result.participantEmail}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {result.characterType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Contact our support team for assistance with your tests or results.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
