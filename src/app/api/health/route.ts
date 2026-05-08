import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return NextResponse.json({ status: 'error', message: 'DATABASE_URL is not set' }, { status: 503 });
  }

  try {
    await query('SELECT 1');
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      host: new URL(dbUrl).host,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      db: 'failed',
      message: error?.message,
      code: error?.code,
    }, { status: 500 });
  }
}
