import { useCardChessStore } from '../stores/useCardChessStore';
import { useTwoPlayerCustomTimer } from '@/features/custom/shared/hooks/useTwoPlayerCustomTimer';
export function useCardChessTimer() {
  return useTwoPlayerCustomTimer(useCardChessStore);
}
