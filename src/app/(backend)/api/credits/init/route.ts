import { NextRequest } from 'next/server';

import { getServerConfig } from '@/config/server';
import { getJWTPayload } from '@/libs/next-auth';
import { ServerCreditsService } from '@/services/credits/server';

import { AuthError } from '../../error';

export const runtime = 'nodejs';

export const POST = async (req: NextRequest) => {
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

    const { planType = 'free' } = await req.json();

    const creditsService = new ServerCreditsService(userId);
    const userCredits = await creditsService.checkAndCreateUserCredits(planType);

    return Response.json(userCredits);
  } catch (error) {
    console.error('Credits init error:', error);
    return Response.json(
      { error: 'Failed to initialize user credits' },
      { status: 500 }
    );
  }
};