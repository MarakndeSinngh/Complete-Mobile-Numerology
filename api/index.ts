import express from "express";
import { reportAccessEngine } from "../src/server/accessEngine";
import { CanonicalReportType } from "../src/types/reportAccess";
import { generateMedicalNumerologyReport } from "../src/services/medicalNumerologyEngine";
import { generateNumeroVaastuReport } from "../src/services/numeroVaastuEngine";
import { calculateDashaAndYearForecast } from "../src/services/dashaEngine";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/api", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// 1. Request OTP for mobile number verification
app.post("/api/auth/request-otp", (req, res) => {
  try {
    const { mobile } = req.body;
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const result = reportAccessEngine.requestOtp(mobile, ip, userAgent);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || "Failed to request OTP" });
  }
});

// 2. Verify OTP and return session token
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const result = reportAccessEngine.verifyOtp(mobile, otp);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || "Failed to verify OTP" });
  }
});

// 3. Central Report Access Check
app.get("/api/reports/check-access", (req, res) => {
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
    res.status(500).json({ success: false, error: e.message || "Failed to check report access" });
  }
});

// 4. Claim First Free Report
app.post("/api/reports/claim-free", (req, res) => {
  try {
    const { reportType, profileKey, mobile } = req.body;
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = reportAccessEngine.claimFreeReport(reportType, profileKey, mobile, token);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || "Failed to claim free report" });
  }
});

// 5. Create ₹33 Razorpay Payment Order
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { reportType, profileKey, mobile } = req.body;
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

    if (!reportType) {
      return res.status(400).json({ success: false, error: "Missing reportType" });
    }

    const result = await reportAccessEngine.createPaymentOrder(reportType, profileKey, mobile, token);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || "Failed to create payment order" });
  }
});

// 6. Verify Razorpay Payment Signature & Grant Entitlement
app.post("/api/payments/verify-payment", (req, res) => {
  try {
    const { orderId, paymentId, signature, reportType, profileKey, mobile } = req.body;
    const authHeader = req.headers['authorization'];
    const token = req.body.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);

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
    res.status(400).json({ success: false, error: e.message || "Failed to verify payment" });
  }
});

// 7. Razorpay Webhook Endpoint
app.post("/api/payments/webhook", (req, res) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const result = reportAccessEngine.processWebhook(rawBody, signature);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || "Webhook verification failed" });
  }
});

// 8. Retrieve All Reports for Authenticated Customer
app.get("/api/reports/my-reports", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserReports(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || "Failed to fetch user reports" });
  }
});

// 9. Retrieve Verified Payment History for Customer
app.get("/api/payments/history", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserPaymentHistory(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || "Failed to fetch payment history" });
  }
});

// 10. Retrieve Access & Entitlement Summary
app.get("/api/reports/access-summary", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;

    const data = reportAccessEngine.getUserAccessSummary(token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || "Failed to fetch access summary" });
  }
});

// 11. Retrieve Single Report with Server Ownership Check
app.get("/api/reports/:reportId", (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = (req.query.token as string) || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined);
    const mobile = req.query.mobile as string | undefined;
    const { reportId } = req.params;

    const data = reportAccessEngine.getReportById(reportId, token, mobile);
    res.json(data);
  } catch (e: any) {
    res.status(403).json({ success: false, error: e.message || "Failed to access report" });
  }
});

// 12. Admin Entitlements & Revenue Audit
app.get("/api/admin/entitlements", (req, res) => {
  try {
    const data = reportAccessEngine.getAdminAuditData();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || "Failed to fetch admin audit data" });
  }
});

// Catch-all 404 JSON handler
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "ENDPOINT_NOT_FOUND",
    message: `API endpoint ${req.method} ${req.path} not found.`
  });
});

export default app;
