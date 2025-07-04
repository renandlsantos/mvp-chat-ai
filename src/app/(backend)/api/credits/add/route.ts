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

    const { amount, type, description } = await req.json();

    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!type || !['refill', 'bonus', 'subscription'].includes(type)) {
      return Response.json(
        { error: 'Invalid credit type' },
        { status: 400 }
      );
    }

    const creditsService = new ServerCreditsService(userId);
    
    // Ensure user has credits initialized
    await creditsService.checkAndCreateUserCredits();
    
    await creditsService.addCredits(amount, {
      type,
      description,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Credits add error:', error);
    return Response.json(
      { error: 'Failed to add credits' },
      { status: 500 }
    );
  }
};