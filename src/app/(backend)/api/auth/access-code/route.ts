import { NextRequest, NextResponse } from 'next/server';

import { appEnv } from '@/envs/app';

export const POST = async (req: NextRequest) => {
  try {
    const { code } = await req.json();
    
    const validCodes = appEnv.ACCESS_CODES || [];
    
    if (!code || !validCodes.includes(code)) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 401 }
      );
    }
    
    const response = NextResponse.json({ success: true });
    
    // Set cookie
    response.cookies.set('lobe-access-code', code, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error('Access code verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};