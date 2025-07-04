import { NextRequest } from 'next/server';

import { getAppConfig } from '@/envs/app';
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

    const { amount, description, messageId, modelName, tokensUsed } = await req.json();

    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const creditsService = new ServerCreditsService(userId);
    
    // Ensure user has credits initialized
    await creditsService.checkAndCreateUserCredits();
    
    const success = await creditsService.deductCredits(amount, {
      description,
      messageId,
      modelName,
      tokensUsed,
    });

    return Response.json({ success });
  } catch (error) {
    console.error('Credits deduct error:', error);
    return Response.json(
      { error: 'Failed to deduct credits' },
      { status: 500 }
    );
  }
};