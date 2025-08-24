import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  interests: z.array(z.enum(['indoor','outdoor','accessories','split','spare'])).nonempty("Please select at least one interest"),
});

export async function POST(req: NextRequest) {
  try {
    console.log('Testing registration without Google Sheets...');
    
    const body = await req.json();
    console.log('Received body:', body);

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.log('Validation failed:', parsed.error.format());
      return NextResponse.json({ 
        ok: false, 
        error: 'Validation failed',
        details: parsed.error.format() 
      }, { status: 400 });
    }

    console.log('Validation passed:', parsed.data);

    // Test JWT creation
    const { signSession } = await import('@/lib/auth');
    const { customAlphabet } = await import('nanoid');
    
    const nano = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 14);
    const uid = nano();
    
    console.log('Generated UID:', uid);
    
    const sessionUser = { uid, fullName: parsed.data.fullName, email: parsed.data.email };
    const token = signSession(sessionUser);
    
    console.log('JWT created successfully, length:', token.length);

    return NextResponse.json({ 
      ok: true,
      message: "Registration test successful (without Google Sheets)",
      data: {
        uid,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        tokenLength: token.length
      }
    });

  } catch (error) {
    console.error('Registration test error:', error);
    
    return NextResponse.json({
      ok: false,
      message: "Registration test failed",
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      }
    }, { status: 500 });
  }
}
