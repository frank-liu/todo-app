type Env = {
    NODE_ENV: 'development' | 'test' | 'production';
    REACT_APP_ANALYTICS_URL?: string;
    REACT_APP_GRAFANA_API_TOKEN?: string;
};

function coerceNodeEnv(value: any): Env['NODE_ENV'] {
    return value === 'production' || value === 'test' ? value : 'development';
}

function isLikelyUrlOrPath(value: string): boolean {
    // Accept absolute http(s) URLs or root-relative paths (e.g., /api/annotations)
    return /^https?:\/\//i.test(value) || value.startsWith('/');
}

function buildEnv(): Env {
    const rawUrl = process.env.REACT_APP_ANALYTICS_URL?.trim();
    const url = rawUrl && isLikelyUrlOrPath(rawUrl) ? rawUrl : undefined;
    if (rawUrl && !url) {
        // eslint-disable-next-line no-console
        console.warn('[env] Ignoring invalid REACT_APP_ANALYTICS_URL:', rawUrl);
    }
    const token = process.env.REACT_APP_GRAFANA_API_TOKEN?.trim();
    return {
        NODE_ENV: coerceNodeEnv(process.env.NODE_ENV),
        REACT_APP_ANALYTICS_URL: url,
        REACT_APP_GRAFANA_API_TOKEN: token || undefined,
    };
}

export const env: Env = buildEnv();
