import { ProfileHeader } from './ProfileHeader';
import { PassportCollection } from './PassportCollection';
import { ProfileInsightsPanel } from './ProfileInsightsPanel';
interface ProfileViewProps {
  user: {
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  ratings: {
    variant: string;
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
  games: {
    variant: string;
    result: string;
    timeControl: unknown;
    whiteUserId: string | null;
    blackUserId: string | null;
    createdAt: Date;
    playedAt: Date | null;
  }[];
  userId: string;
  passportFlags: {
    flagCode: string;
  }[];
}
export function ProfileView({
  user,
  ratings,
  puzzleRating,
  games,
  userId,
  passportFlags
}: ProfileViewProps) {
  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold tracking-tight'>Profile</h1>
        <p className='text-muted-foreground text-sm'>
          Track your progress, ratings, and performance in one place.
        </p>
      </div>

      <ProfileHeader
        name={user.name}
        email={user.email}
        image={user.image}
        createdAt={user.createdAt}
      />

      <ProfileInsightsPanel
        games={games.map((game) => ({
          ...game,
          createdAt: game.createdAt.toISOString(),
          playedAt: game.playedAt ? game.playedAt.toISOString() : null
        }))}
        userId={userId}
        ratings={ratings}
        puzzleRating={puzzleRating}
      />

      <PassportCollection
        collectedFlagCodes={passportFlags.map((entry) => entry.flagCode)}
      />
    </div>
  );
}
