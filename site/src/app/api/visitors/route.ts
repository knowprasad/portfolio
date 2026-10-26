import { createHmac, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig, safeAppOrigin } from '@/lib/auth-config';

async function total(visitorHash?: string) {
  const config = authConfig();
  if (!config) return null;
  const writeKey = process.env.VISITOR_WRITE_KEY;
  const record = Boolean(visitorHash && writeKey);
  try {
  const response = await fetch(`${config.url}/rest/v1/rpc/${record ? 'record_site_visit' : 'site_visitor_total'}`, {
    method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(5000),
    headers: { apikey: config.key, 'Content-Type': 'application/json' },
    body: JSON.stringify(record ? { visitor_hash: visitorHash, write_key: writeKey } : {}),
  });
  if (!response.ok) return null;
  const value: unknown = await response.json();
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
  } catch { return null; }
}
export async function GET() {
  return NextResponse.json({ count: await total() }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== safeAppOrigin(origin) || Number(request.headers.get('content-length') || 0) > 0) return new NextResponse(null, { status: 403 });
  const key = process.env.VISITOR_WRITE_KEY;
  const enabled = process.env.VISITOR_COUNT_ENABLED === 'true';
  const bot = /bot|crawler|spider|headless|playwright/i.test(request.headers.get('user-agent') || '');
  if (!key || !enabled || bot) return NextResponse.json({ count: await total() }, { headers: { 'Cache-Control': 'no-store' } });
  const existing = request.cookies.get('portfolio-visitor')?.value;
  const id = existing && /^[a-f0-9-]{36}$/.test(existing) ? existing : randomUUID();
  const hash = createHmac('sha256', key).update(id).digest('hex');
  const count = await total(hash);
  const response = NextResponse.json({ count }, { headers: { 'Cache-Control': 'private, no-store' } });
  if (count !== null) response.cookies.set('portfolio-visitor', id, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 31536000 });
  return response;
}
