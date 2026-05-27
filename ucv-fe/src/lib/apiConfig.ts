const PRODUCTION_API_URL = 'https://api.ucv.com.vn';

function resolveApiBaseUrl(): string {
    const configured = import.meta.env.VITE_API_URL;

    if (configured === undefined || configured === null) {
        return PRODUCTION_API_URL;
    }

    const trimmed = String(configured).trim();
    if (trimmed === '') {
        return PRODUCTION_API_URL;
    }

    return trimmed.replace(/\/$/, '');
}

export const API_BASE_URL = resolveApiBaseUrl();

/** true khi FE gọi BE local (localhost) — tương ứng DB local qua BE */
export function isLocalApi(): boolean {
    const url = API_BASE_URL.toLowerCase();
    return url.includes('localhost') || url.includes('127.0.0.1');
}

if (import.meta.env.DEV && isLocalApi()) {
    console.info(`[UCV] Frontend API → ${API_BASE_URL} (local)`);
}
