'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Popular chess openings database
const openings = [
  {
    id: 'italian',
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description:
      'One of the oldest recorded chess openings, aiming for quick development and control of the center.',
    eco: 'C50'
  },
  {
    id: 'sicilian',
    name: 'Sicilian Defense',
    moves: ['e4', 'c5'],
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    description:
      'The most popular response to e4, fighting for the center asymmetrically.',
    eco: 'B20'
  },
  {
    id: 'french',
    name: 'French Defense',
    moves: ['e4', 'e6'],
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    description:
      'A solid and strategic defense that often leads to closed positions.',
    eco: 'C00'
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    moves: ['e4', 'c6'],
    fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    description:
      'A very solid defense, leading to good pawn structures for Black.',
    eco: 'B10'
  },
  {
    id: 'spanish',
    name: 'Ruy Lopez (Spanish Opening)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    description:
      'Named after a Spanish bishop, this is one of the most popular openings at all levels.',
    eco: 'C60'
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    description:
      'One of the oldest and most respected chess openings, offering the c-pawn for rapid development.',
    eco: 'D06'
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6'],
    fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3',
    description:
      'A hypermodern defense allowing White central control while Black prepares counterplay.',
    eco: 'E60'
  },
  {
    id: 'nimzo-indian',
    name: 'Nimzo-Indian Defense',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    fen: 'rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq - 2 4',
    description:
      'A solid and flexible defense, pinning the c3 knight and controlling the e4 square.',
    eco: 'E20'
  },
  {
    id: 'london',
    name: 'London System',
    moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
    fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 3 3',
    description:
      'A solid system characterized by Bf4, popular at all levels for its reliability.',
    eco: 'D02'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian Defense',
    moves: ['e4', 'd5'],
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2',
    description:
      "An aggressive defense that immediately challenges White's pawn on e4.",
    eco: 'B01'
  },
  {
    id: 'english',
    name: 'English Opening',
    moves: ['c4'],
    fen: 'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1',
    description:
      'A flexible opening that can transpose to many different structures.',
    eco: 'A10'
  },
  {
    id: 'catalan',
    name: 'Catalan Opening',
    moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'],
    fen: 'rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3',
    description:
      "A subtle opening combining elements of the Queen's Gambit and fianchetto.",
    eco: 'E00'
  }
];

export default function OpeningsPage() {
  const [selectedOpening, setSelectedOpening] = useState(openings[0]);

  return (
    <main className='flex min-h-screen flex-col p-6'>
      <div className='mx-auto w-full max-w-7xl space-y-6'>
        <div className='space-y-2 py-8 text-center'>
          <h1 className='text-4xl font-light tracking-wide'>Chess Openings</h1>
          <p className='text-muted-foreground'>
            Learn and practice popular chess openings
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Openings List */}
          <div className='space-y-3 lg:col-span-1'>
            <h2 className='mb-4 text-xl font-medium'>Popular Openings</h2>
            <div className='max-h-[600px] space-y-2 overflow-y-auto pr-2'>
              {openings.map((opening) => (
                <button
                  key={opening.id}
                  onClick={() => setSelectedOpening(opening)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selectedOpening.id === opening.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className='font-medium'>{opening.name}</div>
                  <div className='text-muted-foreground mt-1 text-xs'>
                    ECO: {opening.eco}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Opening Details */}
          <div className='border-border space-y-6 rounded-lg border p-6 lg:col-span-2'>
            <div>
              <h2 className='mb-2 text-2xl font-light'>
                {selectedOpening.name}
              </h2>
              <div className='text-muted-foreground mb-4 text-sm'>
                ECO Code: {selectedOpening.eco}
              </div>
              <p className='text-muted-foreground'>
                {selectedOpening.description}
              </p>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Moves</h3>
              <div className='flex flex-wrap gap-2'>
                {selectedOpening.moves.map((move, index) => (
                  <span
                    key={index}
                    className='bg-secondary text-secondary-foreground rounded-md px-3 py-1 font-mono text-sm'
                  >
                    {Math.floor(index / 2) + 1}
                    {index % 2 === 0 ? '.' : '...'} {move}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Position</h3>
              <div className='bg-muted/30 rounded-lg p-4'>
                <code className='font-mono text-xs break-all'>
                  {selectedOpening.fen}
                </code>
              </div>
            </div>

            <div className='border-border border-t pt-4'>
              <Button size='lg' disabled className='w-full sm:w-auto'>
                Practice This Opening
                <span className='ml-2 text-xs opacity-70'>(Coming Soon)</span>
              </Button>
              <p className='text-muted-foreground mt-3 text-xs'>
                Interactive opening trainer is currently in development. This
                feature will allow you to practice openings with instant
                feedback and variations.
              </p>
            </div>
          </div>
        </div>

        <div className='pt-6 text-center'>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors'
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
