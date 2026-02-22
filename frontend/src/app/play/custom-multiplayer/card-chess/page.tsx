import type { Metadata } from 'next';
import { CardChessMultiplayerView } from '@/features/custom/card-chess/components/CardChessMultiplayerView';

export const metadata: Metadata = {
  title: 'Card Chess Multiplayer | Zugklang',
  description:
    'Play Card Chess online — get matched with a random opponent or invite a friend.'
};

interface Props {
  searchParams: Promise<{ challenge?: string }>;
}

export default async function CardChessMultiplayerPage({
  searchParams
}: Props) {
  const { challenge } = await searchParams;
  return <CardChessMultiplayerView challengeId={challenge} />;
}
