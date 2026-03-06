import { NextRequest } from 'next/server';

// In-memory store for rate limiting (Note: This will reset on server restarts)
// For a production environment with many users, use Redis (e.g., Upstash) for persistence.
const rateLimitStore = new Map<string, { count: number; lastRequest: number }>();

interface RateLimitConfig {
    limit: number;
    windowMs: number;
}

export async function rateLimit(
    request: NextRequest,
    config: RateLimitConfig = { limit: 10, windowMs: 60 * 1000 } // Default: 10 requests per minute
) {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userData = rateLimitStore.get(ip) || { count: 0, lastRequest: now };

    // Reset count if window has passed
    if (now - userData.lastRequest > config.windowMs) {
        userData.count = 0;
        userData.lastRequest = now;
    }

    userData.count++;
    rateLimitStore.set(ip, userData);

    if (userData.count > config.limit) {
        return {
            isLimited: true,
            remaining: 0,
        };
    }

    return {
        isLimited: false,
        remaining: config.limit - userData.count,
    };
}
