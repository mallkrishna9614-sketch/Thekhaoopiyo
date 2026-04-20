import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());

// API Safety: Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per clock
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Routes
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'khao-piyo-api' });
});

// Security: Global Error Handler to scrub sensitive information
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SERVER HTTP ERROR]:', err.stack || err.message);
  
  const statusCode = err.statusCode || 500;
  // Return generic messages to the client explicitly to avoid leaking DB info or system geometry
  const safeMessage = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({ error: safeMessage });
});

app.listen(port, () => {
  console.log(`API Server running on port ${port}`);
});

export default app;
