import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { appendRegistration } from '@/lib/sheets';
import { signSession, setSessionCookie } from '@/lib/auth';
import { customAlphabet } from 'nanoid';

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  interests: z.array(z.enum(['indoor','outdoor','accessories','split','spare'])).nonempty("Please select at least one interest"),
});

const nano = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 14);

export async function POST(req: NextRequest) {
  try {
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

    const { fullName, companyName, email, phone, country, interests } = parsed.data;
    const uid = nano();

    const sessionUser = { uid, fullName, email };
    const token = signSession(sessionUser);
    setSessionCookie(token);

    const timestamp = new Date().toISOString();
    await appendRegistration([
      timestamp, 
      uid, 
      fullName, 
      companyName, 
      email, 
      phone, 
      country, 
      interests.join(','), 
      ip, 
      ua
    ]);

    console.log('Registration logged:', { uid, email, interests: interests.join(',') });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Registration failed. Please try again.' 
    }, { status: 500 });
  }
}
