import { NextResponse } from 'next/server';

// Global cache for development testing of fake payment
const globalAny = global;
globalAny.paymentSessions = globalAny.paymentSessions || {};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sid = searchParams.get('sid');
  
  if (!sid) {
    return NextResponse.json({ paid: false });
  }

  return NextResponse.json({ paid: !!globalAny.paymentSessions[sid] });
}
