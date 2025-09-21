type Env = {
    NODE_ENV: 'development' | 'test' | 'production';
    REACT_APP_ANALYTICS_URL?: string;
};

let z: any = null;
try {
    // Use runtime require so TypeScript doesn't need 'zod' types installed immediately
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    z = require('zod');
} catch {
    z = null;
}

function coerceNodeEnv(value: any): Env['NODE_ENV'] {
    return value === 'production' || value === 'test' ? value : 'development';
}

function parseWithZod(): Env | null {
    if (!z) return null;
    try {
        const schema = z.object({
            NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
            REACT_APP_ANALYTICS_URL: z.string().url().optional(),
        });
        const result = schema.safeParse({
            NODE_ENV: process.env.NODE_ENV,
            REACT_APP_ANALYTICS_URL: process.env.REACT_APP_ANALYTICS_URL,
        });
        if (result.success) return result.data as Env;
        // eslint-disable-next-line no-console
        console.warn(`Invalid environment variables: ${result.error.toString()}`);
    } catch { }
    return null;
}

const fallback: Env = {
    NODE_ENV: coerceNodeEnv(process.env.NODE_ENV),
    REACT_APP_ANALYTICS_URL: process.env.REACT_APP_ANALYTICS_URL,
};

export const env: Env = parseWithZod() ?? fallback;
