import { NextRequest, NextResponse } from 'next/server';
import { checkCredentials, generateAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Login va parolni kiriting' },
        { status: 400 }
      );
    }

    const isValid = checkCredentials(username.trim(), password.trim());

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Login yoki parol noto‘g‘ri' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();

    const response = NextResponse.json({
      success: true,
      message: 'Muvaffaqiyatli tizimga kirildi',
      user: { username },
    });

    // Set secure httpOnly cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 kun
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Tizimga kirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
