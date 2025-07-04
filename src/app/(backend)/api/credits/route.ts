import { NextRequest } from 'next/server';

import { getServerConfig } from '@/config/server';
import { JWTPayload } from '@/const/auth';
import { UserModel } from '@/database/models/user';
import { serverDB } from '@/database/server';
import { checkAuthMethod, getJWTPayload } from '@/libs/next-auth';
import { ServerCreditsService } from '@/services/credits/server';

import { AuthError } from '../error';

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

    const creditsService = new ServerCreditsService(userId);
    const userCredits = await creditsService.getUserCredits();

    if (!userCredits) {
      // Auto-create with free plan if not exists
      const newCredits = await creditsService.checkAndCreateUserCredits('free');
      return Response.json(newCredits);
    }

    return Response.json(userCredits);
  } catch (error) {
    console.error('Credits GET error:', error);
    return Response.json(
      { error: 'Failed to fetch user credits' },
      { status: 500 }
    );
  }
};