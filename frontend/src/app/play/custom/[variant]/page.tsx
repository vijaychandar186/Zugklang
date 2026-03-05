import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { CardChessView } from '@/features/custom/card-chess/components/CardChessView';
import { DiceChessView } from '@/features/custom/dice-chess/components/DiceChessView';
import { FourPlayerView } from '@/features/custom/four-player/components/FourPlayerView';
import { TriDChessView } from '@/features/custom/tri-d-chess/components/TriDChessView';
import { DEFAULT_PIECE_THEME } from '@/features/chess/config/media-themes';
type CustomVariantSlug = 'card-chess' | 'dice-chess' | 'four-player' | 'tri-d';
const VARIANT_META: Record<
  CustomVariantSlug,
  {
    title: string;
    description: string;
  }
> = {
  'card-chess': {
    title: 'Card Chess | Zugklang',
    description:
      'Draw cards to determine which pieces you can move. Each card rank corresponds to a specific chess piece!'
  },
  'dice-chess': {
    title: 'Dice Chess | Zugklang',
    description:
      'Roll 3 dice to determine which pieces you can move. Capture the enemy King to win!'
  },
  'four-player': {
    title: '4-Player Chess | Zugklang',
    description:
      'Play 4-player chess on a 14×14 board with friends on the same device.'
  },
  'tri-d': {
    title: 'Tri-Dimensional Chess | Zugklang',
    description:
      'Play the Star Trek-inspired Tri-Dimensional Chess: three fixed 4×4 boards and four movable 2×2 attack boards, rendered flat.'
  }
};
function isValidSlug(slug: string): slug is CustomVariantSlug {
  return slug in VARIANT_META;
}
export function generateStaticParams() {
  return (Object.keys(VARIANT_META) as CustomVariantSlug[]).map((variant) => ({
    variant
  }));
}
export async function generateMetadata({
  params
}: {
  params: Promise<{
    variant: string;
  }>;
}): Promise<Metadata> {
  const { variant } = await params;
  if (!isValidSlug(variant)) return {};
  return VARIANT_META[variant];
}
export default async function CustomVariantPage({
  params
}: {
  params: Promise<{
    variant: string;
  }>;
}) {
  const { variant } = await params;
  if (!isValidSlug(variant)) notFound();
  const cookieStore = await cookies();
  const pieceTheme = cookieStore.get('pieceTheme')?.value ?? DEFAULT_PIECE_THEME;
  return (
    <PageContainer scrollable={true}>
      {variant === 'card-chess' && <CardChessView />}
      {variant === 'dice-chess' && <DiceChessView />}
      {variant === 'four-player' && <FourPlayerView />}
      {variant === 'tri-d' && <TriDChessView initialPieceTheme={pieceTheme} />}
    </PageContainer>
  );
}
