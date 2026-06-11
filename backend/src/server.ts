import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import contentRoutes from './routes/contentRoutes';
import membershipRoutes from './routes/membershipRoutes';
import planRoutes from './routes/planRoutes';
import downloadRoutes from './routes/downloadRoutes';
import communityRoutes from './routes/communityRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 for any unmatched /api routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// 500 handler for API errors
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use((req, res, next) => {
  const indexPath = path.join(__dirname, '../../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built');
  }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
