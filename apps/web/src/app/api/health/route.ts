import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'NEW BRAND Web Frontend',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      compliance: {
        realMoneyEnabled: process.env.NEXT_PUBLIC_REAL_MONEY_ENABLED === 'true',
        mode: 'REGULATED_DEMO_SIMULATION',
        supportedMarkets: ['MX', 'HT'],
        supportedLocales: ['es', 'fr'],
      },
    },
    { status: 200 },
  );
}

