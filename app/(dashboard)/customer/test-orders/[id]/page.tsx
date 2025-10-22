'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PACKAGE_PRICING, PackageType, formatCurrency } from '@/lib/pricing';

interface TestParticipant {
  id: string;
  fullName: string;
  nickName?: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  studentNumber?: string;
  className?: string;
  testResult?: {
    id: string;
    characterType: string;
    score: number;
    completedAt: string;
    certificate?: {
      id: string;
      certificateNumber: string;
    };
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
}

interface TestOrder {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  packages: PackageType[];
  totalParticipants: number;
  pricePerPerson: number;
  totalAmount: number;
  scheduledDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  testParticipants: TestParticipant[];
  payment?: Payment;
}

export default function TestOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<TestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/test-orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          setError('Order not found');
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data.testOrder);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCanceling(true);
    try {
      const response = await fetch(`/api/test-orders/${orderId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel order');
      }

      alert('Order cancelled successfully');
      fetchOrderDetails(); // Refresh order data
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCanceling(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: 'bg-orange-100 text-orange-800 border-orange-200',
      PAID: 'bg-blue-100 text-blue-800 border-blue-200',
      PROCESSING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const canCancelOrder = order?.status === 'PENDING_PAYMENT' || order?.status === 'PAID';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/customer/test-orders')}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/customer/test-orders')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Order #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-2">
              Created on {new Date(order.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-wrap gap-4">
            {order.status === 'PENDING_PAYMENT' && (
              <button
                onClick={() => router.push(`/customer/payments/create?orderId=${order.id}`)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Proceed to Payment
              </button>
            )}
            {canCancelOrder && (
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {canceling ? 'Canceling...' : 'Cancel Order'}
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Print Order
            </button>
          </div>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Order Type</label>
                <p className="font-semibold text-gray-800">{order.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Total Participants</label>
                <p className="font-semibold text-gray-800">{order.totalParticipants} people</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Price per Person</label>
                <p className="font-semibold text-gray-800">{formatCurrency(order.pricePerPerson)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Total Amount</label>
                <p className="font-semibold text-blue-600 text-xl">{formatCurrency(order.totalAmount)}</p>
              </div>
              {order.scheduledDate && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Scheduled Date</label>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.scheduledDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600 block mb-1">Last Updated</label>
                <p className="font-semibold text-gray-800">
                  {new Date(order.updatedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm text-gray-600 block mb-2">Notes</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Package Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Selected Packages</h2>
            <div className="space-y-4">
              {order.packages.map((pkg) => {
                const packageInfo = PACKAGE_PRICING[pkg];
                return (
                  <div key={pkg} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{packageInfo.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{packageInfo.description}</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(packageInfo.price)}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(order.pricePerPerson)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {order.payment && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Payment Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  order.payment.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : order.payment.status === 'PENDING'
                    ? 'bg-orange-100 text-orange-800'
                    : order.payment.status === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.payment.status}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Amount</label>
                <p className="font-semibold text-gray-800">{formatCurrency(order.payment.amount)}</p>
              </div>
              {order.payment.paymentMethod && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Payment Method</label>
                  <p className="font-semibold text-gray-800">{order.payment.paymentMethod}</p>
                </div>
              )}
              {order.payment.paidAt && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Paid At</label>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.payment.paidAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Participants List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Participants ({order.testParticipants.length})</h2>
            <div className="text-sm text-gray-600">
              {order.testParticipants.filter(p => p.testResult).length} completed
            </div>
          </div>

          {order.testParticipants.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No participants added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date of Birth</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.testParticipants.map((participant, index) => (
                    <tr key={participant.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{participant.fullName}</p>
                          {participant.nickName && (
                            <p className="text-sm text-gray-500">({participant.nickName})</p>
                          )}
                          {participant.studentNumber && (
                            <p className="text-xs text-gray-400">ID: {participant.studentNumber}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{participant.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{participant.gender}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(participant.dateOfBirth).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4">
                        {participant.testResult ? (
                          <div>
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                              Completed
                            </span>
                            {participant.testResult.certificate && (
                              <span className="inline-block ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                                Certified
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {participant.testResult ? (
                          <button
                            onClick={() => router.push(`/customer/test-results/${participant.testResult!.id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                          >
                            View Result
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Completion Summary */}
        {order.status === 'COMPLETED' && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Order Completed!</h3>
                <p className="text-gray-600 mt-1">
                  All tests have been completed. You can now view and download the results for each participant.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
