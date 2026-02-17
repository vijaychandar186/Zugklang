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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
          width: '75%',
          height: '75%',
          objectFit: 'contain',
          marginTop: '15%'
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
