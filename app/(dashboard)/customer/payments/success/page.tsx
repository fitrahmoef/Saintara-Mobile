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

export default function PaymentSuccessPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-2xl w-full text-center">
        <div className="text-8xl mb-6 animate-bounce">✅</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment has been processed successfully
        </p>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : order ? (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-800">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-semibold text-green-600 text-xl">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/customer/test-orders/${orderId}`)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-bold text-lg"
          >
            View Order Details
          </button>
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
