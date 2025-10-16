import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();

app.use(cors());
app.use(express.json());

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// routes (actual route files will be provided in next parts)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
