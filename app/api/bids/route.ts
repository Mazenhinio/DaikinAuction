import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { appendBid } from '@/lib/sheets';

const schema = z.object({
  bundleSlug: z.enum(['vrf-indoor','vrf-outdoor','accessories','split','spare','mixed']),
  bidAmount: z.number().min(0.01, "Bid amount must be greater than 0"),
  notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    const ua = req.headers.get('user-agent') ?? '';
    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        ok: false, 
        error: parsed.error.format() 
      }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    await appendBid([
      timestamp, 
      session.uid, 
      session.email, 
      parsed.data.bundleSlug, 
      parsed.data.bidAmount,
      parsed.data.notes ?? '', 
      ip, 
      ua
    ]);

    console.log('Bid logged:', { 
      uid: session.uid, 
      bundle: parsed.data.bundleSlug, 
      amount: parsed.data.bidAmount 
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Bid submission error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Bid submission failed. Please try again.' 
    }, { status: 500 });
  }
}
