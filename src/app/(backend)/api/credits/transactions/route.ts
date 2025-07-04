import { NextRequest } from 'next/server';

import { getServerConfig } from '@/config/server';
import { getJWTPayload } from '@/libs/next-auth';
import { ServerCreditsService } from '@/services/credits/server';

import { AuthError } from '../../error';

export const runtime = 'nodejs';

export const GET = async (req: NextRequest) => {
  const { ACCESS_CODE } = getServerConfig();

  try {
    const payload = await getJWTPayload(req);

    if (!payload) {
      throw new AuthError(1, 'Unauthorized');
    }

    const userId = payload.userId || payload.id;
    if (!userId) {
      throw new AuthError(1, 'User ID not found');
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