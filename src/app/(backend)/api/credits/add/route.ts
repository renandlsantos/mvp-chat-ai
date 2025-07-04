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
      description,
      type,
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