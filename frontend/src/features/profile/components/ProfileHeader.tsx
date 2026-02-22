import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
interface ProfileHeaderProps {
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}
export function ProfileHeader({
  name,
  email,
  image,
  createdAt
}: ProfileHeaderProps) {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';
  const memberSince = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(createdAt);
  return (
    <div className='flex items-center gap-4'>
      <Avatar className='h-16 w-16'>
        <AvatarImage src={image ?? ''} alt={name ?? 'Player'} />
        <AvatarFallback className='text-lg'>{initials}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-bold'>{name ?? 'Anonymous'}</h1>
        <p className='text-muted-foreground text-sm'>{email}</p>
        <Badge variant='secondary' className='w-fit text-xs'>
          Member since {memberSince}
        </Badge>
      </div>
    </div>
  );
}
