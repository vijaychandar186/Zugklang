import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { MultiplayerGameView } from '@/features/multiplayer/components/MultiplayerGameView';
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
    title: 'Standard Chess — Online | Zugklang',
    description: 'Play standard chess online against a random opponent.'
  },
  atomic: {
    title: 'Atomic Chess — Online | Zugklang',
    description: 'Play Atomic Chess online. Captures cause explosions!'
  },
  antichess: {
    title: 'Antichess — Online | Zugklang',
    description: 'Play Antichess online. Lose all your pieces to win!'
  },
  threeCheck: {
    title: 'Three-Check — Online | Zugklang',
    description: 'Play Three-Check online. Give three checks to win!'
  },
  racingKings: {
    title: 'Racing Kings — Online | Zugklang',
    description: 'Play Racing Kings online. Race your king to the eighth rank!'
  },
  crazyhouse: {
    title: 'Crazyhouse — Online | Zugklang',
    description:
      'Play Crazyhouse online. Drop captured pieces back on the board!'
  },
  checkersChess: {
    title: 'Chess with Checkers — Online | Zugklang',
    description:
      'Play Chess with Checkers online. Chess pieces that look like checkers!'
  },
  horde: {
    title: 'Horde Chess — Online | Zugklang',
    description: 'Play Horde Chess online. Pawn army vs pieces!'
  },
  fischerRandom: {
    title: 'Fischer Random — Online | Zugklang',
    description:
      'Play Fischer Random (Chess960) online against a random opponent.'
  },
  kingOfTheHill: {
    title: 'King of the Hill — Online | Zugklang',
    description: 'Play King of the Hill online. Get your king to the center!'
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
export default async function MultiplayerVariantPage({
  params,
  searchParams
}: {
  params: Promise<{
    variant: string;
  }>;
  searchParams: Promise<{
    challenge?: string;
  }>;
}) {
  const [{ variant: slug }, { challenge }, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies()
  ]);
  const variant = SLUG_TO_VARIANT[slug];
  if (!variant) notFound();
  const board3dEnabled =
    cookieStore.get(BOARD_3D_ENABLED_COOKIE)?.value === 'true';
  return (
    <PageContainer scrollable={true}>
      <MultiplayerGameView
        variant={variant}
        initialBoard3dEnabled={board3dEnabled}
        challengeId={challenge}
      />
    </PageContainer>
  );
}
