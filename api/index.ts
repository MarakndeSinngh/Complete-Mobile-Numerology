import express from "express";
import { reportAccessEngine, isPublicReport } from "../src/server/accessEngine";
import { verifySupabaseToken, requireAuthenticatedUser } from "../src/server/supabaseServer";
import { CanonicalReportType } from "../src/types/reportAccess";
import { generateMedicalNumerologyReport } from "../src/services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "../src/services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "../src/services/dashaEngine";
import { PAIR_MEANINGS } from "../src/services/pairMeanings";
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

// Vercel URL normalization & JSON content type middleware
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  // If Vercel rewrote the URL to /api, restore full path from x-matched-path if present
  const matchedPath = (req.headers["x-matched-path"] as string) || (req.headers["x-vercel-matched-path"] as string);
  if (matchedPath && (req.url === "/api" || req.url === "/" || req.url === "")) {
    req.url = matchedPath;
  }

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
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Create router to mount on both "/api" and "/" for transparent Vercel URL rewrite compatibility
const router = express.Router();

// 1. Synchronize / Update Authenticated Supabase User Profile
router.post("/user/profile", async (req, res) => {
  try {
    const user = await requireAuthenticatedUser(req);
    const { preferredLanguage, fullName, dob, mobile, gender, mulank, bhagyank } = req.body || {};

    await reportAccessEngine.syncProfileRecord(user, {
      preferredLanguage,
      fullName,
    });

    let numerologyProfile = null;
    if (dob && (fullName || user.fullName)) {
      numerologyProfile = await reportAccessEngine.saveNumerologyProfile(user.supabaseUserId, {
        fullName: fullName || user.fullName || 'Seeker',
        dob,
        mobile: mobile || user.phone,
        email: user.email,
        gender: gender || 'MALE',
        language: preferredLanguage || 'hi',
        mulank,
        bhagyank,
      });
    }

    res.json({
      success: true,
      user: {
        id: user.supabaseUserId,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        authProvider: user.authProvider,
      },
      numerologyProfile,
    });
  } catch (e: any) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to sync profile" });
  }
});

// 2. Central Report Access Check
router.get("/reports/check-access", async (req, res) => {
  try {
    const reportType = req.query.reportType as CanonicalReportType;
    const profileKey = (req.query.profileKey as string) || "default_profile";
    const authHeader = req.headers["authorization"];

    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType parameter",
        code: "INVALID_REQUEST",
      });
    }

    const result = await reportAccessEngine.checkReportAccess(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e: any) {
    console.error("[API:CheckAccess:Error]", e?.message || e);
    const isDbErr = e?.message?.includes("DATABASE") || e?.message?.includes("connection");
    res.status(isDbErr ? 503 : 500).json({
      success: false,
      error: isDbErr
        ? "Database connection is temporarily unavailable."
        : (e?.message || "Failed to check report access"),
      code: isDbErr ? "DATABASE_UNAVAILABLE" : "ACCESS_CHECK_FAILED",
    });
  }
});

