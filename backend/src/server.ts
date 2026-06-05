import express from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import membershipRoutes from './routes/membershipRoutes';
import planRoutes from './routes/planRoutes';
import downloadRoutes from './routes/downloadRoutes';
import communityRoutes from './routes/communityRoutes';
import adminRoutes from './routes/adminRoutes';
import { runSeed } from './seed/seedData';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve static files in production
const distPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(500).send('Server error');
  });
});

const PORT = process.env.PORT || 3000;

// Auto-seed on cold start (critical for Vercel where data resets)
runSeed();

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;