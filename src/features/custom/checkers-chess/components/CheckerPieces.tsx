import Image from 'next/image';

const PIECE_KEYS = ['P', 'R', 'N', 'B', 'Q', 'K'] as const;
const COLORS = ['w', 'b'] as const;

function CheckerPiece({ color }: { color: 'w' | 'b' }) {
  const svgPath =
    color === 'w' ? '/checkers/white-large.svg' : '/checkers/black-large.svg';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        zIndex: 10
      }}
    >
      <Image
        src={svgPath}
        alt={`${color === 'w' ? 'White' : 'Black'} checker piece`}
        width={100}
        height={100}
        unoptimized
        draggable={false}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%) scale(0.75)',
          transformOrigin: 'bottom center',
          objectFit: 'contain',
          width: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
}

export function buildCheckerPieces() {
  const pieces: Record<string, () => React.JSX.Element> = {};

  for (const color of COLORS) {
    for (const key of PIECE_KEYS) {
      const pieceKey = `${color}${key}`;
      pieces[pieceKey] = () => <CheckerPiece color={color} />;
    }
  }

  return pieces;
}
