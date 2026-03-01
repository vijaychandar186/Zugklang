import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { GameView } from '@/features/game/components/GameView';
import { BOARD_3D_ENABLED_COOKIE } from '@/features/chess/config/board';
import type { ChessVariant } from '@/features/chess/config/variants';
const SLUG_TO_VARIANT: Record<string, ChessVariant> = {
  standard: 'standard',
  atomic: 'atomic',
  antichess: 'antichess',
  'three-check': 'threeCheck',
  'racing-kings': 'racingKings',
  crazyhouse: 'crazyhouse',
  'checkers-chess': 'checkersChess',
  horde: 'horde',
  'fischer-random': 'fischerRandom',
  'king-of-the-hill': 'kingOfTheHill'
};
const VARIANT_META: Record<
  ChessVariant,
  {
    title: string;
    description: string;
  }
> = {
  standard: {
    title: 'Local Game | Zugklang',
    description:
      'Play chess with a friend on the same device. Take turns and enjoy a classic pass-and-play experience.'
  },
  atomic: {
    title: 'Atomic Chess Local | Zugklang',
    description:
      'Play Atomic Chess with a friend on the same device. Captures cause explosions that destroy surrounding pieces!'
  },
  antichess: {
    title: 'Antichess Local | Zugklang',
    description:
      'Play Antichess with a friend on the same device. Lose all your pieces to win!'
  },
  threeCheck: {
    title: 'Three-Check Local | Zugklang',
    description:
      'Play Three-Check with a friend on the same device. Give three checks to win!'
  },
  racingKings: {
    title: 'Racing Kings Local | Zugklang',
    description:
      'Play Racing Kings with a friend on the same device. Race your king to the eighth rank to win!'
  },
  crazyhouse: {
    title: 'Crazyhouse Local | Zugklang',
    description:
      'Play Crazyhouse with a friend on the same device. Captured pieces switch sides and can be dropped back!'
  },
  checkersChess: {
    title: 'Chess with Checkers Local | Zugklang',
    description:
      'Play chess with checkers pieces locally. All pieces look like checkers but move as regular chess pieces!'
  },
  horde: {
    title: 'Horde Chess Local | Zugklang',
    description:
      'Play Horde Chess with a friend on the same device. A massive pawn army vs a full set of pieces!'
  },
  fischerRandom: {
    title: 'Fischer Random Local | Zugklang',
    description:
      'Play Fischer Random (Chess960) with a friend on the same device. Experience chess with randomized starting positions.'
  },
  kingOfTheHill: {
    title: 'King of the Hill Local | Zugklang',
    description:
      'Play King of the Hill with a friend on the same device. Get your king to the center to win!'
  }
};
export function generateStaticParams() {
  return Object.keys(SLUG_TO_VARIANT).map((variant) => ({ variant }));
}
export async function generateMetadata({
  params
}: {
  params: Promise<{
    variant: string;
  }>;
}): Promise<Metadata> {
  const { variant: slug } = await params;
  const variant = SLUG_TO_VARIANT[slug];
  if (!variant) return {};
  return VARIANT_META[variant];
}
export default async function LocalVariantPage({
  params
}: {
  params: Promise<{
    variant: string;
  }>;
}) {
  const { variant: slug } = await params;
  const variant = SLUG_TO_VARIANT[slug];
  if (!variant) notFound();
  const cookieStore = await cookies();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  return (
    <PageContainer scrollable={true}>
      <GameView
        gameType='local'
        initialBoard3dEnabled={board3dEnabled}
        variant={variant}
      />
    </PageContainer>
  );
}
