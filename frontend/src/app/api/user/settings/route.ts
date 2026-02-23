import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { normalizeFlagCode } from '@/features/settings/flags';

const UpdateSettingsSchema = z.object({
  flagCode: z.string().min(2).max(16)
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { flagCode: true, name: true, email: true }
  });

  return Response.json({
    name: user?.name ?? session.user.name ?? 'User',
    email: user?.email ?? session.user.email ?? '',
    flagCode: normalizeFlagCode(user?.flagCode)
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = UpdateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return new Response('Invalid payload', { status: 400 });
  }

  const flagCode = normalizeFlagCode(parsed.data.flagCode);
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { flagCode },
    select: { flagCode: true }
  });

  return Response.json({ flagCode: normalizeFlagCode(user.flagCode) });
}
