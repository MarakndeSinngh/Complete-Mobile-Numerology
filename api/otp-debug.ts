import type { Request, Response } from 'express';
import os from 'os';

/**
 * Diagnostic Serverless Endpoint for OTP & Gateway Health Auditing.
 * Never outputs sensitive keys, passwords, or raw secrets.
 * Outputs safe boolean presence indicators and system diagnostics.
 */
export default function handler(req: Request, res: Response) {
  // Set JSON headers and CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === 'production');

  const diagnostics = {
    success: true,
    timestamp: new Date().toISOString(),
    runtime: {
      isServerless,
      nodeVersion: process.version,
      platform: process.platform,
      tmpDir: os.tmpdir(),
      environment: process.env.NODE_ENV || 'development',
    },
    otpConfig: {
      OTP_MODE: process.env.OTP_MODE || (process.env.SMS_PROVIDER_API_KEY ? 'live' : 'sandbox'),
      FAST2SMS_API_KEY_PRESENT: !!process.env.FAST2SMS_API_KEY,
      SMS_PROVIDER_API_KEY_PRESENT: !!process.env.SMS_PROVIDER_API_KEY,
      OTP_API_KEY_PRESENT: !!process.env.OTP_API_KEY,
      OTP_PROVIDER_URL_PRESENT: !!(process.env.OTP_PROVIDER_URL || process.env.SMS_API_URL),
    },
    gatewayConfig: {
      RAZORPAY_KEY_ID_PRESENT: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET_PRESENT: !!process.env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET_PRESENT: !!process.env.RAZORPAY_WEBHOOK_SECRET,
    },
    aiConfig: {
      GEMINI_API_KEY_PRESENT: !!process.env.GEMINI_API_KEY,
    }
  };

  return res.status(200).json(diagnostics);
}
