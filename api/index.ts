// Dynamic serverless entrypoint with boot-time exception trapping
let cachedHandler: any = null;
let bootError: any = null;

export default async function handler(req: any, res: any) {
  // CORS & Preflight headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-razorpay-signature");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (!cachedHandler && !bootError) {
      const mod = await import("../src/server/serverlessApi");
      cachedHandler = mod.default || mod;
    }

    if (bootError) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        success: false,
        error: `Server initialization error: ${bootError.message || bootError}`,
        code: "BOOT_INITIALIZATION_FAILED",
        details: process.env.NODE_ENV !== "production" ? bootError.stack : undefined
      });
    }

    return cachedHandler(req, res);
  } catch (err: any) {
    bootError = err;
    console.error("[Vercel Serverless Boot Exception]:", err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      success: false,
      error: `Serverless module boot failed: ${err?.message || err}`,
      code: "MODULE_BOOT_FAILED",
      stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined
    });
  }
}
