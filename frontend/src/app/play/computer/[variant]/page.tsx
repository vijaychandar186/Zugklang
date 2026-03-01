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
    title: 'Play vs Computer | Zugklang',
    description:
      'Challenge Stockfish 18 at various difficulty levels. Test your chess skills against one of the strongest engines.'
  },
  atomic: {
    title: 'Atomic Chess vs Computer | Zugklang',
    description:
      'Play Atomic Chess against Fairy-Stockfish. Captures cause explosions that destroy surrounding pieces!'
  },
  antichess: {
    title: 'Antichess vs Computer | Zugklang',
    description:
      'Play Antichess against Fairy-Stockfish. Lose all your pieces to win!'
  },
  threeCheck: {
    title: 'Three-Check vs Computer | Zugklang',
    description:
      'Play Three-Check against Fairy-Stockfish. Give three checks to win!'
  },
  racingKings: {
    title: 'Racing Kings vs Computer | Zugklang',
    description:
      'Play Racing Kings against Fairy-Stockfish. Race your king to the eighth rank to win!'
  },
  crazyhouse: {
    title: 'Crazyhouse vs Computer | Zugklang',
    description:
      'Play Crazyhouse against Fairy-Stockfish. Captured pieces switch sides and can be dropped back!'
  },
  checkersChess: {
    title: 'Chess with Checkers vs Computer | Zugklang',
    description:
      'Play chess with checkers pieces against Stockfish. All pieces look like checkers but move as regular chess pieces!'
  },
  horde: {
    title: 'Horde Chess vs Computer | Zugklang',
    description:
      'Play Horde Chess against Fairy-Stockfish. A massive pawn army vs a full set of pieces!'
  },
  fischerRandom: {
    title: 'Fischer Random vs Computer | Zugklang',
    description:
      'Play Fischer Random (Chess960) against Stockfish. Test your skills without opening preparation.'
  },
  kingOfTheHill: {
    title: 'King of the Hill vs Computer | Zugklang',
    description:
      'Play King of the Hill against Fairy-Stockfish. Get your king to the center to win!'
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
export default async function ComputerVariantPage({
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
  const playAs = cookieStore.get('playAs')?.value as
    | 'white'
    | 'black'
    | undefined;
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  return (
    <PageContainer scrollable={true}>
      <GameView
        gameType='computer'
        serverOrientation={playAs}
        initialBoard3dEnabled={board3dEnabled}
        variant={variant}
      />
    </PageContainer>
  );
}
