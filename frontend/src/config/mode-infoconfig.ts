import type { InfobarContent } from '@/components/ui/infobar';

type InfoEntry = {
  objective: string;
  rules: string[];
  tips?: string[];
};

const MODE_INFO_BY_HREF: Record<string, InfoEntry> = {
  '/play/computer': {
    objective:
      'Play against the engine and improve accuracy, tactics, and endgame technique.',
    rules: [
      'Select a variant and difficulty before starting.',
      'Game follows the selected variant rules.',
      'Results are saved after the game ends.'
    ]
  },
  '/play/local': {
    objective: 'Play two-player games on one device.',
    rules: [
      'Both players share the same board and controls.',
      'Use board orientation and clock settings before starting.',
      'Variant rules apply based on selected mode.'
    ]
  },
  '/play/multiplayer': {
    objective: 'Get matched online and play live against another player.',
    rules: [
      'Matchmaking pairs you with a random opponent in the selected variant.',
      'Move timer and reconnect behavior depend on current time control.',
      'Game result is finalized when win/loss/draw conditions are met.'
    ]
  },
  '/play/custom': {
    objective: 'Play non-standard game formats with custom mechanics.',
    rules: [
      'Each custom mode has its own objective and special mechanics.',
      'Standard chess assumptions may not apply.',
      'Read the mode guide before starting.'
    ]
  },
  '/play/custom-multiplayer': {
    objective:
      'Get matched online and play Dice Chess or Card Chess live against another player.',
    rules: [
      'Matchmaking and challenge links work identically to standard multiplayer.',
      'The dice roll or card draw is enforced client-side for the active player each turn.',
      'Illegal chess moves are rejected by the server regardless of dice or card result.'
    ],
    tips: [
      'Use "Play with Friend" in the matchmaking dialog to generate a shareable invite link.',
      'Rejoin is supported — if you disconnect, the game waits 30 seconds before ending.'
    ]
  },
  '/play/custom-multiplayer/dice-chess': {
    objective:
      'Win by checkmating your opponent while playing under dice constraints.',
    rules: [
      'Roll 3 dice at the start of your turn — each shows a piece type.',
      'You may only move a piece whose type appears on a valid (highlighted) die.',
      'If none of the rolled pieces have legal moves, the dice re-roll automatically.'
    ],
    tips: [
      'Highlighted squares show which pieces are currently movable.',
      'Plan ahead for rolls — have multiple piece types in play to stay flexible.'
    ]
  },
  '/play/custom-multiplayer/card-chess': {
    objective:
      'Win by checkmating your opponent while playing under card constraints.',
    rules: [
      'Draw a card at the start of your turn — the rank maps to a specific piece.',
      'You may only move the piece indicated by your drawn card.',
      'If the drawn card has no legal moves, another card is drawn automatically.',
      'When in check, you may draw up to 5 cards; failing all 5 results in a loss.'
    ],
    tips: [
      'The card deck is independent per player — you each manage your own draws.',
      'Keep all your pieces active to minimise the chance of a dead draw.'
    ]
  },
  '/play/computer/standard': {
    objective: 'Checkmate the engine in classic chess.',
    rules: [
      'Normal chess rules apply.',
      'Win by checkmate, resignation, or timeout.'
    ]
  },
  '/play/local/standard': {
    objective: 'Classic over-the-board chess on one device.',
    rules: ['Normal chess rules apply.', 'Play alternates by turn.']
  },
  '/play/multiplayer/standard': {
    objective: 'Beat your online opponent in standard chess.',
    rules: [
      'Normal chess rules apply.',
      'Timer and disconnection rules apply online.'
    ]
  },
  '/play/computer/fischer-random': {
    objective: 'Win in Chess960 without relying on opening theory.',
    rules: [
      'Back-rank pieces are randomized with legal Chess960 constraints.',
      'Castling is legal but follows Chess960 castling behavior.'
    ]
  },
  '/play/local/fischer-random': {
    objective: 'Play local Chess960 from randomized starting positions.',
    rules: [
      'Random back-rank setup each game.',
      'Chess960 castling behavior applies.'
    ]
  },
  '/play/multiplayer/fischer-random': {
    objective: 'Play online Chess960 with symmetrical randomized starts.',
    rules: [
      'Both players receive the same randomized setup.',
      'Chess960 castling behavior applies.'
    ]
  },
  '/play/computer/atomic': {
    objective: 'Win by checkmating or exploding key enemy pieces.',
    rules: [
      'Captures create an explosion on adjacent squares.',
      'Kings may not capture into explosion range.'
    ]
  },
  '/play/local/atomic': {
    objective: 'Outplay your opponent with explosive captures.',
    rules: [
      'Captures explode adjacent non-pawn pieces.',
      'King safety is changed by explosion zones.'
    ]
  },
  '/play/multiplayer/atomic': {
    objective: 'Win online in the tactical Atomic variant.',
    rules: [
      'Explosion capture rule applies every move.',
      'Standard online timing rules apply.'
    ]
  },
  '/play/computer/racing-kings': {
    objective: 'Reach the 8th rank with your king first.',
    rules: [
      'Checks are not part of gameplay.',
      'First king to finish the race wins.'
    ]
  },
  '/play/local/racing-kings': {
    objective: 'Race your king to the back rank before your opponent.',
    rules: [
      'No check/checkmate mechanics.',
      'Movement strategy focuses on king racing.'
    ]
  },
  '/play/multiplayer/racing-kings': {
    objective: 'Win the king race online.',
    rules: ['No check rule in this variant.', 'First valid king finish wins.']
  },
  '/play/computer/horde': {
    objective: 'Horde side wins by eliminating all defending pieces.',
    rules: [
      'One side starts with a large pawn horde.',
      'Defending side starts with a regular army.'
    ]
  },
  '/play/local/horde': {
    objective: 'Play asymmetrical horde-vs-army chess locally.',
    rules: [
      'Asymmetric starting position.',
      'Win conditions follow Horde variant rules.'
    ]
  },
  '/play/multiplayer/horde': {
    objective: 'Play Horde online with asymmetric sides.',
    rules: [
      'One player controls the horde side.',
      'Online game timing and result rules apply.'
    ]
  },
  '/play/computer/three-check': {
    objective: 'Deliver three checks to win.',
    rules: [
      'Third successful check ends the game.',
      'Normal checkmate rules still apply.'
    ]
  },
  '/play/local/three-check': {
    objective: 'Win by reaching three total checks first.',
    rules: [
      'Check count is tracked during the game.',
      'Third check can end the game immediately.'
    ]
  },
  '/play/multiplayer/three-check': {
    objective: 'Deliver three checks before your online opponent.',
    rules: [
      'Live check counter decides alternate win condition.',
      'Online timer rules apply.'
    ]
  },
  '/play/computer/antichess': {
    objective: 'Get rid of all your pieces to win.',
    rules: [
      'Captures are mandatory when available.',
      'Check and checkmate are not win conditions.'
    ]
  },
  '/play/local/antichess': {
    objective: 'Force your own pieces to be captured first.',
    rules: [
      'You must capture if any capture exists.',
      'Lose all pieces to win the game.'
    ]
  },
  '/play/multiplayer/antichess': {
    objective: 'Beat your opponent by losing material first.',
    rules: [
      'Mandatory-capture rule applies.',
      'Online timing behavior is unchanged.'
    ]
  },
  '/play/computer/king-of-the-hill': {
    objective: 'Move your king to one of the four center squares.',
    rules: [
      'Center occupation by king is an immediate win condition.',
      'Checkmate still also wins.'
    ]
  },
  '/play/local/king-of-the-hill': {
    objective: 'Control the center with your king to win.',
    rules: [
      'Central king placement can end game immediately.',
      'Standard move rules still apply.'
    ]
  },
  '/play/multiplayer/king-of-the-hill': {
    objective: 'Reach center with your king before opponent online.',
    rules: [
      'Central king objective active.',
      'Online timer and disconnect policies apply.'
    ]
  },
  '/play/computer/crazyhouse': {
    objective: 'Win with drops and tactical recycling of captured pieces.',
    rules: [
      'Captured pieces switch side and go to your pocket.',
      'Pocket pieces can be dropped on legal empty squares.'
    ]
  },
  '/play/local/crazyhouse': {
    objective: 'Use pocket drops to create attacks and defenses.',
    rules: [
      'Captured pieces become droppable resources.',
      'Drop legality follows Crazyhouse rules.'
    ]
  },
  '/play/multiplayer/crazyhouse': {
    objective: 'Outplay opponents online with pocket mechanics.',
    rules: [
      'Live pocket management is critical.',
      'Drops are legal moves within variant rules.'
    ]
  },
  '/play/computer/checkers-chess': {
    objective: 'Play chess with checkers-style piece visuals.',
    rules: [
      'Movement follows chess rules.',
      'Only visual representation is altered.'
    ]
  },
  '/play/local/checkers-chess': {
    objective: 'Local chess with checkers-inspired visuals.',
    rules: [
      'Chess movement and rules remain unchanged.',
      'Piece art style is checkers-themed.'
    ]
  },
  '/play/multiplayer/checkers-chess': {
    objective: 'Online chess with alternative checkers look.',
    rules: [
      'Gameplay rules are standard chess.',
      'Visual theme differs from normal pieces.'
    ]
  },
  '/play/custom/four-player': {
    objective: 'Outlast multiple opponents in 4-player format.',
    rules: [
      'Board and turn order are adjusted for four players.',
      'Elimination and check states follow 4-player mode logic.'
    ]
  },
  '/play/custom/dice-chess': {
    objective: 'Use dice constraints to outplay and capture the enemy king.',
    rules: [
      'Dice rolls restrict which piece types can move each turn.',
      'Plan around roll variance and tactical opportunities.'
    ]
  },
  '/play/custom/card-chess': {
    objective: 'Use card draws to unlock piece moves and win.',
    rules: [
      'Card ranks map to move permissions for specific piece types.',
      'Card management changes strategic planning each turn.'
    ]
  },
  '/tools/analysis': {
    objective: 'Analyze any position with engine support and move exploration.',
    rules: [
      'Set positions manually or import PGN/FEN.',
      'Use engine lines and evaluations to inspect candidate moves.'
    ]
  },
  '/tools/game-review': {
    objective: 'Review completed games to identify strengths and mistakes.',
    rules: [
      'Upload or select a game for move-by-move review.',
      'Use classifications and accuracy metrics to improve.'
    ]
  },
  '/practice/learn/openings': {
    objective: 'Build opening familiarity and learn plans from key positions.',
    rules: [
      'Navigate opening trees and lines.',
      'Study ideas, not only move order.'
    ]
  },
  '/practice/puzzles/standard': {
    objective: 'Solve tactical positions accurately.',
    rules: [
      'Find the best continuation from each puzzle position.',
      'Rating adjusts with performance.'
    ]
  },
  '/practice/puzzles/rush': {
    objective: 'Solve as many puzzles as possible under pressure.',
    rules: [
      'Time or mistake limits define session end.',
      'Speed and accuracy both matter.'
    ]
  },
  '/practice/cognitive/memory': {
    objective: 'Improve board memory by reconstructing positions.',
    rules: [
      'Memorize position, then rebuild it from recall.',
      'Scoring reflects recall accuracy.'
    ]
  },
  '/practice/cognitive/vision': {
    objective: 'Improve coordinate and pattern recognition speed.',
    rules: [
      'Respond to board prompts quickly and accurately.',
      'Performance combines speed and correctness.'
    ]
  }
};

