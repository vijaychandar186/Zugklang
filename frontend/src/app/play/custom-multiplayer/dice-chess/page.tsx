import type { Metadata } from 'next';
import { DiceChessMultiplayerView } from '@/features/custom/dice-chess/components/DiceChessMultiplayerView';

export const metadata: Metadata = {
  title: 'Dice Chess Multiplayer | Zugklang',
  description:
    'Play Dice Chess online — get matched with a random opponent or invite a friend.'
};

interface Props {
  searchParams: Promise<{ challenge?: string }>;
}

export default async function DiceChessMultiplayerPage({
  searchParams
}: Props) {
  const { challenge } = await searchParams;
  return <DiceChessMultiplayerView challengeId={challenge} />;
}
