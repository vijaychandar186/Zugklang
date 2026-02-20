import { ProfileHeader } from './ProfileHeader';
import { StatsGrid } from './StatsGrid';
import { RatingsTable } from './RatingsTable';
import { RecentGamesTable } from './RecentGamesTable';

interface ProfileViewProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  ratings: {
    variant: string;
    rating: number;
    rd: number;
    gameCount: number;
  }[];
  recentGames: {
    id: string;
    variant: string;
    gameType: string;
    result: string;
    resultReason: string;
    moveCount: number;
    createdAt: Date;
    whiteUserId: string | null;
    blackUserId: string | null;
    white: { name: string | null } | null;
    black: { name: string | null } | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
  }[];
  stats: {
    wins: number;
    losses: number;
    draws: number;
    total: number;
  };
  userId: string;
}

export function ProfileView({
  user,
  ratings,
  recentGames,
  stats,
  userId
}: ProfileViewProps) {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8'>
      <ProfileHeader
        name={user.name}
        email={user.email}
        image={user.image}
        createdAt={user.createdAt}
      />
      <StatsGrid
        wins={stats.wins}
        losses={stats.losses}
        draws={stats.draws}
        total={stats.total}
      />
      <RatingsTable ratings={ratings} />
      <RecentGamesTable games={recentGames} userId={userId} />
    </div>
  );
}
