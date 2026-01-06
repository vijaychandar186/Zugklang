import Link from 'next/link';
import {
  ChevronLeft,
  Cpu,
  Microscope,
  Users,
  ArrowUpRight
} from 'lucide-react';

export default function PlayPage() {
  return (
    <main className='bg-background relative flex min-h-screen w-full flex-col overflow-hidden'>
      <div className='from-primary/10 via-background to-background pointer-events-none absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]' />
      <div className='from-primary/5 via-background to-background pointer-events-none absolute right-0 bottom-0 h-full w-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]' />

      <div className='relative z-10 container mx-auto flex max-w-7xl flex-1 flex-col px-4 py-8 md:py-16'>
        <div className='mb-12 space-y-6'>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground group inline-flex items-center text-sm font-medium transition-colors'
          >
            <ChevronLeft className='mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1' />
            Back to Home
          </Link>
          <div className='space-y-2'>
            <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl'>
              Select Game Mode
            </h1>
            <p className='text-muted-foreground max-w-2xl text-lg'>
              Choose your arena. Challenge the computer, play with a friend, or
              dive deep into analysis.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Link href='/play/computer' className='group block h-full'>
            <div className='bg-card/50 border-border hover:border-primary/20 hover:shadow-primary/5 hover:bg-card relative h-full overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8'>
              <div className='absolute top-0 right-0 p-8 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]'>
                <Cpu className='h-40 w-40 -rotate-12 transform' />
              </div>
              <div className='relative z-10 flex h-full flex-col gap-6'>
                <div className='flex items-start justify-between'>
                  <div className='bg-primary/10 text-primary ring-primary/20 w-fit rounded-xl p-3 ring-1'>
                    <Cpu className='h-8 w-8' />
                  </div>
                  <ArrowUpRight className='text-muted-foreground group-hover:text-primary h-5 w-5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                </div>

                <div className='space-y-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Vs Computer
                  </h2>
                  <p className='text-muted-foreground leading-relaxed'>
                    Challenge Stockfish 16 at various difficulty levels. Perfect
                    your opening repertoire and tactical vision.
                  </p>
                </div>

                <div className='text-primary mt-auto flex items-center pt-4 text-sm font-medium'>
                  <span className='underline-offset-4 group-hover:underline'>
                    Play Now
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href='/play/local' className='group block h-full'>
            <div className='bg-card/50 border-border hover:bg-card relative h-full overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 md:p-8'>
              <div className='absolute top-0 right-0 p-8 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]'>
                <Users className='h-40 w-40 -rotate-12 transform' />
              </div>
              <div className='relative z-10 flex h-full flex-col gap-6'>
                <div className='flex items-start justify-between'>
                  <div className='w-fit rounded-xl bg-emerald-500/10 p-3 text-emerald-500 ring-1 ring-emerald-500/20'>
                    <Users className='h-8 w-8' />
                  </div>
                  <ArrowUpRight className='text-muted-foreground h-5 w-5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500' />
                </div>

                <div className='space-y-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Pass and Play
                  </h2>
                  <p className='text-muted-foreground leading-relaxed'>
                    Play locally with a friend on the same device. Take turns
                    and optionally flip the board after each move.
                  </p>
                </div>

                <div className='mt-auto flex items-center pt-4 text-sm font-medium text-emerald-500'>
                  <span className='underline-offset-4 group-hover:underline'>
                    Play Now
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href='/analysis' className='group block h-full'>
            <div className='bg-card/50 border-border hover:bg-card relative h-full overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 md:p-8'>
              <div className='absolute top-0 right-0 p-8 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]'>
                <Microscope className='h-40 w-40 -rotate-12 transform' />
              </div>
              <div className='relative z-10 flex h-full flex-col gap-6'>
                <div className='flex items-start justify-between'>
                  <div className='w-fit rounded-xl bg-blue-500/10 p-3 text-blue-500 ring-1 ring-blue-500/20'>
                    <Microscope className='h-8 w-8' />
                  </div>
                  <ArrowUpRight className='text-muted-foreground h-5 w-5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-500' />
                </div>

                <div className='space-y-2'>
                  <h2 className='text-2xl font-bold tracking-tight'>
                    Analysis Board
                  </h2>
                  <p className='text-muted-foreground leading-relaxed'>
                    Access a fully featured analysis board. Import PGNs,
                    evaluate positions, and study grandmaster games.
                  </p>
                </div>

                <div className='mt-auto flex items-center pt-4 text-sm font-medium text-blue-500'>
                  <span className='underline-offset-4 group-hover:underline'>
                    Start Analysis
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
