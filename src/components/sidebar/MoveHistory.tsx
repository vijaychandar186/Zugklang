'use client';

type MoveHistoryProps = {
  moves: string[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

export function MoveHistory({
  moves,
  viewingIndex,
  onMoveClick
}: MoveHistoryProps) {
  if (moves.length === 0) {
    return (
      <p className='text-muted-foreground py-4 text-center text-sm'>
        No moves yet
      </p>
    );
  }

  return (
    <ol className='space-y-1'>
      {moves.map(
        (move, index) =>
          index % 2 === 0 && (
            <li key={index / 2} className='flex items-center text-sm'>
              <span className='text-muted-foreground w-6'>
                {index / 2 + 1}.
              </span>
              <button
                onClick={() => onMoveClick(index)}
                className='hover:bg-muted -ml-1 w-16 cursor-pointer rounded px-1 text-left font-mono'
                style={{
                  color: 'var(--move-white)',
                  backgroundColor:
                    viewingIndex === index + 1
                      ? 'var(--move-white-active)'
                      : undefined
                }}
              >
                {move}
              </button>
              {index + 1 < moves.length && (
                <button
                  onClick={() => onMoveClick(index + 1)}
                  className='hover:bg-muted cursor-pointer rounded px-1 text-left font-mono'
                  style={{
                    color: 'var(--move-black)',
                    backgroundColor:
                      viewingIndex === index + 2
                        ? 'var(--move-black-active)'
                        : undefined
                  }}
                >
                  {moves[index + 1]}
                </button>
              )}
            </li>
          )
      )}
    </ol>
  );
}
