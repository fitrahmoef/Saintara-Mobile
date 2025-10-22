import crypto from 'crypto';

// Midtrans configuration
export const MIDTRANS_CONFIG = {
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  apiUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://api.midtrans.com'
    : 'https://api.sandbox.midtrans.com',
  snapUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com/snap/v1'
    : 'https://app.sandbox.midtrans.com/snap/v1',
};

export interface MidtransTransactionData {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    first_name: string;
    email: string;
    phone?: string;
  };
  item_details: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
}

export interface MidtransSnapResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time?: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
}

/**
 * Create Midtrans Snap transaction
 */
export async function createMidtransTransaction(
  data: MidtransTransactionData
): Promise<MidtransSnapResponse> {
  const response = await fetch(`${MIDTRANS_CONFIG.snapUrl}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(MIDTRANS_CONFIG.serverKey + ':').toString('base64')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_messages?.[0] || 'Failed to create transaction');
  }

  return await response.json();
}

/**
 * Get transaction status from Midtrans
 */
export async function getMidtransTransactionStatus(orderId: string): Promise<any> {
  const response = await fetch(`${MIDTRANS_CONFIG.apiUrl}/v2/${orderId}/status`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(MIDTRANS_CONFIG.serverKey + ':').toString('base64')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.status_message || 'Failed to get transaction status');
  }

  return await response.json();
}

/**
 * Verify Midtrans notification signature
 */
export function verifyMidtransSignature(notification: MidtransNotification): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;
  const serverKey = MIDTRANS_CONFIG.serverKey;

  const signatureString = order_id + status_code + gross_amount + serverKey;
  const hash = crypto.createHash('sha512').update(signatureString).digest('hex');

  return hash === signature_key;
}

/**
 * Map Midtrans transaction status to our payment status
 */
export function mapMidtransStatusToPaymentStatus(
  transactionStatus: string,
  fraudStatus?: string
): 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' {
  if (fraudStatus === 'deny' || transactionStatus === 'deny') {
    return 'FAILED';
  }

  switch (transactionStatus) {
    case 'capture':
    case 'settlement':
      return 'PAID';
    case 'pending':
      return 'PENDING';
    case 'cancel':
    case 'expire':
      return 'CANCELLED';
    case 'failure':
      return 'FAILED';
    default:
      return 'PENDING';
  }
}

/**
 * Payment method configurations
 */
export const PAYMENT_METHODS = {
  BANK_TRANSFER: {
    name: 'Bank Transfer',
    description: 'Transfer via BCA, BNI, BRI, Mandiri, Permata',
    icon: '🏦',
    fees: 'Rp 4,000',
    processingTime: 'Instant after transfer',
  },
  CREDIT_CARD: {
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, JCB',
    icon: '💳',
    fees: '2.9% + Rp 2,000',
    processingTime: 'Instant',
  },
  E_WALLET: {
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, ShopeePay',
    icon: '📱',
    fees: 'Rp 0 - 2%',
    processingTime: 'Instant',
  },
  CONVENIENCE_STORE: {
    name: 'Convenience Store',
    description: 'Alfamart, Indomaret',
    icon: '🏪',
    fees: 'Rp 2,500',
    processingTime: 'Up to 3 hours after payment',
  },
} as const;

export type PaymentMethodType = keyof typeof PAYMENT_METHODS;
