import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// Simulated Hardcoded Credentials (In a real app, use Hashed Passwords and a DB)
const ADMIN_CREDENTIALS = {
  email: 'admin@sol.rca',
  password: 'bangui2026'
};

// Simple in-memory storage for login attempts and brute-force protection
const loginAttempts: any[] = [];
const failedAttemptsMap = new Map<string, { count: number; lastAttempt: number }>();

// API routes
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || 'unknown';
  
  // Brute force protection: check if blocked
  const failed = failedAttemptsMap.get(ip);
  if (failed && failed.count >= 5 && Date.now() - failed.lastAttempt < 600000) { // 10 minutes block
    const remainingTime = Math.ceil((600000 - (Date.now() - failed.lastAttempt)) / 60000);
    return res.status(429).json({ 
      error: `Trop de tentatives. Veuillez attendre ${remainingTime} minutes.` 
    });
  }

  const isSuccess = email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;

  // Log attempt
  loginAttempts.unshift({
    email,
    timestamp: new Date().toISOString(),
    status: isSuccess ? 'Succès' : 'Échec',
    ip
  });

  if (isSuccess) {
    failedAttemptsMap.delete(ip); // Reset on success
    const token = Buffer.from(JSON.stringify({ sub: email, exp: Date.now() + 3600000 })).toString('base64');
    return res.json({ token, user: { email } });
  }

  // Update failed attempts
  const current = failedAttemptsMap.get(ip) || { count: 0, lastAttempt: 0 };
  failedAttemptsMap.set(ip, { count: current.count + 1, lastAttempt: Date.now() });

  return res.status(401).json({ error: "Identifiants invalides." });
});

app.get("/api/admin/dashboard", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Non autorisé." });
  }

  // Simulate data fetching delay
  setTimeout(() => {
    res.json({
      totalProjects: 254,
      avgSavings: "450 000 FCFA",
      quoteRequests: 48,
      satisfaction: "98.5%",
      growth: [
        { month: 'Jan', projects: 20 },
        { month: 'Fév', projects: 25 },
        { month: 'Mar', projects: 22 },
        { month: 'Avr', projects: 30 },
        { month: 'Mai', projects: 35 },
        { month: 'Juin', projects: 48 },
        { month: 'Juil', projects: 42 },
        { month: 'Août', projects: 55 },
        { month: 'Sept', projects: 50 },
        { month: 'Oct', projects: 65 },
        { month: 'Nov', projects: 60 },
        { month: 'Déc', projects: 74 },
      ],
      distribution: [
        { label: 'Résidentiel', value: 65 },
        { label: 'Commercial', value: 25 },
        { label: 'Institutionnel', value: 10 },
      ],
      recentProjects: [
        { id: '101', name: 'Villa Bangui Nord', client: 'M. Kondogbia', status: 'Terminé', date: '2026-04-12' },
        { id: '102', name: 'Centre Medical Bimbo', client: 'ONG Santé+', status: 'En cours', date: '2026-04-15' },
        { id: '103', name: 'Epicerie Boali', client: 'Mme Touadera', status: 'Plannifié', date: '2026-04-20' },
        { id: '104', name: 'Ecole Primaire Gobongo', client: 'Mairie de Bangui', status: 'Terminé', date: '2026-04-05' },
        { id: '105', name: 'Station Pompage Boali 2', client: 'SODECA', status: 'En cours', date: '2026-04-18' },
      ],
      loginAttempts: loginAttempts.slice(0, 10)
    });
  }, 1000);
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
