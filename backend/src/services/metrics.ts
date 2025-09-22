import { register, Histogram, Counter, Gauge, collectDefaultMetrics } from 'prom-client';

// Enable default Node.js metrics collection
collectDefaultMetrics({
    prefix: 'todo_app_',
});

// Web Vitals Histograms - track distribution of performance metrics
export const webVitalsHistograms = {
    // Time to First Byte (TTFB) - server response time
    ttfb: new Histogram({
        name: 'web_vitals_ttfb_seconds',
        help: 'Time to First Byte (TTFB) in seconds',
        labelNames: ['page', 'device_type'],
        buckets: [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0], // Buckets in seconds
    }),

    // First Contentful Paint (FCP) - time until first content appears
    fcp: new Histogram({
        name: 'web_vitals_fcp_seconds',
        help: 'First Contentful Paint (FCP) in seconds',
        labelNames: ['page', 'device_type'],
        buckets: [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0], // Buckets in seconds
    }),

    // Largest Contentful Paint (LCP) - loading performance
    lcp: new Histogram({
        name: 'web_vitals_lcp_seconds',
        help: 'Largest Contentful Paint (LCP) in seconds',
        labelNames: ['page', 'device_type'],
        buckets: [1.0, 2.0, 2.5, 3.0, 4.0, 5.0, 8.0], // Buckets in seconds
    }),

    // First Input Delay (FID) - interactivity
    fid: new Histogram({
        name: 'web_vitals_fid_seconds',
        help: 'First Input Delay (FID) in seconds',
        labelNames: ['page', 'device_type'],
        buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1.0], // Buckets in seconds
    }),

    // Cumulative Layout Shift (CLS) - visual stability
    cls: new Histogram({
        name: 'web_vitals_cls_score',
        help: 'Cumulative Layout Shift (CLS) score',
        labelNames: ['page', 'device_type'],
        buckets: [0.05, 0.1, 0.15, 0.25, 0.5, 1.0], // CLS score buckets
    }),

    // Interaction to Next Paint (INP) - responsiveness
    inp: new Histogram({
        name: 'web_vitals_inp_seconds',
        help: 'Interaction to Next Paint (INP) in seconds',
        labelNames: ['page', 'device_type'],
        buckets: [0.1, 0.2, 0.5, 1.0, 2.0, 5.0], // Buckets in seconds
    }),
};

// Core Web Vitals Score Gauges - track current values
export const webVitalsGauges = {
    ttfb: new Gauge({
        name: 'web_vitals_ttfb_current',
        help: 'Current TTFB value in seconds',
        labelNames: ['page', 'device_type'],
    }),

    fcp: new Gauge({
        name: 'web_vitals_fcp_current',
        help: 'Current FCP value in seconds',
        labelNames: ['page', 'device_type'],
    }),

    lcp: new Gauge({
        name: 'web_vitals_lcp_current',
        help: 'Current LCP value in seconds',
        labelNames: ['page', 'device_type'],
    }),

    fid: new Gauge({
        name: 'web_vitals_fid_current',
        help: 'Current FID value in seconds',
        labelNames: ['page', 'device_type'],
    }),

    cls: new Gauge({
        name: 'web_vitals_cls_current',
        help: 'Current CLS score',
        labelNames: ['page', 'device_type'],
    }),

    inp: new Gauge({
        name: 'web_vitals_inp_current',
        help: 'Current INP value in seconds',
        labelNames: ['page', 'device_type'],
    }),
};

// Counters for tracking totals
export const webVitalsCounters = {
    // Total number of Web Vitals measurements received
    total: new Counter({
        name: 'web_vitals_measurements_total',
        help: 'Total number of Web Vitals measurements received',
        labelNames: ['metric_type', 'page', 'device_type'],
    }),

    // Performance score categories
    goodScores: new Counter({
        name: 'web_vitals_good_scores_total',
        help: 'Total number of good Web Vitals scores',
        labelNames: ['metric_type', 'page', 'device_type'],
    }),

    needsImprovementScores: new Counter({
        name: 'web_vitals_needs_improvement_scores_total',
        help: 'Total number of Web Vitals scores that need improvement',
        labelNames: ['metric_type', 'page', 'device_type'],
    }),

    poorScores: new Counter({
        name: 'web_vitals_poor_scores_total',
        help: 'Total number of poor Web Vitals scores',
        labelNames: ['metric_type', 'page', 'device_type'],
    }),
};

// Application-specific metrics
export const appMetrics = {
    // Track Grafana forwarding success/failure
    grafanaForwards: new Counter({
        name: 'grafana_forwards_total',
        help: 'Total number of requests forwarded to Grafana',
        labelNames: ['status'], // 'success' or 'error'
    }),

    // Track API request duration
    apiRequestDuration: new Histogram({
        name: 'api_request_duration_seconds',
        help: 'Duration of API requests in seconds',
        labelNames: ['method', 'route', 'status_code'],
        buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1.0, 2.0, 5.0],
    }),
};

// Interface for parsed Web Vitals data
export interface WebVitalMetric {
    type: 'TTFB' | 'FCP' | 'LCP' | 'FID' | 'CLS' | 'INP';
    value: number;
    page?: string;
    deviceType?: string;
}

