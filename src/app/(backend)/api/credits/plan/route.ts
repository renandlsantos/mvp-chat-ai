import { NextRequest } from 'next/server';

import { getServerConfig } from '@/config/server';
import { getJWTPayload } from '@/libs/next-auth';
import { ServerCreditsService } from '@/services/credits/server';
import { CREDIT_PLANS } from '@/services/credits';

import { AuthError } from '../../error';

export const runtime = 'nodejs';

export const PUT = async (req: NextRequest) => {
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

    const { planType } = await req.json();

    if (!planType || !CREDIT_PLANS.some(plan => plan.id === planType)) {
      return Response.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const creditsService = new ServerCreditsService(userId);
    const updatedCredits = await creditsService.updatePlan(planType);

    return Response.json(updatedCredits);
  } catch (error) {
    console.error('Credits plan update error:', error);
    return Response.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
};