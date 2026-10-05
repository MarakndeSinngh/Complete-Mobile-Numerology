// Zero-import minimal health check for Vercel Serverless runtime
export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'vercel-serverless',
    nodeVersion: process.version,
    env: {
      hasSupabaseUrl: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      hasSupabaseServiceKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      hasDatabaseUrl: !!(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL),
      nodeEnv: process.env.NODE_ENV || 'production'
    }
  });
}