// Core Web Vitals thresholds (based on Google's recommendations)
export const WEB_VITALS_THRESHOLDS = {
    TTFB: { good: 800, needsImprovement: 1800 }, // milliseconds
    FCP: { good: 1800, needsImprovement: 3000 }, // milliseconds
    LCP: { good: 2500, needsImprovement: 4000 }, // milliseconds
    FID: { good: 100, needsImprovement: 300 },   // milliseconds
    CLS: { good: 0.1, needsImprovement: 0.25 },  // score
    INP: { good: 200, needsImprovement: 500 },   // milliseconds
} as const;

// Function to determine performance category
function getPerformanceCategory(
    metricType: WebVitalMetric['type'],
    value: number
): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = WEB_VITALS_THRESHOLDS[metricType];

    if (value <= thresholds.good) {
        return 'good';
    } else if (value <= thresholds.needsImprovement) {
        return 'needs-improvement';
    } else {
        return 'poor';
    }
}

// Main function to record Web Vitals metrics
export function recordWebVitalMetric(metric: WebVitalMetric): void {
    const { type, value, page = 'unknown', deviceType = 'unknown' } = metric;
    const labels = { page, device_type: deviceType };
    const metricLabels = { metric_type: type.toLowerCase(), page, device_type: deviceType };

    // Convert milliseconds to seconds for time-based metrics (except CLS which is a score)
    const valueInSeconds = type === 'CLS' ? value : value / 1000;

    // Record in histogram (for distribution analysis)
    const histogram = webVitalsHistograms[type.toLowerCase() as keyof typeof webVitalsHistograms];
    if (histogram) {
        histogram.observe(labels, valueInSeconds);
    }

    // Update current value gauge
    const gauge = webVitalsGauges[type.toLowerCase() as keyof typeof webVitalsGauges];
    if (gauge) {
        gauge.set(labels, valueInSeconds);
    }

    // Increment total counter
    webVitalsCounters.total.inc(metricLabels);

    // Increment performance category counter
    const category = getPerformanceCategory(type, value);
    switch (category) {
        case 'good':
            webVitalsCounters.goodScores.inc(metricLabels);
            break;
        case 'needs-improvement':
            webVitalsCounters.needsImprovementScores.inc(metricLabels);
            break;
        case 'poor':
            webVitalsCounters.poorScores.inc(metricLabels);
            break;
    }

    console.log(`📊 Recorded ${type} metric: ${value}ms (${category}) for page: ${page}`);
}

// Function to record Grafana forwarding metrics
export function recordGrafanaForward(success: boolean): void {
    const status = success ? 'success' : 'error';
    appMetrics.grafanaForwards.inc({ status });
}

// Function to start API request timer
export function startApiTimer(method: string, route: string) {
    const startTime = Date.now();

    return (statusCode: number) => {
        const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        appMetrics.apiRequestDuration.observe(
            { method, route, status_code: statusCode.toString() },
            duration
        );
    };
}

// Export the registry for the /metrics endpoint
export { register };

// Helper function to parse Web Vitals from annotation text
export function parseWebVitalFromText(text: string, tags: string[]): WebVitalMetric | null {
    try {
        // Try to parse JSON format: {"summary":"FCP=1912","id":"...","value":1912,"delta":1912}
        const parsed = JSON.parse(text);
        if (parsed.value && parsed.summary) {
            const metricType = extractMetricTypeFromSummary(parsed.summary);
            if (metricType) {
                return {
                    type: metricType,
                    value: parsed.value,
                    page: extractPageFromTags(tags),
                    deviceType: extractDeviceTypeFromTags(tags),
                };
            }
        }
    } catch {
        // If JSON parsing fails, try to extract from summary in tags or text
        const metricType = extractMetricTypeFromTags(tags);
        if (metricType && text.includes('=')) {
            const valueMatch = text.match(/(\d+(?:\.\d+)?)/);
            if (valueMatch && valueMatch[1]) {
                return {
                    type: metricType,
                    value: parseFloat(valueMatch[1]),
                    page: extractPageFromTags(tags),
                    deviceType: extractDeviceTypeFromTags(tags),
                };
            }
        }
    }

    return null;
}

function extractMetricTypeFromSummary(summary: string): WebVitalMetric['type'] | null {
    const metricMatch = summary.match(/(TTFB|FCP|LCP|FID|CLS|INP)=/);
    return metricMatch ? metricMatch[1] as WebVitalMetric['type'] : null;
}

function extractMetricTypeFromTags(tags: string[]): WebVitalMetric['type'] | null {
    for (const tag of tags) {
        if (['TTFB', 'FCP', 'LCP', 'FID', 'CLS', 'INP'].includes(tag)) {
            return tag as WebVitalMetric['type'];
        }
    }
    return null;
}

function extractPageFromTags(tags: string[]): string {
    const pageTag = tags.find(tag => tag.startsWith('page:') || tag.startsWith('/'));
    return pageTag ? pageTag.replace('page:', '') : 'homepage';
}

function extractDeviceTypeFromTags(tags: string[]): string {
    const deviceTag = tags.find(tag =>
        ['mobile', 'desktop', 'tablet'].includes(tag.toLowerCase())
    );
    return deviceTag ? deviceTag.toLowerCase() : 'unknown';
}