// 3. Claim First Free Report
router.all("/reports/claim-free", (req, res, next) => {
  if (req.method !== "POST" && req.method !== "OPTIONS") {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Claiming a free report requires a POST request.`,
      code: "METHOD_NOT_ALLOWED",
    });
  }
  next();
});

router.post("/reports/claim-free", async (req, res) => {
  try {
    const { reportType, profileKey } = req.body || {};
    const authHeader = req.headers["authorization"];

    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST",
      });
    }

    const result = await reportAccessEngine.claimFreeReport(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e: any) {
    console.error("[API:ClaimFree:Error]", e?.message || e);
    const msg = e?.message || "Failed to claim free report";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("login");
    const isDbErr = msg.includes("DATABASE") || msg.includes("connection");
    const isAlready = msg.includes("ALREADY_CLAIMED") || msg.includes("already");

    const status = isAuth ? 401 : isDbErr ? 503 : isAlready ? 400 : 400;
    res.status(status).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : isDbErr ? "DATABASE_UNAVAILABLE" : isAlready ? "ALREADY_CLAIMED" : "CLAIM_FAILED",
    });
  }
});

// 4. Create ₹33 Razorpay Payment Order
router.post("/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey } = req.body || {};
    const authHeader = req.headers["authorization"];

    if (!reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing reportType",
        code: "INVALID_REQUEST",
      });
    }

    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, authHeader);
    res.json(result);
  } catch (e: any) {
    console.error("[API:CreateOrder:Error]", e?.message || e);
    const msg = e?.message || "Failed to create payment order";
    const isAuth = msg.includes("UNAUTHORIZED") || msg.includes("login");
    res.status(isAuth ? 401 : 400).json({
      success: false,
      error: msg,
      code: isAuth ? "UNAUTHORIZED" : "ORDER_CREATION_FAILED",
    });
  }
});

// 5. Verify Razorpay Payment Signature & Grant Entitlement
router.post("/payments/verify-payment", async (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey } = req.body || {};
    const authHeader = req.headers["authorization"];

    if (!orderId || !reportType) {
      return res.status(400).json({
        success: false,
        error: "Missing orderId or reportType",
        code: "INVALID_REQUEST",
      });
    }

    const result = await reportAccessEngine.verifyPayment(
      orderId,
      paymentId || "",
      signature || "",
      reportType,
      profileKey,
      authHeader
    );
    res.json(result);
  } catch (e: any) {
    console.error("[API:VerifyPayment:Error]", e?.message || e);
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 400).json({
      success: false,
      error: e?.message || "Failed to verify payment",
      code: "PAYMENT_VERIFICATION_FAILED",
    });
  }
});

// 6. Razorpay Webhook Endpoint
router.post("/payments/webhook", async (req, res) => {
  try {
    const signature = (req.headers["x-razorpay-signature"] as string) || "";
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const result = await reportAccessEngine.processWebhook(rawBody, signature);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e?.message || "Webhook verification failed" });
  }
});

// 7. Save Generated Report Run (Requires Authentication for protected reports)
router.post("/reports/save-run", async (req, res) => {
  try {
    const user = await requireAuthenticatedUser(req);
    const { reportType, reportKey, reportData, profileName, dob, mobile, language, accessType, amount, paymentId } = req.body || {};

    if (!reportType || !reportData) {
      return res.status(400).json({ success: false, error: "Missing reportType or reportData" });
    }

    const runId = await reportAccessEngine.saveReportRun(
      user.supabaseUserId,
      reportType,
      reportKey || `${reportType}_${Date.now()}`,
      reportData,
      {
        profileName,
        dob,
        mobile,
        language,
        accessType,
        amount,
        paymentId,
      }
    );

    res.json({ success: true, runId });
  } catch (e: any) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to save report run" });
  }
});

// 8. Retrieve All Reports for Authenticated Customer
router.get("/reports/my-reports", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const data = await reportAccessEngine.getUserReports(authHeader);
    res.json(data);
  } catch (e: any) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to fetch user reports" });
  }
});

// 9. Retrieve Verified Payment History for Customer
router.get("/payments/history", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const data = await reportAccessEngine.getUserPaymentHistory(authHeader);
    res.json(data);
  } catch (e: any) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 500).json({ success: false, error: e?.message || "Failed to fetch payment history" });
  }
});

// 10. Retrieve Single Report with Server Ownership Check
router.get("/reports/:reportId", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const { reportId } = req.params;

    const data = await reportAccessEngine.getReportById(reportId, authHeader);
    res.json(data);
  } catch (e: any) {
    const isAuth = e?.message?.includes("UNAUTHORIZED");
    res.status(isAuth ? 401 : 403).json({ success: false, error: e?.message || "Failed to access report" });
  }
});

// Mount router on both "/api" and "/"
app.use("/api", router);
app.use("/", router);

// Catch-all 404 JSON handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "ENDPOINT_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.originalUrl || req.url} not found.`,
  });
});

// Central error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Serverless Error:", err);
  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected internal server error occurred.",
  });
});

export default (req: any, res: any) => {
  return app(req, res);
};
