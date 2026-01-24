import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/Icons';
import {
  features,
  featureList,
  FEATURE_HEADING,
  FeatureProps
} from '@/pages-content/landing/content/features';

function FeatureCard({ title, description, href }: FeatureProps) {
  const cardContent = (
    <Card
      className={`h-full transition-all ${
        href
          ? 'hover:border-primary/30 group cursor-pointer hover:shadow-md'
          : 'hover:border-primary/30 hover:shadow-md'
      }`}
    >
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>{title}</CardTitle>
          {href && (
            <Icons.arrowUpRight className='text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors' />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {description}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className='block h-full'>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export function Features() {
  return (
    <section
      id='features'
      className='mx-auto max-w-7xl space-y-8 px-4 py-16 sm:py-24 lg:py-32'
    >
      <h2 className='text-center text-2xl font-bold md:text-3xl lg:text-4xl'>
        {FEATURE_HEADING.split(' ')[0]}{' '}
        <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
          {FEATURE_HEADING.split(' ').slice(1).join(' ')}
        </span>
      </h2>

      <div className='flex flex-wrap justify-center gap-2 md:gap-3'>
        {featureList.map((feature: string) => (
          <Badge
            variant='secondary'
            key={feature}
            className='px-3 py-1 text-xs md:text-sm'
          >
            {feature}
          </Badge>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
        {features.map((feature: FeatureProps) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
