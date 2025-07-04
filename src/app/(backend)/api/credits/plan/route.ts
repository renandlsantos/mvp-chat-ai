import { NextRequest } from 'next/server';

import { getJWTPayload } from '@/utils/server/jwt';
import { ServerCreditsService } from '@/services/credits/server';
import { CREDIT_PLANS } from '@/services/credits';

export const runtime = 'nodejs';

export const PUT = async (req: NextRequest) => {
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