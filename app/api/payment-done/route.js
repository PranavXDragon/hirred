import { NextResponse } from 'next/server';

const globalAny = global;
globalAny.paymentSessions = globalAny.paymentSessions || {};

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const sid = searchParams.get('sid');
  
  if (sid) {
    globalAny.paymentSessions[sid] = true;
  }
  
  return NextResponse.json({ success: true });
}
