'use client';
interface FinishLineOverlayProps {
  boardOrientation: 'white' | 'black';
}
export function FinishLineOverlay({
  boardOrientation
}: FinishLineOverlayProps) {
  const finishLineAtTop = boardOrientation === 'white';
  return (
    <div
      className='pointer-events-none absolute right-0 left-0'
      style={{
        [finishLineAtTop ? 'top' : 'bottom']: 0,
        height: '12.5%',
        background:
          'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 12.5% 50%',
        opacity: 0.12
      }}
    />
  );
}
