import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { SessionUser } from '@/types/events';

const COOKIE_NAME = 'session';
const SECRET = process.env.JWT_SECRET!;

export const signSession = (user: SessionUser) =>
  jwt.sign(user, SECRET, { expiresIn: '30d' });

export const setSessionCookie = (token: string) => {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const getSession = (req: NextRequest): SessionUser | null => {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try { 
    return jwt.verify(token, SECRET) as SessionUser; 
  } catch { 
    return null; 
  }
};

// For server components - read from cookies()
export const getServerSession = async (): Promise<SessionUser | null> => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
};
