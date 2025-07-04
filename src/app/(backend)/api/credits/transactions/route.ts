import { NextRequest } from 'next/server';

import { getJWTPayload } from '@/utils/server/jwt';
import { ServerCreditsService } from '@/services/credits/server';

export const runtime = 'nodejs';

export const GET = async (req: NextRequest) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const payload = await getJWTPayload(token);

    if (!payload) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = payload.userId || payload.id;
    if (!userId) {
      return Response.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const creditsService = new ServerCreditsService(userId);
    const transactions = await creditsService.getTransactionHistory(limit);

    return Response.json(transactions);
  } catch (error) {
    console.error('Credits transactions error:', error);
    return Response.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
};