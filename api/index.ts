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

// 1. Send Email OTP using Supabase Auth
router.post("/auth/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body || {};
    const result = await reportAccessEngine.sendEmailOtp(email);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to send email OTP" });
  }
});

// 2. Verify Email OTP using Supabase Auth
router.post("/auth/verify-email-otp", async (req, res) => {
  try {
    const { email, token } = req.body || {};
    const result = await reportAccessEngine.verifyEmailOtp(email, token);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify email OTP" });
  }
});

// Deprecated legacy routes (Mapped to email or safe notice)
router.post("/auth/request-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body || {};
    const target = email || (mobile ? `${mobile}@leofamily.local` : '');
    const result = await reportAccessEngine.sendEmailOtp(target);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to request OTP" });
  }
});

router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { email, mobile, otp } = req.body || {};
    const target = email || (mobile ? `${mobile}@leofamily.local` : '');
    const result = await reportAccessEngine.verifyEmailOtp(target, otp);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify OTP" });
  }
});

// 3. Central Report Access Check
router.get("/reports/check-access", async (req, res) => {
  try {
    const reportType = req.query.reportType as CanonicalReportType;
    const profileKey = (req.query.profileKey as string) || 'default_profile';
    const email = req.query.email as string | undefined;
    const authHeader = req.headers['authorization'];

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType parameter" });
    }

    const result = await reportAccessEngine.checkReportAccess(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to check report access" });
  }
});

// 4. Claim First Free Report
router.post("/reports/claim-free", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = await reportAccessEngine.claimFreeReport(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to claim free report" });
  }
});

// 5. Create ₹33 Razorpay Payment Order
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to create payment order" });
  }
});

// 6. Verify Razorpay Payment Signature & Grant Entitlement
router.post("/payments/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!orderId || !reportType) {
      return res.status(400).json({ success: false, error: "Missing orderId or reportType" });
    }

    const result = await reportAccessEngine.verifyPayment(
      orderId,
      paymentId || '',
      signature || '',
      reportType,
      profileKey,
      authHeader,
      email
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to verify payment" });
  }
});

// 7. Razorpay Webhook Endpoint
router.post("/payments/webhook", async (req, res) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const result = await reportAccessEngine.processWebhook(rawBody, signature);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Webhook verification failed" });
  }
});

// 8. Retrieve All Reports for Authenticated Customer
router.get("/reports/my-reports", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const email = req.query.email as string | undefined;

    const data = await reportAccessEngine.getUserReports(authHeader, email);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch user reports" });
  }
});

// 9. Retrieve Verified Payment History for Customer
router.get("/payments/history", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const email = req.query.email as string | undefined;

    const data = await reportAccessEngine.getUserPaymentHistory(authHeader, email);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch payment history" });
  }
});

// 10. Retrieve Access & Entitlement Summary
router.get("/reports/access-summary", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const email = req.query.email as string | undefined;

    const data = await reportAccessEngine.getUserAccessSummary(authHeader, email);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch access summary" });
  }
});

// 11. Retrieve Single Report with Server Ownership Check
router.get("/reports/:reportId", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const email = req.query.email as string | undefined;
    const { reportId } = req.params;

    const data = await reportAccessEngine.getReportById(reportId, authHeader, email);
    res.json(data);
  } catch (e: any) {
    res.status(403).json({ success: false, error: e?.message || "Failed to access report" });
  }
});

// 12. Admin Entitlements & Revenue Audit
router.get("/admin/entitlements", async (req, res) => {
  try {
    const data = await reportAccessEngine.getAdminAuditData();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch admin audit data" });
  }
});

// 13. OTP and Gateway Environment Diagnostics (Restricted in production)
router.get("/otp-debug", (req, res) => {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  const allowDebug = !isProduction || process.env.ENABLE_OTP_DEBUG === "true" || req.query.adminKey === process.env.ADMIN_SECRET_KEY;

  if (!allowDebug) {
    return res.status(403).json({
      success: false,
      error: "FORBIDDEN",
      message: "Diagnostic debug endpoint is restricted in production mode."
    });
  }

  const audit = reportAccessEngine ? (reportAccessEngine as any).getSafeConfigAudit?.() : {};

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    runtime: {
      isServerless: !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production"),
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || "development"
    },
    fast2smsConfig: {
      OTP_MODE: process.env.OTP_MODE || (isProduction ? "live" : "test"),
      FAST2SMS_API_KEY_PRESENT: !!process.env.FAST2SMS_API_KEY,
      FAST2SMS_OTP_ID_PRESENT: !!process.env.FAST2SMS_OTP_ID,
      FAST2SMS_API_URL_PRESENT: !!process.env.FAST2SMS_API_URL,
      FAST2SMS_VERIFY_URL_PRESENT: !!process.env.FAST2SMS_VERIFY_URL,
      FAST2SMS_EFFECTIVE_SEND_ENDPOINT: process.env.FAST2SMS_API_URL || 'https://www.fast2sms.com/dev/otp/send',
      FAST2SMS_EFFECTIVE_VERIFY_ENDPOINT: process.env.FAST2SMS_VERIFY_URL || 'https://www.fast2sms.com/dev/otp/verify',
    },
    gatewayConfig: {
      RAZORPAY_KEY_ID_PRESENT: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET_PRESENT: !!process.env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET_PRESENT: !!process.env.RAZORPAY_WEBHOOK_SECRET
    },
    databaseConfig: {
      DATABASE_CONFIGURED: !!(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL)
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

