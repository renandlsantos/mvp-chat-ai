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