'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Chess variants information
const variants = [
  {
    id: 'chess960',
    name: 'Chess960 (Fischer Random)',
    description:
      'Also known as Fischer Random Chess. The starting position is randomized, with pieces on the back rank shuffled. Castling rules are modified to accommodate the random placement. This eliminates opening preparation and emphasizes creativity and understanding.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Similar to standard chess',
    features: [
      'Randomized starting position',
      'Modified castling rules',
      '960 possible positions'
    ]
  },
  {
    id: 'three-check',
    name: 'Three-Check',
    description:
      'Win by giving check three times, or by checkmate. This variant encourages aggressive play and tactical brilliance. Every check counts towards victory, making even defensive positions dangerous.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Moderate',
    features: [
      'Win by 3 checks',
      'Aggressive gameplay',
      'Promotes tactical thinking'
    ]
  },
  {
    id: 'king-of-the-hill',
    name: 'King of the Hill',
    description:
      'Win by moving your king to one of the four central squares (d4, d5, e4, e5), or by checkmate. This variant rewards aggressive king play and creates exciting tactical battles.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Moderate',
    features: [
      'King race to center',
      'Unique winning condition',
      'Active king play'
    ]
  },
  {
    id: 'crazyhouse',
    name: 'Crazyhouse',
    description:
      'Captured pieces can be dropped back on the board under your control. This creates wild, tactical positions with unlimited possibilities. Popularized on online chess platforms.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Complex',
    features: [
      'Drop captured pieces',
      'Extremely tactical',
      'Never-ending possibilities'
    ]
  },
  {
    id: 'atomic',
    name: 'Atomic Chess',
    description:
      "When a piece is captured, both the capturing piece and captured piece explode, destroying all pieces (except pawns) in a 1-square radius. Kings cannot capture. Win by exploding the opponent's king.",
    boardSize: '8x8',
    players: 2,
    difficulty: 'High',
    features: ['Explosion mechanics', 'Unique tactics', 'Kings cannot capture']
  },
  {
    id: 'horde',
    name: 'Horde',
    description:
      'Asymmetric variant where White has 36 pawns and no other pieces, while Black has a standard setup. White wins by checkmating Black; Black wins by capturing all White pawns.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Unique',
    features: [
      'Asymmetric armies',
      '36 vs 16 pieces',
      'Different winning conditions'
    ]
  },
  {
    id: 'racing-kings',
    name: 'Racing Kings',
    description:
      'Both players start on the first two ranks. The goal is to move your king to the 8th rank first. Checks are not allowed. A peaceful, strategic race to the finish.',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Moderate',
    features: ['No checks allowed', 'King race', 'Unique starting position']
  },
  {
    id: 'antichess',
    name: 'Antichess (Losing Chess)',
    description:
      'The goal is to lose all your pieces or be stalemated. Captures are mandatory. The king has no special status and can be captured like any other piece. Turn chess logic upside down!',
    boardSize: '8x8',
    players: 2,
    difficulty: 'Moderate',
    features: ['Lose to win', 'Mandatory captures', 'No king protection']
  }
];

export default function VariantsPage() {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  return (
    <main className='flex min-h-screen flex-col p-6'>
      <div className='mx-auto w-full max-w-7xl space-y-6'>
        <div className='space-y-2 py-8 text-center'>
          <h1 className='text-4xl font-light tracking-wide'>Chess Variants</h1>
          <p className='text-muted-foreground'>
            Explore exciting variations of traditional chess
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Variants List */}
          <div className='space-y-3 lg:col-span-1'>
            <h2 className='mb-4 text-xl font-medium'>Available Variants</h2>
            <div className='max-h-[700px] space-y-2 overflow-y-auto pr-2'>
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selectedVariant.id === variant.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className='font-medium'>{variant.name}</div>
                  <div className='text-muted-foreground mt-1 text-xs'>
                    {variant.players} players • {variant.boardSize}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Variant Details */}
          <div className='border-border space-y-6 rounded-lg border p-6 lg:col-span-2'>
            <div>
              <h2 className='mb-2 text-2xl font-light'>
                {selectedVariant.name}
              </h2>
              <div className='text-muted-foreground mb-4 flex gap-4 text-sm'>
                <span>Board: {selectedVariant.boardSize}</span>
                <span>•</span>
                <span>Players: {selectedVariant.players}</span>
                <span>•</span>
                <span>Difficulty: {selectedVariant.difficulty}</span>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                {selectedVariant.description}
              </p>
            </div>

            <div>
              <h3 className='mb-3 text-lg font-medium'>Key Features</h3>
              <ul className='space-y-2'>
                {selectedVariant.features.map((feature, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <span className='text-primary mt-1'>•</span>
                    <span className='text-muted-foreground'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='border-border space-y-3 border-t pt-4'>
              <Button size='lg' disabled className='w-full sm:w-auto'>
                Play {selectedVariant.name}
                <span className='ml-2 text-xs opacity-70'>(Coming Soon)</span>
              </Button>
              <p className='text-muted-foreground text-xs'>
                Chess variants are currently in development. These will be fully
                playable against the computer or other players once implemented.
                Stay tuned!
              </p>
            </div>

            {selectedVariant.id === 'chess960' && (
              <div className='bg-muted/30 rounded-lg p-4'>
                <h4 className='mb-2 font-medium'>Fun Fact</h4>
                <p className='text-muted-foreground text-sm'>
                  Chess960 was invented by former World Champion Bobby Fischer.
                  He wanted to emphasize creativity and talent over memorization
                  of opening theory.
                </p>
              </div>
            )}
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
