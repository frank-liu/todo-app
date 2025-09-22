import express from 'express';
import { register } from '../services/metrics';

const router = express.Router();

// GET /metrics - Prometheus metrics endpoint
router.get('/', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        // Set the correct content type for Prometheus
        res.set('Content-Type', register.contentType);

        // Get all metrics in Prometheus format
        const metrics = await register.metrics();

        res.send(metrics);
    } catch (error) {
        console.error('❌ Error generating metrics:', error);
        res.status(500).json({
            error: 'Failed to generate metrics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export { router as metricsRouter };