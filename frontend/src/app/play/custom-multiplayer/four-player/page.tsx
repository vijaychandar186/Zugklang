import type { Metadata } from 'next';
import { FourPlayerMultiplayerView } from '@/features/custom/four-player/components/FourPlayerMultiplayerView';

export const metadata: Metadata = {
  title: 'Four Player Multiplayer | Zugklang',
  description:
    'Play Four Player Chess online in a shared lobby with leader-controlled game start.'
};

interface Props {
  searchParams: Promise<{ lobby?: string }>;
}

export default async function FourPlayerMultiplayerPage({
  searchParams
}: Props) {
  const { lobby } = await searchParams;
  return <FourPlayerMultiplayerView lobbyId={lobby} />;
}
