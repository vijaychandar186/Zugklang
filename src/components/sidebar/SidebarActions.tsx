'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/hooks/stores/useAnalysisStore';

type SidebarActionsProps = {
  moves: string[];
  gameOver: boolean;
  onOpenSettings: () => void;
  onOpenNewGame: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  onAbort: () => void;
  gameStarted: boolean;
};

export function SidebarActions({
  moves,
  gameOver,
  onOpenSettings,
  onOpenNewGame,
  onFlipBoard,
  onResign,
  onAbort,
  gameStarted
}: SidebarActionsProps) {
  const canAbort = moves.length < 4;
  const isGameActive = gameStarted && !gameOver;

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();

  const handleToggleAnalysis = () => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  };

  return (
    <div className='flex items-center gap-1'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' onClick={onOpenSettings}>
            <Icons.settings className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' onClick={onFlipBoard}>
            <Icons.flipBoard className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Flip Board</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isAnalysisOn ? 'default' : 'ghost'}
            size='icon'
            onClick={handleToggleAnalysis}
            disabled={!isInitialized}
          >
            {isAnalysisOn ? (
              <Icons.analyze className='h-4 w-4' />
            ) : (
              <Icons.analyzeOff className='h-4 w-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isAnalysisOn ? 'Turn Off Analysis' : 'Turn On Analysis'}
        </TooltipContent>
      </Tooltip>

      <div className='ml-auto flex items-center gap-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant='ghost'
                size='icon'
                onClick={onOpenNewGame}
                disabled={isGameActive}
              >
                <Icons.newGame className='h-4 w-4' />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {isGameActive ? 'Finish current game first' : 'New Game'}
          </TooltipContent>
        </Tooltip>

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                  disabled={gameOver || moves.length === 0}
                >
                  {canAbort ? (
                    <Icons.abort className='h-4 w-4' />
                  ) : (
                    <Icons.flag className='h-4 w-4' />
                  )}
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {canAbort ? 'Abort Game' : 'Resign Game'}
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {canAbort ? 'Abort Game?' : 'Resign Game?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {canAbort
                  ? 'Are you sure you want to abort? This game will not be counted.'
                  : 'Are you sure you want to resign? This will end the game and count as a loss.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={canAbort ? onAbort : onResign}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                {canAbort ? 'Abort' : 'Resign'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
