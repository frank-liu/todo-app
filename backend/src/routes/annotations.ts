import express from 'express';

const router = express.Router();

interface WebVitalsPayload {
    tags: string[];
    text: string;
    time?: number;
    timeEnd?: number;
}

interface GrafanaAnnotation {
    tags: string[];
    text: string;
    time: number;
    timeEnd?: number;
}

// POST /api/annotations - Receive Web Vitals data and forward to Grafana
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const payload: WebVitalsPayload = req.body;

        // Validate required fields
        if (!payload.tags || !Array.isArray(payload.tags)) {
            res.status(400).json({ error: 'Missing or invalid tags field' });
            return;
        }

        if (!payload.text || typeof payload.text !== 'string') {
            res.status(400).json({ error: 'Missing or invalid text field' });
            return;
        }

        // Transform payload to Grafana format
        const grafanaAnnotation: GrafanaAnnotation = {
            tags: payload.tags,
            text: payload.text,
            time: payload.time || Date.now(),
            ...(payload.timeEnd && { timeEnd: payload.timeEnd })
        };

        console.log('📊 Received Web Vitals data:', {
            tags: grafanaAnnotation.tags,
            text: grafanaAnnotation.text,
            time: new Date(grafanaAnnotation.time).toISOString()
        });

        // Get Grafana configuration
        const grafanaUrl = process.env.GRAFANA_URL || 'http://localhost:3001';
        const grafanaApiToken = process.env.GRAFANA_API_TOKEN;

        // Forward to Grafana if URL is configured
        if (grafanaUrl !== 'disabled') {
            try {
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json'
                };

                if (grafanaApiToken) {
                    headers['Authorization'] = `Bearer ${grafanaApiToken}`;
                }

                // Note: Using fetch (available in Node 18+) or you could use axios
                const response = await fetch(`${grafanaUrl}/api/annotations`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(grafanaAnnotation),
                });

                if (!response.ok) {
                    console.error(`❌ Grafana API error: ${response.status} ${response.statusText}`);
                    const errorText = await response.text();
                    console.error('Grafana error response:', errorText);
                } else {
                    console.log('✅ Successfully forwarded to Grafana');
                }
            } catch (grafanaError) {
                console.error('❌ Failed to forward to Grafana:', grafanaError);
            }
        } else {
            console.log('📝 Grafana forwarding disabled (GRAFANA_URL=disabled)');
        }

        // Always respond with success to the frontend
        res.status(200).json({
            success: true,
            message: 'Web Vitals data received',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error processing annotations:', error);
        res.status(500).json({
            error: 'Failed to process annotation',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET /api/annotations - List annotations (for debugging)
router.get('/', (req: express.Request, res: express.Response) => {
    res.json({
        message: 'Annotations endpoint is working',
        methods: ['POST'],
        description: 'Send Web Vitals data here to forward to Grafana',
        example: {
            tags: ['web-vitals', 'CLS'],
            text: 'CLS: 0.05 (good)',
            time: Date.now()
        }
    });
});

export { router as annotationsRouter };