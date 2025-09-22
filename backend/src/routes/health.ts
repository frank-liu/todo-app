import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'todo-app-backend',
    version: '1.0.0'
  });
});

export { router as healthRouter };