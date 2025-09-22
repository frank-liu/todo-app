import express from 'express';
import { recordWebVitalMetric } from '../services/metrics';

const router = express.Router();

interface WebVitalPayload {
    name: string;
    value: number;
    id: string;
    delta?: number;
    navigationType?: string;
    rating?: string;
}

// POST /api/webvitals - Direct Web Vitals ingestion for Prometheus
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const metric: WebVitalPayload = req.body;

        // Validate required fields
        if (!metric.name || typeof metric.name !== 'string') {
            res.status(400).json({ error: 'Missing or invalid name field' });
            return;
        }

        if (typeof metric.value !== 'number' || isNaN(metric.value)) {
            res.status(400).json({ error: 'Missing or invalid value field' });
            return;
        }

        // Map web-vitals names to our metric types
        const metricTypeMap: { [key: string]: 'TTFB' | 'FCP' | 'LCP' | 'FID' | 'CLS' | 'INP' } = {
            'TTFB': 'TTFB',
            'FCP': 'FCP',
            'LCP': 'LCP',
            'FID': 'FID',
            'CLS': 'CLS',
            'INP': 'INP'
        };

        const metricType = metricTypeMap[metric.name.toUpperCase()];
        if (!metricType) {
            res.status(400).json({
                error: 'Unknown metric type',
                supportedTypes: Object.keys(metricTypeMap)
            });
            return;
        }

        // Extract page and device info from headers or use defaults
        const userAgent = req.headers['user-agent'] || '';
        const deviceType = detectDeviceType(userAgent);
        const page = extractPageFromHeaders(req) || 'homepage';

        // Record the metric in Prometheus
        const webVitalMetric = {
            type: metricType,
            value: metric.value,
            page,
            deviceType
        };

        recordWebVitalMetric(webVitalMetric);

        console.log(`📊 Direct Web Vital received: ${metricType}=${metric.value}ms for page: ${page}`);

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Web Vital metric recorded',
            metric: {
                type: metricType,
                value: metric.value,
                page,
                deviceType
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error processing Web Vital:', error);
        res.status(500).json({
            error: 'Failed to process Web Vital metric',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Helper function to detect device type from User-Agent
function detectDeviceType(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return 'mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'tablet';
    } else {
        return 'desktop';
    }
}

// Helper function to extract page info from request headers
function extractPageFromHeaders(req: express.Request): string | null {
    const referer = req.headers.referer || req.headers.referrer as string;

    if (referer) {
        try {
            const url = new URL(referer);
            return url.pathname === '/' ? 'homepage' : url.pathname;
        } catch {
            return null;
        }
    }

    return null;
}

// GET /api/webvitals - Endpoint info (for debugging)
router.get('/', (req: express.Request, res: express.Response) => {
    res.json({
        message: 'Direct Web Vitals ingestion endpoint',
        methods: ['POST'],
        description: 'Send Web Vitals metrics directly for Prometheus recording',
        supportedMetrics: ['TTFB', 'FCP', 'LCP', 'FID', 'CLS', 'INP'],
        example: {
            name: 'FCP',
            value: 1800,
            id: 'unique-metric-id',
            delta: 1800,
            rating: 'good'
        }
    });
});

export { router as webVitalsRouter };