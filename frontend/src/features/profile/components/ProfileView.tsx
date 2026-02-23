import { ProfileHeader } from './ProfileHeader';
import { StatsGrid } from './StatsGrid';
import { RatingsTable } from './RatingsTable';
import { RecentGamesTable } from './RecentGamesTable';
import { PassportCollection } from './PassportCollection';
interface ProfileViewProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  ratings: {
    category: string;
    rating: number;
    rd: number;
    gameCount: number;
  }[];
  puzzleRating: {
    rating: number;
    rd: number;
    gameCount: number;
  } | null;
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
    white: {
      name: string | null;
    } | null;
    black: {
      name: string | null;
    } | null;
    whiteRatingDelta: number | null;
    blackRatingDelta: number | null;
  }[];
  userId: string;
  passportFlags: {
    flagCode: string;
  }[];
}
function computeStats(userId: string, games: ProfileViewProps['recentGames']) {
  let wins = 0,
    losses = 0,
    draws = 0;
  for (const game of games) {
    if (game.result === '*') continue;
    const isWhite = game.whiteUserId === userId;
    if (game.result === '1/2-1/2') {
      draws++;
    } else if (
      (game.result === '1-0' && isWhite) ||
      (game.result === '0-1' && !isWhite)
    ) {
      wins++;
    } else {
      losses++;
    }
  }
  return {
    wins,
    losses,
    draws,
    total: games.filter((g) => g.result !== '*').length
  };
}
export function ProfileView({
  user,
  ratings,
  puzzleRating,
  recentGames,
  userId,
  passportFlags
}: ProfileViewProps) {
  const stats = computeStats(userId, recentGames);
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
      <PassportCollection
        collectedFlagCodes={passportFlags.map((entry) => entry.flagCode)}
      />
      <RatingsTable ratings={ratings} puzzleRating={puzzleRating} />
      <RecentGamesTable games={recentGames} userId={userId} />
    </div>
  );
}
