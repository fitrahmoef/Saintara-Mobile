'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/pricing';

interface TestOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
}

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<TestOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/test-orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.testOrder);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-2xl w-full text-center">
        <div className="text-8xl mb-6">❌</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Failed</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't process your payment
        </p>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : order ? (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-800">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-red-600 text-xl">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-red-900 mb-2">Common Reasons for Payment Failure:</h3>
          <ul className="text-sm text-red-800 space-y-2 text-left">
            <li>• Insufficient balance in your account</li>
            <li>• Incorrect payment details entered</li>
            <li>• Card or account restrictions</li>
            <li>• Network connection issues</li>
            <li>• Transaction timeout</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/customer/payments/create?orderId=${orderId}`)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-bold text-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push(`/customer/test-orders/${orderId}`)}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            View Order Details
          </button>
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="w-full py-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at support@saintara.com
          </p>
        </div>
      </div>
    </div>
  );
}
