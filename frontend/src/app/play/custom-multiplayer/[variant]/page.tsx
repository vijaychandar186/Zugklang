import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CardChessMultiplayerView } from '@/features/custom/card-chess/components/CardChessMultiplayerView';
import { DiceChessMultiplayerView } from '@/features/custom/dice-chess/components/DiceChessMultiplayerView';
import { FourPlayerMultiplayerView } from '@/features/custom/four-player/components/FourPlayerMultiplayerView';
type CustomMultiplayerSlug = 'card-chess' | 'dice-chess' | 'four-player';
const VARIANT_META: Record<
  CustomMultiplayerSlug,
  {
    title: string;
    description: string;
  }
> = {
  'card-chess': {
    title: 'Card Chess Multiplayer | Zugklang',
    description:
      'Play Card Chess online — get matched with a random opponent or invite a friend.'
  },
  'dice-chess': {
    title: 'Dice Chess Multiplayer | Zugklang',
    description:
      'Play Dice Chess online — get matched with a random opponent or invite a friend.'
  },
  'four-player': {
    title: 'Four Player Multiplayer | Zugklang',
    description:
      'Play Four Player Chess online in a shared lobby with leader-controlled game start.'
  }
};
function isValidSlug(slug: string): slug is CustomMultiplayerSlug {
  return slug in VARIANT_META;
}
export function generateStaticParams() {
  return (Object.keys(VARIANT_META) as CustomMultiplayerSlug[]).map(
    (variant) => ({ variant })
  );
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
export default async function CustomMultiplayerVariantPage({
  params,
  searchParams
}: {
  params: Promise<{
    variant: string;
  }>;
  searchParams: Promise<{
    challenge?: string;
    lobby?: string;
  }>;
}) {
  const [{ variant }, { challenge, lobby }] = await Promise.all([
    params,
    searchParams
  ]);
  if (!isValidSlug(variant)) notFound();
  if (variant === 'card-chess')
    return <CardChessMultiplayerView challengeId={challenge} />;
  if (variant === 'dice-chess')
    return <DiceChessMultiplayerView challengeId={challenge} />;
  return <FourPlayerMultiplayerView lobbyId={lobby} />;
}
