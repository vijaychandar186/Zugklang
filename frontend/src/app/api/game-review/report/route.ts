import { NextRequest, NextResponse } from 'next/server';
import analyse from '@/lib/analysis/analysis';
import { checkRateLimit } from '@/lib/redis';
import { auth } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (session?.user?.id) {
      const allowed = await checkRateLimit(
        `rl:game-review:${session.user.id}`,
        5,
        60
      );
      if (!allowed) {
        return NextResponse.json({ message: 'Rate limit exceeded.' }, { status: 429 });
      }
    }
    const body = await req.json();
    const { positions } = body;
    if (!positions) {
      return NextResponse.json(
        { message: 'Missing parameters.' },
        { status: 400 }
      );
    }
    try {
      const results = await analyse(positions);
      return NextResponse.json({ results });
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { message: 'Failed to generate report.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
