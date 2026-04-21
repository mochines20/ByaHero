import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './lib/env';
import passport from './lib/passport';
import { errorHandler } from './middleware/errorHandler';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import sosRoutes from './routes/sos';
import receiptsRoutes from './routes/receipts';
import tripsRoutes from './routes/trips';
import usersRoutes from './routes/users';
import plannerRoutes from "./routes/planner";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.CLIENT_URL],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(passport.initialize());

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  },
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: (req as any).csrfToken() });
});

app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/chat', csrfProtection, chatRoutes);
app.use('/api/sos', csrfProtection, sosRoutes);
app.use('/api/trips', csrfProtection, tripsRoutes);
app.use('/api/receipts', csrfProtection, receiptsRoutes);
app.use('/api/analytics', csrfProtection, analyticsRoutes);
app.use('/api/users', csrfProtection, usersRoutes);
app.use('/api/planner', csrfProtection, plannerRoutes);

app.use(errorHandler);
