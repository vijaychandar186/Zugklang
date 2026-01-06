import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  features,
  featureList,
  FEATURE_HEADING,
  FeatureProps
} from '@/features/landing/content/features';

export const Features = () => {
  return (
    <section
      id='features'
      className='container space-y-8 py-16 sm:py-24 lg:py-32'
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
            className='px-3 py-1 text-xs transition-all hover:scale-105 md:text-sm'
          >
            {feature}
          </Badge>
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3'>
        {features.map(({ title, description }: FeatureProps) => (
          <Card
            key={title}
            className='hover:border-primary/30 h-full transition-all hover:shadow-md'
          >
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
