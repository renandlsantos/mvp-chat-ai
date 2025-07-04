import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { 
      message: 'This feature is temporarily disabled in minimal build mode',
      reason: 'To reduce memory usage during deployment',
      status: 'disabled'
    },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      message: 'This feature is temporarily disabled in minimal build mode',
      reason: 'To reduce memory usage during deployment',
      status: 'disabled'
    },
    { status: 503 }
  );
}