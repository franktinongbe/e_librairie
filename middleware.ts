import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited } from './src/lib/rateLimiter';

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const { limited, remaining, reset } = isRateLimited(String(ip));
  const res = NextResponse.next();

  res.headers.set('x-frame-options', 'DENY');
  res.headers.set('x-content-type-options', 'nosniff');
  res.headers.set('referrer-policy', 'no-referrer');
  res.headers.set('permissions-policy', "geolocation=(), microphone=()");

  if (limited) {
    return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(Math.ceil((reset - Date.now()) / 1000))
      }
    });
  }

  res.headers.set('x-ratelimit-remaining', String(remaining));
  res.headers.set('x-ratelimit-reset', String(reset));
  return res;
}

export const config = {
  matcher: '/api/:path*'
};
