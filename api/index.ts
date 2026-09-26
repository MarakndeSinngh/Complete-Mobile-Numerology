import express from "express";
import { reportAccessEngine } from "../src/server/accessEngine";
import { CanonicalReportType } from "../src/types/reportAccess";
import { generateMedicalNumerologyReport } from "../src/services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "../src/services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "../src/services/dashaEngine";
import { PAIR_MEANINGS } from "../src/services/pairMeanings";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Ensure Content-Type is always application/json for API responses
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_TESTING",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Create router to mount on both "/api" and "/" for transparent Vercel URL rewrite compatibility
const router = express.Router();

// 1. Request OTP for mobile number verification
router.post("/auth/request-otp", async (req, res) => {
  try {
    const { mobile } = req.body || {};
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : undefined) || req.socket?.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const result = await reportAccessEngine.requestOtp(mobile, ip, userAgent);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to request OTP" });
  }
});

// 2. Verify OTP and return session token
router.post("/auth/verify-otp", (req, res) => {
  try {
    const { mobile, otp } = req.body || {};
    const result = reportAccessEngine.verifyOtp(mobile, otp);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify OTP" });
  }
});

// 3. Central Report Access Check
router.get("/reports/check-access", (req, res) => {
  try {
    const reportType = req.query.reportType as CanonicalReportType;
    const profileKey = (req.query.profileKey as string) || 'default_profile';
    const mobile = req.query.mobile as string | undefined;
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType parameter" });
    }

    const result = reportAccessEngine.checkReportAccess(reportType, profileKey, mobile, token);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to check report access" });
  }
});

// 4. Claim First Free Report
router.post("/reports/claim-free", (req, res) => {
  try {
    const { reportType, profileKey, mobile } = req.body || {};
    const authHeader = req.headers['authorization'];
    const token = req.body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = reportAccessEngine.claimFreeReport(reportType, profileKey, mobile, token);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to claim free report" });
  }
});

// 5. Create ₹33 Razorpay Payment Order
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey, mobile } = req.body || {};
    const authHeader = req.headers['authorization'];
    const token = req.body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, mobile, token);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to create payment order" });
  }
});

// 6. Verify Razorpay Payment Signature & Grant Entitlement
router.post("/payments/verify-payment", (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey, mobile } = req.body || {};
    const authHeader = req.headers['authorization'];
    const token = req.body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!orderId || !reportType) {
      return res.status(400).json({ success: false, error: "Missing orderId or reportType" });
    }

    const result = reportAccessEngine.verifyPayment(
      orderId,
      paymentId || '',
      signature || '',
      reportType,
      profileKey,
      mobile,
      token
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify payment" });
  }
});

// 7. Razorpay Webhook Endpoint
router.post("/payments/webhook", (req, res) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const result = reportAccessEngine.processWebhook(rawBody, signature);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Webhook verification failed" });
  }
});

// 8. Retrieve All Reports for Authenticated Customer
router.get("/reports/my-reports", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserReports(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch user reports" });
  }
});

// 9. Retrieve Verified Payment History for Customer
router.get("/payments/history", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserPaymentHistory(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch payment history" });
  }
});

// 10. Retrieve Access & Entitlement Summary
router.get("/reports/access-summary", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserAccessSummary(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch access summary" });
  }
});

// 11. Retrieve Single Report with Server Ownership Check
router.get("/reports/:reportId", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;
    const { reportId } = req.params;

    const data = reportAccessEngine.getReportById(reportId, token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(403).json({ success: false, error: e?.message || "Failed to access report" });
  }
});

// 12. Admin Entitlements & Revenue Audit
router.get("/admin/entitlements", (req, res) => {
  try {
    const data = reportAccessEngine.getAdminAuditData();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch admin audit data" });
  }
});

// 13. OTP and Gateway Environment Diagnostics
router.get("/otp-debug", (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    runtime: {
      isServerless: !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production"),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || "development"
    },
    otpConfig: {
      OTP_MODE: process.env.OTP_MODE || (process.env.SMS_PROVIDER_API_KEY ? "live" : "sandbox"),
      FAST2SMS_API_KEY_PRESENT: !!process.env.FAST2SMS_API_KEY,
      SMS_PROVIDER_API_KEY_PRESENT: !!process.env.SMS_PROVIDER_API_KEY,
      OTP_API_KEY_PRESENT: !!process.env.OTP_API_KEY,
      OTP_PROVIDER_URL_PRESENT: !!(process.env.OTP_PROVIDER_URL || process.env.SMS_API_URL)
    },
    gatewayConfig: {
      RAZORPAY_KEY_ID_PRESENT: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET_PRESENT: !!process.env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET_PRESENT: !!process.env.RAZORPAY_WEBHOOK_SECRET
    },
    aiConfig: {
      GEMINI_API_KEY_PRESENT: !!process.env.GEMINI_API_KEY
    }
  });
});

// Mount router on both "/api" and "/"
app.use("/api", router);
app.use("/", router);

// Catch-all 404 JSON handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "ENDPOINT_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.originalUrl || req.url} not found.`
  });
});

// Central error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Vercel Serverless Error:", err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected internal server error occurred."
  });
});

export default (req: any, res: any) => {
  return app(req, res);
};

