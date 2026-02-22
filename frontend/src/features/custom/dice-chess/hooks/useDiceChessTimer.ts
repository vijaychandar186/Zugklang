import { useDiceChessStore } from '../stores/useDiceChessStore';
import { useTwoPlayerCustomTimer } from '@/features/custom/shared/hooks/useTwoPlayerCustomTimer';
export function useDiceChessTimer() {
  return useTwoPlayerCustomTimer(useDiceChessStore);
}
