import { NextRequest } from 'next/server';

import { getJWTPayload } from '@/utils/server/jwt';
import { ServerCreditsService } from '@/services/credits/server';

export const runtime = 'nodejs';

export const POST = async (req: NextRequest) => {
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