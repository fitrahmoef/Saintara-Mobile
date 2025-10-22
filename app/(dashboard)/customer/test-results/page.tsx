'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TestResult {
  id: string;
  characterType: string;
  score: number;
  completedAt: string;
  testParticipant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    testOrder: {
      id: string;
      orderNumber: string;
      type: string;
      packageType: string;
    };
  };
  certificate?: {
    id: string;
    certificateNumber: string;
    issuedAt: string;
  };
}

export default function TestResultsPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [characterTypeFilter, setCharacterTypeFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchTestResults();
  }, [currentPage, characterTypeFilter]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (characterTypeFilter) {
        params.append('characterType', characterTypeFilter);
      }

      const response = await fetch(`/api/test-results?${params}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch test results');
      }

      const data = await response.json();
      setTestResults(data.testResults);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setError('Failed to load test results');
      setLoading(false);
    }
  };

  const getCharacterTypeColor = (characterType: string) => {
    const colors: Record<string, string> = {
      PEMIKIR_INTROVERT: 'bg-blue-100 text-blue-800',
      PEMIKIR_EXTROVERT: 'bg-sky-100 text-sky-800',
      PERENCANA_INTROVERT: 'bg-green-100 text-green-800',
      PERENCANA_EXTROVERT: 'bg-emerald-100 text-emerald-800',
      PELAKSANA_INTROVERT: 'bg-orange-100 text-orange-800',
      PELAKSANA_EXTROVERT: 'bg-amber-100 text-amber-800',
      PEKERJA_INTROVERT: 'bg-purple-100 text-purple-800',
      PEKERJA_EXTROVERT: 'bg-violet-100 text-violet-800',
      PENGAWAS: 'bg-red-100 text-red-800',
    };
    return colors[characterType] || 'bg-gray-100 text-gray-800';
  };

  const formatCharacterType = (characterType: string) => {
    return characterType.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test results...</p>
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
            onClick={() => fetchTestResults()}
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
          <h1 className="text-3xl font-bold text-gray-800">Test Results</h1>
          <p className="text-gray-600 mt-2">View and manage your test results</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-gray-700 font-medium">Filter by character type:</label>
            <select
              value={characterTypeFilter}
              onChange={(e) => {
                setCharacterTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PEMIKIR_INTROVERT">Pemikir Introvert</option>
              <option value="PEMIKIR_EXTROVERT">Pemikir Extrovert</option>
              <option value="PERENCANA_INTROVERT">Perencana Introvert</option>
              <option value="PERENCANA_EXTROVERT">Perencana Extrovert</option>
              <option value="PELAKSANA_INTROVERT">Pelaksana Introvert</option>
              <option value="PELAKSANA_EXTROVERT">Pelaksana Extrovert</option>
              <option value="PEKERJA_INTROVERT">Pekerja Introvert</option>
              <option value="PEKERJA_EXTROVERT">Pekerja Extrovert</option>
              <option value="PENGAWAS">Pengawas</option>
            </select>
          </div>
        </div>

        {/* Test Results List */}
        {testResults.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Test Results Found</h2>
            <p className="text-gray-600 mb-6">
              {characterTypeFilter ? 'No results match your filter criteria.' : 'You don\'t have any completed test results yet.'}
            </p>
            <button
              onClick={() => router.push('/customer/dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => router.push(`/customer/test-results/${result.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {result.testParticipant.name}
                    </h3>
                    <p className="text-sm text-gray-500">{result.testParticipant.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCharacterTypeColor(result.characterType)}`}>
                    {formatCharacterType(result.characterType)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold text-gray-800">
                      #{result.testParticipant.testOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold text-gray-800">
                      {result.testParticipant.testOrder.packageType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold text-gray-800">{result.score}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(result.completedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {result.certificate ? (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
                        <span>✓</span> Certificate Available
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement certificate download
                          alert('Certificate download coming soon!');
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Certificate not yet issued</span>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/customer/test-results/${result.id}`);
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-lg shadow">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
