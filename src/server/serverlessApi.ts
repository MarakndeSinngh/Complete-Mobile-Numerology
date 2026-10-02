import express from "express";
import { reportAccessEngine } from "./accessEngine";
import { CanonicalReportType } from "../types/reportAccess";
import { generateMedicalNumerologyReport } from "../services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "../services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "../services/dashaEngine";
import { PAIR_MEANINGS } from "../services/pairMeanings";
import { GoogleGenAI } from "@google/genai";

const app = express();

// CORS & Preflight middleware (ensures POST/OPTIONS requests with Bearer tokens succeed)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-razorpay-signature");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Ensure Content-Type is always application/json for API responses
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  if (process.env.NODE_ENV !== "production") {
    console.log(`[API REQUEST] ${req.method} ${req.originalUrl || req.url}`);
  }
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

// 1. Synchronize Authenticated Supabase Session & Upsert Profile
router.post("/auth/sync-session", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] || (req.body?.accessToken ? `Bearer ${req.body.accessToken}` : null);
    const result = await reportAccessEngine.syncSession(authHeader, req.body);
    res.json(result);
  } catch (e: any) {
    res.status(401).json({ success: false, error: e?.message || "Unauthorized session" });
  }
});

// 2. Save / Update User Numerology Profile
router.post("/profiles/save", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const result = await reportAccessEngine.saveNumerologyProfile(authHeader, req.body);
    res.json(result);
  } catch (e: any) {
    const isAuth = e?.message?.includes('UNAUTHORIZED');
    res.status(isAuth ? 401 : 400).json({ success: false, error: e?.message || "Failed to save profile" });
  }
});

// 3. Get Current User's Saved Numerology Profile
router.get("/profiles/current", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const result = await reportAccessEngine.getNumerologyProfile(authHeader);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to fetch profile" });
  }
});

// 4. Record Report Run
router.post("/reports/record-run", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const result = await reportAccessEngine.recordReportRun(authHeader, req.body);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Failed to record report run" });
  }
});

// 5. Log User Activity
router.post("/activity/log", async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const { eventType, metadata } = req.body || {};
    await reportAccessEngine.logUserActivity(authHeader, eventType, metadata);
    res.json({ success: true });
  } catch (e: any) {
    res.json({ success: false, error: e?.message });
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
      return res.status(400).json({
        success: false,
        error: "Missing reportType parameter",
        code: "INVALID_REQUEST"
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API:CheckAccess] Checking access for ${reportType} (profile: ${profileKey})`);
    }

    const result = await reportAccessEngine.checkReportAccess(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    console.error("[API:CheckAccess:Error]", e?.message || e);
    const isDbErr = e?.message?.includes('DATABASE') || e?.message?.includes('connection') || e?.message?.includes('Pool');
    res.status(isDbErr ? 503 : 500).json({
      success: false,
      error: isDbErr
        ? "Database connection is temporarily unavailable. Please retry in a few moments."
        : (e?.message || "Failed to check report access"),
      code: isDbErr ? "DATABASE_UNAVAILABLE" : "ACCESS_CHECK_FAILED"
    });
  }
});

// 4. Claim First Free Report
router.all("/reports/claim-free", (req, res, next) => {
  if (req.method !== "POST" && req.method !== "OPTIONS") {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Claiming a free report requires a POST request.`,
      code: "METHOD_NOT_ALLOWED"
    });
  }
  next();
});

router.post("/reports/claim-free", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API:ClaimFree] Attempting free claim for ${reportType} (profile: ${profileKey})`);
    }

    const result = await reportAccessEngine.claimFreeReport(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    console.error("[API:ClaimFree:Error]", e?.message || e);
    const msg = e?.message || "Failed to claim free report";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("session");
    const isDbErr = msg.includes('DATABASE') || msg.includes('connection');
    const isAlready = msg.includes("पहले ही") || msg.includes("already");

    const status = isAuth ? 401 : isDbErr ? 503 : 400;
    res.status(status).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : isDbErr ? "DATABASE_UNAVAILABLE" : isAlready ? "ALREADY_CLAIMED" : "CLAIM_FAILED"
    });
  }
});

// 5. Create ₹33 Razorpay Payment Order
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST"
      });
    }

    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, authHeader, email);
    res.json(result);
  } catch (e: any) {
    console.error("[API:CreateOrder:Error]", e?.message || e);
    const msg = e?.message || "Failed to create payment order";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("verify email");
    res.status(isAuth ? 401 : 400).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : "ORDER_CREATION_FAILED"
    });
  }
});

// 6. Verify Razorpay Payment Signature & Grant Entitlement
router.post("/payments/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey, email } = req.body || {};
    const authHeader = req.headers['authorization'];

    if (!orderId || !reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing orderId or reportType",
        code: "INVALID_REQUEST"
      });
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
    console.error("[API:VerifyPayment:Error]", e?.message || e);
    res.status(400).json({
      success: false,
      error: e?.message || "Failed to verify payment",
      code: "PAYMENT_VERIFICATION_FAILED"
    });
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
    authConfig: {
      AUTH_PROVIDER: "SUPABASE_AUTH",
      SUPABASE_URL_PRESENT: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      SUPABASE_ANON_KEY_PRESENT: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      SUPABASE_SERVICE_ROLE_KEY_PRESENT: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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
