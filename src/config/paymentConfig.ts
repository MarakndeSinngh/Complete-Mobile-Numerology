import { REPORT_REGISTRY } from '../types/reportAccess';

/**
 * LEOFAMILY CANONICAL PAYMENT CONFIGURATION
 * Single authoritative source for payment pricing, UPI configuration, and payment gateway methods.
 */
export const PAYMENT_CONFIG = {
  // Primary payment method
  PAYMENT_METHOD: 'UPI_QR' as 'UPI_QR' | 'RAZORPAY',

  // Master report authoritative price in INR (derived from canonical REPORT_REGISTRY)
  MASTER_REPORT_PRICE: REPORT_REGISTRY.MASTER_REPORT.priceInr, // 33

  // LeoFamily Official UPI ID
  LEOFAMILY_UPI_ID: 'leofamily@upi',

  // Merchant display name
  LEOFAMILY_PAYEE_NAME: 'LeoFamily Numerology Services',

  // QR Asset URL
  LEOFAMILY_PAYMENT_QR: '/assets/leofamily-upi-qr.svg',

  // Supported UPI Apps list for guidance
  SUPPORTED_APPS: [
    { name: 'Google Pay', icon: 'gpay', color: '#4285F4' },
    { name: 'PhonePe', icon: 'phonepe', color: '#5f259f' },
    { name: 'Paytm', icon: 'paytm', color: '#00b9f5' },
    { name: 'BHIM UPI', icon: 'bhim', color: '#00796B' },
    { name: 'Other UPI Apps', icon: 'upi', color: '#E65100' }
  ],

  // Generate standard UPI Intent URI for mobile devices
  getUpiIntentUrl: (amount: number = 33, note: string = 'LeoFamily_Master_Report') => {
    const upiId = 'leofamily@upi';
    const payee = encodeURIComponent('LeoFamily Numerology');
    const noteEncoded = encodeURIComponent(note);
    return `upi://pay?pa=${upiId}&pn=${payee}&am=${amount}&cu=INR&tn=${noteEncoded}`;
  }
};
