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

export default function PaymentPendingPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-12 shadow-2xl max-w-2xl w-full text-center">
        <div className="text-8xl mb-6">⏳</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Pending</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your payment is being processed
        </p>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
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
                <p className="font-semibold text-orange-600 text-xl">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-yellow-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-yellow-800 space-y-2 text-left">
            <li>• Complete your payment using the chosen payment method</li>
            <li>• Payment confirmation may take a few minutes to several hours</li>
            <li>• You will receive an email once payment is confirmed</li>
            <li>• You can check your order status anytime</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/customer/test-orders/${orderId}`)}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-xl transition font-bold text-lg"
          >
            Check Order Status
          </button>
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