function toTitleFromHref(href: string): string {
  const last = href.split('/').filter(Boolean).at(-1) ?? 'mode';
  return last
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getModeInfoForPath(pathname: string): InfobarContent | null {
  const data = MODE_INFO_BY_HREF[pathname];
  if (!data) return null;

  return {
    title: toTitleFromHref(pathname),
    sections: [
      {
        title: 'Objective',
        description: data.objective
      },
      {
        title: 'Core Rules',
        description: data.rules.map((rule) => `• ${rule}`).join('\n')
      },
      ...(data.tips?.length
        ? [
            {
              title: 'Tips',
              description: data.tips.map((tip) => `• ${tip}`).join('\n')
            }
          ]
        : [])
    ]
  };
}

export function getModeInfoContent(
  href: string,
  title: string,
  description: string
): InfobarContent {
  const data = MODE_INFO_BY_HREF[href];

  if (!data) {
    return {
      title,
      sections: [
        {
          title: 'Overview',
          description
        },
        {
          title: 'Objective',
          description: `Start "${title}" and complete its win condition while minimizing errors.`
        }
      ]
    };
  }

  return {
    title,
    sections: [
      {
        title: 'Overview',
        description
      },
      {
        title: 'Objective',
        description: data.objective
      },
      {
        title: 'Core Rules',
        description: data.rules.map((rule) => `• ${rule}`).join('\n')
      },
      ...(data.tips?.length
        ? [
            {
              title: 'Tips',
              description: data.tips.map((tip) => `• ${tip}`).join('\n')
            }
          ]
        : [])
    ]
  };
}
