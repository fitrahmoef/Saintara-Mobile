'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/pricing';
import { PAYMENT_METHODS, PaymentMethodType } from '@/lib/payment';
import Script from 'next/script';

// Declare Midtrans Snap on window object
declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, options?: any) => void;
    };
  }
}

interface TestOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
}

export default function CreatePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<TestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [snapReady, setSnapReady] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID is required');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/test-orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      setOrder(data.testOrder);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderId) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Check if Snap is loaded
      if (!window.snap) {
        throw new Error('Payment gateway not loaded. Please refresh the page.');
      }

      // Open Midtrans Snap popup
      window.snap.pay(data.data.snapToken, {
        onSuccess: function (result: any) {
          console.log('Payment success:', result);
          router.push(`/customer/payments/success?orderId=${orderId}`);
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
          router.push(`/customer/payments/pending?orderId=${orderId}`);
        },
        onError: function (result: any) {
          console.error('Payment error:', result);
          router.push(`/customer/payments/failed?orderId=${orderId}`);
        },
        onClose: function () {
          console.log('Payment popup closed');
          setProcessing(false);
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
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
    <>
      {/* Load Midtrans Snap Script */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
          ? 'https://app.midtrans.com/snap/snap.js'
          : 'https://app.sandbox.midtrans.com/snap/snap.js'}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => setSnapReady(true)}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/customer/test-orders/${orderId}`)}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Order
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Complete Payment</h1>
            <p className="text-gray-600 mt-2">Choose your payment method and complete the transaction</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
                <div className="space-y-4">
                  {(Object.keys(PAYMENT_METHODS) as PaymentMethodType[]).map((method) => {
                    const methodInfo = PAYMENT_METHODS[method];
                    return (
                      <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`w-full p-6 border-2 rounded-xl text-left transition ${
                          selectedMethod === method
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{methodInfo.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                              {methodInfo.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{methodInfo.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>Fees: {methodInfo.fees}</span>
                              <span>{methodInfo.processingTime}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={selectedMethod === method}
                              onChange={() => setSelectedMethod(method)}
                              className="w-5 h-5 text-blue-600"
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Secure Payment</h3>
                    <p className="text-sm text-blue-800">
                      Your payment is secured by Midtrans, a PCI DSS Level 1 certified payment gateway.
                      Your financial information is encrypted and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg h-fit sticky top-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              {order && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    {selectedMethod && (
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600">Payment Fees:</span>
                        <span className="text-gray-600">
                          {PAYMENT_METHODS[selectedMethod].fees}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || processing || !snapReady}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing
                      ? 'Processing...'
                      : !snapReady
                      ? 'Loading payment gateway...'
                      : 'Pay Now'}
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By proceeding, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
