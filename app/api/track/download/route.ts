import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { bySlug } from '@/lib/catalogues';
import { appendDownload } from '@/lib/sheets';

export async function GET(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('catalogue') || '';
    const cat = bySlug(slug);
    
    if (!cat) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Catalogue not found' 
      }, { status: 404 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
    const ua = req.headers.get('user-agent') ?? '';
    const timestamp = new Date().toISOString();

    await appendDownload([
      timestamp, 
      session.uid, 
      session.email, 
      cat.slug, 
      cat.title, 
      ip, 
      ua
    ]);

    console.log('Download tracked:', { uid: session.uid, catalogue: cat.slug, title: cat.title });

    // Construct absolute URL for redirect
    const url = new URL(req.url);
    const absoluteFileUrl = new URL(cat.fileUrl, url.origin).toString();

    return NextResponse.redirect(absoluteFileUrl, { status: 302 });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Download failed. Please try again.' 
    }, { status: 500 });
  }
}
