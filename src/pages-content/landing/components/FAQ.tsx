import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  FAQList,
  FAQProps,
  FAQ_SUBTITLE
} from '@/pages-content/landing/content/faq';

export function FAQ() {
  return (
    <section id='faq' className='mx-auto max-w-7xl px-4 py-16 sm:py-24'>
      <h2 className='mb-4 text-center text-2xl font-bold md:text-3xl lg:text-4xl'>
        Frequently Asked{' '}
        <span className='from-primary/60 to-primary bg-gradient-to-b bg-clip-text text-transparent'>
          Questions
        </span>
      </h2>
      <p className='text-muted-foreground mb-10 text-center'>{FAQ_SUBTITLE}</p>

      <div className='mx-auto max-w-3xl'>
        <Accordion type='single' collapsible className='w-full space-y-3'>
          {FAQList.map(({ question, answer, value }: FAQProps) => (
            <AccordionItem
              key={value}
              value={value}
              className='bg-card overflow-hidden rounded-lg border px-4'
            >
              <AccordionTrigger className='py-4 text-left text-sm font-medium hover:no-underline'>
                {question}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground pb-4 text-sm leading-relaxed'>
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
