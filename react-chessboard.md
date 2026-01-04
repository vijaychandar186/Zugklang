I'll provide the complete, unedited React Chessboard documentation as a single markdown file. This will contain all the content exactly as presented in your request.

```markdown
# React Chessboard Documentation

## What is React Chessboard?
React Chessboard is a React component that provides chessboard functionality to your web application. It is a simple and easy-to-use component allowing you to create a custom and flexible chessboard experience with a wide range of features. The component is purely a UI component and does not include any logic for the game of chess. The chess game logic should be independent to the component. This flexibility enables you to use the component in any project, regardless of the chess logic or chess variant you wish to build with. For example, you can use the chess.js library to handle the game logic. Example usages of the component with chess.js are shown in the How to use documentation.

## Features
The package includes the many helpful features, such as:
* Drag and drop
* Custom pieces
* Spare pieces
* Arrows
* Custom styling
* Animation
* Custom board dimensions
* Event handling
* Mobile support
* Responsive
* Accessible
* TypeScript support
* Helpful utility functions
* And more!

## Installation

```bash
pnpm add react-chessboard
```

```bash
yarn add react-chessboard
```

```bash
npm i react-chessboard
```

## Quick Start
Here is a quick example of how to use the component. You will need to configure the component with the `options` prop. See the Options API documentation for more information on the available options. You can also see the Basic Examples documentation for more examples of how to use the component.

```tsx
import { Chessboard } from 'react-chessboard';

function App() {
  const chessboardOptions = {
    // your config options here
  };

  return <Chessboard options={chessboardOptions} />;
}
```

## Join the community of developers
Join the community of developers on the Discord server. Whether you're:
* building something cool with the component and want to show it off
* struggling to implement something and need some help
* have an idea for a new feature

We'd love to have you join our growing community!

---

# Basic Examples

These examples demonstrate basic and common use cases for React Chessboard. Each example includes explanations of key concepts and code snippets showing how to implement them.

## Recommendation
The code shown in the "Show code" dropdowns for each example does show the full code but it is not formatted in an ideal way and hides any helpful import statements. It is highly recommended to view the code in the GitHub repository to see the code in a more readable format.

## Table of contents
- Default chessboard component
- Using with chess.js
- Spare pieces
- Click to move
- Click or drag to move

## Default chessboard component
The default component is a simple chessboard with default pieces. It is unlikely that you will need to use this component in this state without any customisation or properties supplied. It is shown here for reference and as a starting point for your own customisation.

```tsx
{
  render: () => <Chessboard />
}
```

## Using with chess.js
This example shows basic usage of the component with the chess.js library. It demonstrates how to handle piece drops and safely update the board position when a move is made.

This utilises the onPieceDrop prop to handle the piece drop event and the position prop to update the board position when a move is made.

A chessGameRef is used to prevent stale closures when making moves. Without it, functions like onPieceDrop would capture an outdated version of chessGame in their closure, leading to incorrect game state. The ref ensures we always access the latest game state, even in callbacks and timeouts. This scenario is quite specific to this example where there is a closure over old game states and the game state is updated in a timeout.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setChessPosition(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'play-vs-random'
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  }
}
```

## Spare pieces
This example shows how to use spare pieces with the chessboard component. Spare pieces are pieces that can be dragged onto the board from outside the main chessboard component. This is useful for setting up custom positions or creating chess puzzles.

### Warning
The spare pieces functionality requires wrapping your chessboard and spare pieces in the ChessboardProvider component. All props that would normally be passed to the Chessboard component must instead be passed to the ChessboardProvider via its options prop.

When using spare pieces, you can drag pieces both onto and off the board. The onPieceDrop handler receives information about whether the piece was dropped on a valid square (via the targetSquare parameter) or off the board (targetSquare will be null). This allows you to implement custom logic for handling pieces being removed from the board.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess('8/8/8/8/8/8/8/8 w - - 0 1', {
      skipValidation: true
    }));
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [squareWidth, setSquareWidth] = useState<number | null>(null);

    // get the width of a square to use for the spare piece sizes
    useEffect(() => {
      const square = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect();
      setSquareWidth(square?.width ?? null);
    }, []);

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece
    }: PieceDropHandlerArgs) {
      const color = piece.pieceType[0];
      const type = piece.pieceType[1].toLowerCase();

      // if the piece is dropped off the board, we need to remove it from the board
      if (!targetSquare) {
        chessGame.remove(sourceSquare as Square);
        setChessPosition(chessGame.fen());

        // successful drop off board
        return true;
      }

      // if the piece is not a spare piece, we need to remove it from it's original square
      if (!piece.isSparePiece) {
        chessGame.remove(sourceSquare as Square);
      }

      // try to place the piece on the board
      const success = chessGame.put({
        color: color as Color,
        type: type as PieceSymbol
      }, targetSquare as Square);

      // show error message if cannot place another king
      if (!success) {
        alert(`The board already contains a ${color === 'w' ? 'white' : 'black'} King piece`);
        return false;
      }

      // update the game state and return true if successful
      setChessPosition(chessGame.fen());
      return true;
    }

    // get the piece types for the black and white spare pieces
    const blackPieceTypes: string[] = [];
    const whitePieceTypes: string[] = [];
    for (const pieceType of Object.keys(defaultPieces)) {
      if (pieceType[0] === 'b') {
        blackPieceTypes.push(pieceType as string);
      } else {
        whitePieceTypes.push(pieceType as string);
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'spare-pieces'
    };

    // render the chessboard and spare pieces
    return <ChessboardProvider options={chessboardOptions}>
        {squareWidth ? <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        width: 'fit-content',
        margin: '0 auto'
      }}>
            {blackPieceTypes.map(pieceType => <div key={pieceType} style={{
          width: `${squareWidth}px`,
          height: `${squareWidth}px`
        }}>
                <SparePiece pieceType={pieceType} />
              </div>)}
          </div> : null}

        <Chessboard />

        {squareWidth ? <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        width: 'fit-content',
        margin: '0 auto'
      }}>
            {whitePieceTypes.map(pieceType => <div key={pieceType} style={{
          width: `${squareWidth}px`,
          height: `${squareWidth}px`
        }}>
                <SparePiece pieceType={pieceType} />
              </div>)}
          </div> : null}
      </ChessboardProvider>;
  }
}
```

## Click to move
This example shows how to use the onSquareClick prop to handle square clicks. This is useful for implementing custom move logic, such as allowing the user to click on a piece to move it to a new square, instead of dragging the piece to the new square.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // get the move options for a square to show valid moves
    function getMoveOptions(square: Square) {
      // get the moves for the square
      const moves = chessGame.moves({
        square,
        verbose: true
      });

      // if no moves, clear the option squares
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      // create a new object to store the option squares
      const newSquares: Record<string, React.CSSProperties> = {};

      // loop through the moves and set the option squares
      for (const move of moves) {
        newSquares[move.to] = {
          background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
          // smaller circle for moving
          borderRadius: '50%'
        };
      }

      // set the square clicked to move from to yellow
      newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)'
      };

      // set the option squares
      setOptionSquares(newSquares);

      // return true to indicate that there are move options
      return true;
    }
    function onSquareClick({
      square,
      piece
    }: SquareHandlerArgs) {
      // piece clicked to move
      if (!moveFrom && piece) {
        // get the move options for the square
        const hasMoveOptions = getMoveOptions(square as Square);

        // if move options, set the moveFrom to the square
        if (hasMoveOptions) {
          setMoveFrom(square);
        }

        // return early
        return;
      }

      // square clicked to move to, check if valid move
      const moves = chessGame.moves({
        square: moveFrom as Square,
        verbose: true
      });
      const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square as Square);

        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : '');

        // return early
        return;
      }

      // is normal move
      try {
        chessGame.move({
          from: moveFrom,
          to: square,
          promotion: 'q'
        });
      } catch {
        // if invalid, setMoveFrom and getMoveOptions
        const hasMoveOptions = getMoveOptions(square as Square);

        // if new piece, setMoveFrom, otherwise clear moveFrom
        if (hasMoveOptions) {
          setMoveFrom(square);
        }

        // return early
        return;
      }

      // update the position state
      setChessPosition(chessGame.fen());

      // make random cpu move after a short delay
      setTimeout(makeRandomMove, 300);

      // clear moveFrom and optionSquares
      setMoveFrom('');
      setOptionSquares({});
    }

    // set the chessboard options
    const chessboardOptions = {
      allowDragging: false,
      onSquareClick,
      position: chessPosition,
      squareStyles: optionSquares,
      id: 'click-to-move'
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  }
}
```

## Click or drag to move
This example shows how to use the onSquareClick prop in tandem with the onPieceDrop prop to handle square click movement as well as drag movement.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves`
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // get the move options for a square to show valid moves
    function getMoveOptions(square: Square) {
      // get the moves for the square
      const moves = chessGame.moves({
        square,
        verbose: true
      });

      // if no moves, clear the option squares
      if (moves.length === 0) {
        setOptionSquares({});
        return false;
      }

      // create a new object to store the option squares
      const newSquares: Record<string, React.CSSProperties> = {};

      // loop through the moves and set the option squares
      for (const move of moves) {
        newSquares[move.to] = {
          background: chessGame.get(move.to) && chessGame.get(move.to)?.color !== chessGame.get(square)?.color ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)' // larger circle for capturing
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
          // smaller circle for moving
          borderRadius: '50%'
        };
      }

      // set the square clicked to move from to yellow
      newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)'
      };

      // set the option squares
      setOptionSquares(newSquares);

      // return true to indicate that there are move options
      return true;
    }
    function onSquareClick({
      square,
      piece
    }: SquareHandlerArgs) {
      // piece clicked to move
      if (!moveFrom && piece) {
        // get the move options for the square
        const hasMoveOptions = getMoveOptions(square as Square);

        // if move options, set the moveFrom to the square
        if (hasMoveOptions) {
          setMoveFrom(square);
        }

        // return early
        return;
      }

      // square clicked to move to, check if valid move
      const moves = chessGame.moves({
        square: moveFrom as Square,
        verbose: true
      });
      const foundMove = moves.find(m => m.from === moveFrom && m.to === square);

      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square as Square);

        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : '');

        // return early
        return;
      }

      // is normal move
      try {
        chessGame.move({
          from: moveFrom,
          to: square,
          promotion: 'q'
        });
      } catch {
        // if invalid, setMoveFrom and getMoveOptions
        const hasMoveOptions = getMoveOptions(square as Square);

        // if new piece, setMoveFrom, otherwise clear moveFrom
        if (hasMoveOptions) {
          setMoveFrom(square);
        }

        // return early
        return;
      }

      // update the position state
      setChessPosition(chessGame.fen());

      // make random cpu move after a short delay
      setTimeout(makeRandomMove, 300);

      // clear moveFrom and optionSquares
      setMoveFrom('');
      setOptionSquares({});
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setChessPosition(chessGame.fen());

        // clear moveFrom and optionSquares
        setMoveFrom('');
        setOptionSquares({});

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // set the chessboard options
    const chessboardOptions = {
      onPieceDrop,
      onSquareClick,
      position: chessPosition,
      squareStyles: optionSquares,
      id: 'click-or-drag-to-move'
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  }
}
```

---

# Advanced Examples

These examples demonstrate more complex use cases for React Chessboard. Each example includes explanations of key concepts and code snippets showing how to implement them.

## Recommendation
The code shown in the "Show code" dropdowns for each example does show the full code where possible, but it is not formatted in an ideal way and hides any helpful import statements. It is highly recommended to view the code in the GitHub repository to see the code in a more readable format.

## Table of contents
- Analysis board
- Mini puzzles
- Multiplayer
- Premoves
- Promotion piece selection
- Four player chess
- 3D board

## Analysis board
This example shows you how to implement an analysis board with the component. The analysis board is a board that shows a chess engine's evaluation of the current position and the best move it thinks can be played.

The engine used in this example is Stockfish, which is a free and open-source chess engine. In this example we are using the stockfish.wasm library by Lichess, which is a WebAssembly build of Stockfish.

To implement the analysis board, there are a few key requirements:

1. **Web Worker Implementation**: The chess engine runs in a web worker to prevent blocking the main thread. This ensures the UI remains responsive while the engine is calculating moves. You can learn more about web workers in the MDN documentation.

2. **Required Files**: You'll need to include two additional files in your project:
   - `stockfish.wasm.js`: The JavaScript wrapper for the WebAssembly engine
   - `stockfish.wasm`: The actual WebAssembly binary of the Stockfish engine
   
   These files should be placed in your public directory so they can be accessed by the web worker. You can download these files from the react-chessboard repository:
   - [stockfish.wasm.js](https://github.com/Clariity/react-chessboard/blob/main/public/stockfish.wasm.js)
   - [stockfish.wasm](https://github.com/Clariity/react-chessboard/blob/main/public/stockfish.wasm)

3. **Engine Helper Class**: The example uses a helper class called Engine to simplify interaction with the Stockfish engine. This class:
   - Initializes the web worker
   - Handles communication with the engine
   - Provides methods for position evaluation and move calculation
   - Manages the engine's lifecycle
   
   You can find the complete implementation of the Engine class in the react-chessboard repository.

```
Position Evaluation: 0.82; Depth: 18
Best line: e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5c6 d7c6 ...
```

Make moves on the board to analyze positions. The green arrow shows Stockfish's suggested best move. The evaluation is shown in centipawns (positive numbers favor White, negative favor Black).

```tsx
{
  render: () => {
    // initialise the engine
    const engine = useMemo(() => new Engine(), []);

    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // store engine variables
    const [positionEvaluation, setPositionEvaluation] = useState(0);
    const [depth, setDepth] = useState(10);
    const [bestLine, setBestLine] = useState('');
    const [possibleMate, setPossibleMate] = useState('');

    // when the chess game position changes, find the best move
    useEffect(() => {
      if (!(chessGame.isGameOver() || chessGame.isDraw())) {
        findBestMove();
      }
    }, [chessGame.fen()]);

    // find the best move
    function findBestMove() {
      engine.evaluatePosition(chessGame.fen(), 18);
      engine.onMessage(({
        positionEvaluation,
        possibleMate,
        pv,
        depth
      }) => {
        // ignore messages with a depth less than 10
        if (depth && depth < 10) {
          return;
        }

        // update the position evaluation
        if (positionEvaluation) {
          setPositionEvaluation((chessGame.turn() === 'w' ? 1 : -1) * Number(positionEvaluation) / 100);
        }

        // update the possible mate, depth and best line
        if (possibleMate) {
          setPossibleMate(possibleMate);
        }
        if (depth) {
          setDepth(depth);
        }
        if (pv) {
          setBestLine(pv);
        }
      });
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });
        setPossibleMate('');

        // update the game state
        setChessPosition(chessGame.fen());

        // stop the engine (it will be restarted by the useEffect running findBestMove)
        engine.stop();

        // reset the best line
        setBestLine('');

        // if the game is over, return false
        if (chessGame.isGameOver() || chessGame.isDraw()) {
          return false;
        }

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // get the best move
    const bestMove = bestLine?.split(' ')?.[0];

    // set the chessboard options, using arrows to show the best move
    const chessboardOptions = {
      arrows: bestMove ? [{
        startSquare: bestMove.substring(0, 2) as Square,
        endSquare: bestMove.substring(2, 4) as Square,
        color: 'rgb(0, 128, 0)'
      }] : undefined,
      position: chessPosition,
      onPieceDrop,
      id: 'analysis-board'
    };

    // render the chessboard
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Position Evaluation:{' '}
          {possibleMate ? `#${possibleMate}` : positionEvaluation}
          {'; '}
          Depth: {depth}
        </div>
        <div>
          Best line: <i>{bestLine.slice(0, 40)}</i> ...
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Make moves on the board to analyze positions. The green arrow shows
          Stockfish&apos;s suggested best move. The evaluation is shown in
          centipawns (positive numbers favor White, negative favor Black).
        </p>
      </div>;
  }
}
```

## Mini puzzles
This example shows you how to implement a mini puzzle with the component. This example is inspired from the mate in two puzzles in the Pocket Chess app. It highlights the ability to create non-standard boards with logic following predefined moves.

```
White to move, checkmate in 2
```

```tsx
{
  render: () => {
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [position, setPosition] = useState({
      a4: {
        pieceType: 'bR'
      },
      c4: {
        pieceType: 'bK'
      },
      e4: {
        pieceType: 'bN'
      },
      d3: {
        pieceType: 'bP'
      },
      f3: {
        pieceType: 'bQ'
      },
      c2: {
        pieceType: 'wN'
      },
      d2: {
        pieceType: 'wQ'
      },
      b1: {
        pieceType: 'wN'
      }
    } as PositionDataType);

    // as the squareStyles prop applies within a square instead of the whole square, we wouldn't be able to hide the squares with this prop
    // instead, we hide the squares by getting the square elements by their id and setting the display to none
    // "mini-puzzles" being the id we gave to the chessboard
    useEffect(() => {
      const e1 = document.getElementById('mini-puzzles-square-e1');
      const f1 = document.getElementById('mini-puzzles-square-f1');
      if (e1) {
        e1.style.display = 'none';
      }
      if (f1) {
        f1.style.display = 'none';
      }
    }, []);

    // moves for the puzzle
    const moves = [{
      sourceSquare: 'd2',
      targetSquare: 'c3'
    }, {
      sourceSquare: 'e4',
      targetSquare: 'c3'
    }, {
      sourceSquare: 'b1',
      targetSquare: 'd2'
    }];

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece
    }: PieceDropHandlerArgs) {
      const requiredMove = moves[currentMoveIndex];

      // check if the move is valid
      if (requiredMove.sourceSquare !== sourceSquare || requiredMove.targetSquare !== targetSquare) {
        // return false as the move is not valid
        return false;
      }

      // update the position
      const newPosition = {
        ...position
      };
      newPosition[targetSquare] = {
        pieceType: piece.pieceType
      };
      delete newPosition[sourceSquare];
      setPosition(newPosition);

      // increment the current move index
      setCurrentMoveIndex(prev => prev + 1);

      // define makeCpuMove inside onPieceDrop to capture current values
      const makeCpuMove = () => {
        const nextMoveIndex = currentMoveIndex + 1;

        // if there is another move, make it
        if (nextMoveIndex < moves.length) {
          const move = moves[nextMoveIndex];
          const updatedPosition = {
            ...newPosition
          };
          updatedPosition[move.targetSquare] = {
            pieceType: updatedPosition[move.sourceSquare].pieceType
          };
          delete updatedPosition[move.sourceSquare];
          setPosition(updatedPosition);
          setCurrentMoveIndex(nextMoveIndex + 1);
        }
      };

      // make the cpu move
      setTimeout(makeCpuMove, 200);

      // return true as the move was successful
      return true;
    }

    // only allow white pieces to be dragged
    function canDragPiece({
      piece
    }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // set the chessboard options
    const chessboardOptions = {
      canDragPiece,
      onPieceDrop,
      chessboardRows: 4,
      chessboardColumns: 6,
      position,
      id: 'mini-puzzles'
    };

    // render the chessboard
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
          White to move, checkmate in 2
        </div>

        <Chessboard options={chessboardOptions} />
      </div>;
  }
}
```

## Multiplayer
This example demonstrates how to implement a multiplayer chess experience with the component. This aims to highlight a centralised game state where each player can see the board from their own perspective.

In examples where the game is played over a network, the player should have a local game state and a remote game state. The local game state is the game state that the player sees on their own board, and the remote game state is the game state that the player sees on the opponent's board. These should be kept in sync by sending the game state to the opponent over the network. In this scenario, the local player would immediately see their board update, and the remote player would receive that update with a delay equal to the time it takes to send the game state to the opponent over the network.

```
White's perspective

Black's perspective
```

```tsx
{
  render: () => {
    // create a chess game using a ref to maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // try to make the move according to chess.js logic
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state upon successful move to trigger a re-render of the chessboard
        setChessPosition(chessGame.fen());

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // allow white to only drag white pieces
    function canDragPieceWhite({
      piece
    }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // allow black to only drag black pieces
    function canDragPieceBlack({
      piece
    }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'b';
    }

    // set the chessboard options for white's perspective
    const whiteBoardOptions = {
      canDragPiece: canDragPieceWhite,
      position: chessPosition,
      onPieceDrop,
      boardOrientation: 'white' as const,
      id: 'multiplayer-white'
    };

    // set the chessboard options for black's perspective
    const blackBoardOptions = {
      canDragPiece: canDragPieceBlack,
      position: chessPosition,
      onPieceDrop,
      boardOrientation: 'black' as const,
      id: 'multiplayer-black'
    };

    // render both chessboards side by side with a gap
    return <div style={{
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: '10px'
    }}>
        <div>
          <p style={{
          textAlign: 'center'
        }}>White&apos;s perspective</p>
          <div style={{
          maxWidth: '400px'
        }}>
            <Chessboard options={whiteBoardOptions} />
          </div>
        </div>

        <div>
          <p style={{
          textAlign: 'center'
        }}>Black&apos;s perspective</p>
          <div style={{
          maxWidth: '400px'
        }}>
            <Chessboard options={blackBoardOptions} />
          </div>
        </div>
      </div>;
  }
}
```

## Premoves
This example shows you how can you implement premoves with the component. Premoves are when you make a move and then before your opponent makes their move, you make a move to be played automatically after your opponent's move.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());
    const [premoves, setPremoves] = useState<PieceDropHandlerArgs[]>([]);
    const [showAnimations, setShowAnimations] = useState(true);
    const premovesRef = useRef<PieceDropHandlerArgs[]>([]);

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // make a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      chessGame.move(randomMove);
      setChessPosition(chessGame.fen());

      // if there is a premove, remove it from the list and make it once animation is complete
      if (premovesRef.current.length > 0) {
        const nextPlayerPremove = premovesRef.current[0];
        premovesRef.current.splice(0, 1);

        // wait for CPU move animation to complete
        setTimeout(() => {
          // execute the premove
          const premoveSuccessful = onPieceDrop(nextPlayerPremove);

          // if the premove was not successful, clear all premoves
          if (!premoveSuccessful) {
            premovesRef.current = [];
          }

          // update the premoves state
          setPremoves([...premovesRef.current]);

          // disable animations while clearing premoves
          setShowAnimations(false);

          // re-enable animations after a short delay
          setTimeout(() => {
            setShowAnimations(true);
          }, 50);
        }, 300);
      }
    }

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare,
      piece
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board) or user dropping piece onto same square
      if (!targetSquare || sourceSquare === targetSquare) {
        return false;
      }

      // check if a premove (piece isn't the color of the current player's turn)
      const pieceColor = piece.pieceType[0]; // 'w' or 'b'
      if (chessGame.turn() !== pieceColor) {
        premovesRef.current.push({
          sourceSquare,
          targetSquare,
          piece
        });
        setPremoves([...premovesRef.current]);
        // return early to stop processing the move and return true to not animate the move
        return true;
      }

      // try to make the move
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state
        setChessPosition(chessGame.fen());

        // make random cpu move after a slightly longer delay to allow user to premove
        setTimeout(makeRandomMove, 3000);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    }

    // clear all premoves on right click
    function onSquareRightClick() {
      premovesRef.current = [];
      setPremoves([...premovesRef.current]);

      // disable animations while clearing premoves
      setShowAnimations(false);

      // re-enable animations after a short delay
      setTimeout(() => {
        setShowAnimations(true);
      }, 50);
    }

    // only allow white pieces to be dragged
    function canDragPiece({
      piece
    }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // create a position object from the fen string to split the premoves from the game state
    const position = fenStringToPositionObject(chessPosition, 8, 8);
    const squareStyles: Record<string, React.CSSProperties> = {};

    // add premoves to the position object to show them on the board
    for (const premove of premoves) {
      delete position[premove.sourceSquare];
      position[premove.targetSquare!] = {
        pieceType: premove.piece.pieceType
      };
      squareStyles[premove.sourceSquare] = {
        backgroundColor: 'rgba(255,0,0,0.2)'
      };
      squareStyles[premove.targetSquare!] = {
        backgroundColor: 'rgba(255,0,0,0.2)'
      };
    }

    // set the chessboard options
    const chessboardOptions = {
      canDragPiece,
      onPieceDrop,
      onSquareRightClick,
      position,
      showAnimations,
      squareStyles,
      id: 'premoves'
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
  }
}
```

## Promotion piece selection
This example shows you how to implement promotion piece selection with the component by using the onPieceDrop prop to capture the promotion move, show a dialog to select the piece that the pawn will be promoted to, and then update the board position prop to update the board position to the promotion move.

```
Reset Position
```

Move the white pawn to the 8th rank to trigger the promotion dialog. Click the reset button to return to the initial position.

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess('8/P7/7K/8/8/8/8/k7 w - - 0 1'));
    const chessGame = chessGameRef.current;

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // track the promotion move
    const [promotionMove, setPromotionMove] = useState<Omit<PieceDropHandlerArgs, 'piece'> | null>(null);

    // handle piece drop
    function onPieceDrop({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) {
      // type narrow targetSquare potentially being null (e.g. if dropped off board)
      if (!targetSquare) {
        return false;
      }

      // target square is a promotion square, check if valid and show promotion dialog
      if (targetSquare.match(/\d+$/)?.[0] === '8') {
        // get all possible moves for the source square
        const possibleMoves = chessGame.moves({
          square: sourceSquare as Square
        });

        // check if target square is in possible moves (accounting for promotion notation)
        if (possibleMoves.some(move => move.startsWith(`${targetSquare}=`))) {
          setPromotionMove({
            sourceSquare,
            targetSquare
          });
        }

        // return true so that the promotion move is not animated
        // the downside to this is that any other moves made first will not be animated and will reset our move to be animated again e.g. if you are premoving a promotion move and the opponent makes a move afterwards
        return true;
      }

      // not a promotion square, try to make the move now
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare
        });

        // update the game state
        setChessPosition(chessGame.fen());

        // return true if the move was successful
        return true;
      } catch {
        // return false if the move was not successful
        return false;
      }
    }

    // handle promotion piece select
    function onPromotionPieceSelect(piece: PieceSymbol) {
      try {
        chessGame.move({
          from: promotionMove!.sourceSquare,
          to: promotionMove!.targetSquare as Square,
          promotion: piece
        });

        // update the game state
        setChessPosition(chessGame.fen());
      } catch {
        // do nothing
      }

      // reset the promotion move to clear the promotion dialog
      setPromotionMove(null);
    }

    // calculate the left position of the promotion square
    const squareWidth = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0;
    const promotionSquareLeft = promotionMove?.targetSquare ? squareWidth * chessColumnToColumnIndex(promotionMove.targetSquare.match(/^[a-z]+/)?.[0] ?? '', 8,
    // number of columns
    'white' // board orientation
    ) : 0;

    // set the chessboard options
    const chessboardOptions = {
      position: chessPosition,
      onPieceDrop,
      id: 'piece-promotion'
    };

    // render the chessboard
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <button onClick={() => {
        chessGameRef.current = new Chess('8/P7/7K/8/8/8/8/k7 w - - 0 1');
        setChessPosition(chessGameRef.current.fen());
        setPromotionMove(null);
      }}>
          Reset Position
        </button>

        <div style={{
        position: 'relative'
      }}>
          {promotionMove ? <div onClick={() => setPromotionMove(null)} onContextMenu={e => {
          e.preventDefault();
          setPromotionMove(null);
        }} style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }} /> : null}

          {promotionMove ? <div style={{
          position: 'absolute',
          top: 0,
          left: promotionSquareLeft,
          backgroundColor: 'white',
          width: squareWidth,
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)'
        }}>
              {(['q', 'r', 'n', 'b'] as PieceSymbol[]).map(piece => <button key={piece} onClick={() => {
            onPromotionPieceSelect(piece);
          }} onContextMenu={e => {
            e.preventDefault();
          }} style={{
            width: '100%',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            border: 'none',
            cursor: 'pointer'
          }}>
                  {defaultPieces[`w${piece.toUpperCase()}` as keyof PieceRenderObject]()}
                </button>)}
            </div> : null}

          <Chessboard options={chessboardOptions} />
        </div>

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Move the white pawn to the 8th rank to trigger the promotion dialog.
          Click the reset button to return to the initial position.
        </p>
      </div>;
  }
}
```

## Four player chess
This example shows you how to implement a four player chess game with the component. This example is inspired from the Four Player Chess variant on Chess.com. It highlights the ability to create a non-standard board with multiple orientations and piece colours.

```
4-Player Chess (Board Only)

Red
Green
Yellow
Blue
```

```tsx
{
  render: () => {
    // use position object to set up the board, using custom piece types for each player colour
    const topPieces = {
      d14: {
        pieceType: 'yR'
      },
      e14: {
        pieceType: 'yN'
      },
      f14: {
        pieceType: 'yB'
      },
      g14: {
        pieceType: 'yK'
      },
      h14: {
        pieceType: 'yQ'
      },
      i14: {
        pieceType: 'yB'
      },
      j14: {
        pieceType: 'yN'
      },
      k14: {
        pieceType: 'yR'
      },
      d13: {
        pieceType: 'yP'
      },
      e13: {
        pieceType: 'yP'
      },
      f13: {
        pieceType: 'yP'
      },
      g13: {
        pieceType: 'yP'
      },
      h13: {
        pieceType: 'yP'
      },
      i13: {
        pieceType: 'yP'
      },
      j13: {
        pieceType: 'yP'
      },
      k13: {
        pieceType: 'yP'
      }
    };
    const rightPieces = {
      n11: {
        pieceType: 'gR'
      },
      n10: {
        pieceType: 'gN'
      },
      n9: {
        pieceType: 'gB'
      },
      n8: {
        pieceType: 'gQ'
      },
      n7: {
        pieceType: 'gK'
      },
      n6: {
        pieceType: 'gB'
      },
      n5: {
        pieceType: 'gN'
      },
      n4: {
        pieceType: 'gR'
      },
      m11: {
        pieceType: 'gP'
      },
      m10: {
        pieceType: 'gP'
      },
      m9: {
        pieceType: 'gP'
      },
      m8: {
        pieceType: 'gP'
      },
      m7: {
        pieceType: 'gP'
      },
      m6: {
        pieceType: 'gP'
      },
      m5: {
        pieceType: 'gP'
      },
      m4: {
        pieceType: 'gP'
      }
    };
    const bottomPieces = {
      d1: {
        pieceType: 'rR'
      },
      e1: {
        pieceType: 'rN'
      },
      f1: {
        pieceType: 'rB'
      },
      g1: {
        pieceType: 'rQ'
      },
      h1: {
        pieceType: 'rK'
      },
      i1: {
        pieceType: 'rB'
      },
      j1: {
        pieceType: 'rN'
      },
      k1: {
        pieceType: 'rR'
      },
      d2: {
        pieceType: 'rP'
      },
      e2: {
        pieceType: 'rP'
      },
      f2: {
        pieceType: 'rP'
      },
      g2: {
        pieceType: 'rP'
      },
      h2: {
        pieceType: 'rP'
      },
      i2: {
        pieceType: 'rP'
      },
      j2: {
        pieceType: 'rP'
      },
      k2: {
        pieceType: 'rP'
      }
    };
    const leftPieces = {
      a11: {
        pieceType: 'bR'
      },
      a10: {
        pieceType: 'bN'
      },
      a9: {
        pieceType: 'bB'
      },
      a8: {
        pieceType: 'bK'
      },
      a7: {
        pieceType: 'bQ'
      },
      a6: {
        pieceType: 'bB'
      },
      a5: {
        pieceType: 'bN'
      },
      a4: {
        pieceType: 'bR'
      },
      b11: {
        pieceType: 'bP'
      },
      b10: {
        pieceType: 'bP'
      },
      b9: {
        pieceType: 'bP'
      },
      b8: {
        pieceType: 'bP'
      },
      b7: {
        pieceType: 'bP'
      },
      b6: {
        pieceType: 'bP'
      },
      b5: {
        pieceType: 'bP'
      },
      b4: {
        pieceType: 'bP'
      }
    };

    // combine the pieces into a single position object
    const [position] = useState({
      ...topPieces,
      ...rightPieces,
      ...bottomPieces,
      ...leftPieces
    });

    // track the orientation of the board in terms of degrees of rotation
    const [orientation, setOrientation] = useState(0);

    // hide 9 squares in each corner
    useEffect(() => {
      const corners = [
      // Top-left
      {
        files: ['a', 'b', 'c'],
        ranks: ['12', '13', '14']
      },
      // Top-right
      {
        files: ['l', 'm', 'n'],
        ranks: ['12', '13', '14']
      },
      // Bottom-left
      {
        files: ['a', 'b', 'c'],
        ranks: ['1', '2', '3']
      },
      // Bottom-right
      {
        files: ['l', 'm', 'n'],
        ranks: ['1', '2', '3']
      }];

      // loop through each corner and hide the squares
      corners.forEach(corner => {
        corner.files.forEach(file => {
          corner.ranks.forEach(rank => {
            const el = document.getElementById('four-player-chess-square-' + file + rank);
            if (el) {
              el.style.display = 'none';
            }
          });
        });
      });
    }, []);

    // define the styles for each player colour and the rotation of the pieces
    const yellowStyle = {
      fill: '#FFD700',
      svgStyle: {
        transform: `rotate(${-orientation}deg)`
      }
    };
    const greenStyle = {
      fill: '#00A86B',
      svgStyle: {
        transform: `rotate(${-orientation}deg)`
      }
    };
    const redStyle = {
      fill: '#D7263D',
      svgStyle: {
        transform: `rotate(${-orientation}deg)`
      }
    };
    const blueStyle = {
      fill: '#1E90FF',
      svgStyle: {
        transform: `rotate(${-orientation}deg)`
      }
    };

    // define the pieces for each player colour
    const fourPlayerPieces = {
      // Yellow (top)
      yP: () => defaultPieces.wP(yellowStyle),
      yR: () => defaultPieces.wR(yellowStyle),
      yN: () => defaultPieces.wN(yellowStyle),
      yB: () => defaultPieces.wB(yellowStyle),
      yQ: () => defaultPieces.wQ(yellowStyle),
      yK: () => defaultPieces.wK(yellowStyle),
      // Green (right)
      gP: () => defaultPieces.wP(greenStyle),
      gR: () => defaultPieces.wR(greenStyle),
      gN: () => defaultPieces.wN(greenStyle),
      gB: () => defaultPieces.wB(greenStyle),
      gQ: () => defaultPieces.wQ(greenStyle),
      gK: () => defaultPieces.wK(greenStyle),
      // Red (bottom)
      rP: () => defaultPieces.wP(redStyle),
      rR: () => defaultPieces.wR(redStyle),
      rN: () => defaultPieces.wN(redStyle),
      rB: () => defaultPieces.wB(redStyle),
      rQ: () => defaultPieces.wQ(redStyle),
      rK: () => defaultPieces.wK(redStyle),
      // Blue (left)
      bP: () => defaultPieces.wP(blueStyle),
      bR: () => defaultPieces.wR(blueStyle),
      bN: () => defaultPieces.wN(blueStyle),
      bB: () => defaultPieces.wB(blueStyle),
      bQ: () => defaultPieces.wQ(blueStyle),
      bK: () => defaultPieces.wK(blueStyle)
    } as const;

    // set the chessboard options
    const chessboardOptions = {
      chessboardRows: 14,
      chessboardColumns: 14,
      position,
      id: 'four-player-chess',
      pieces: fourPlayerPieces,
      showNotation: false,
      boardStyle: {
        transform: `rotate(${orientation}deg)`
      },
      draggingPieceStyle: {
        ...defaultDraggingPieceStyle,
        transform: `rotate(${orientation}deg)` // rotate the dragging piece to match the orientation of the board
      }
    };

    // render the chessboard
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
          4-Player Chess (Board Only)
        </div>
        <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
          <button onClick={() => setOrientation(0)}>Red</button>
          <button onClick={() => setOrientation(90)}>Green</button>
          <button onClick={() => setOrientation(180)}>Yellow</button>
          <button onClick={() => setOrientation(270)}>Blue</button>
        </div>
        <Chessboard options={chessboardOptions} />
      </div>;
  }
}
```

## 3D board
This example shows you how to implement a 3D chessboard with the component by using the boardStyle prop to create a 3D board and the pieces prop to create 3D pieces with images.

```tsx
{
  render: () => {
    const threeDPieces = useMemo(() => {
      // define the pieces and their heights
      const pieces = [{
        piece: 'wP',
        pieceHeight: 1
      }, {
        piece: 'wN',
        pieceHeight: 1.2
      }, {
        piece: 'wB',
        pieceHeight: 1.2
      }, {
        piece: 'wR',
        pieceHeight: 1.2
      }, {
        piece: 'wQ',
        pieceHeight: 1.5
      }, {
        piece: 'wK',
        pieceHeight: 1.6
      }, {
        piece: 'bP',
        pieceHeight: 1
      }, {
        piece: 'bN',
        pieceHeight: 1.2
      }, {
        piece: 'bB',
        pieceHeight: 1.2
      }, {
        piece: 'bR',
        pieceHeight: 1.2
      }, {
        piece: 'bQ',
        pieceHeight: 1.5
      }, {
        piece: 'bK',
        pieceHeight: 1.6
      }];

      // get the width of a square to use for the piece sizes
      const squareWidth = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect()?.width ?? 0;

      // create the piece components
      const pieceComponents: Record<string, () => React.JSX.Element> = {};
      pieces.forEach(({
        piece,
        pieceHeight
      }) => {
        pieceComponents[piece] = () => <div style={{
          width: squareWidth,
          height: squareWidth,
          position: 'relative',
          pointerEvents: 'none'
        }}>
            <img src={`/3d-pieces/${piece}.webp`} width={squareWidth} height={pieceHeight * squareWidth} style={{
            position: 'absolute',
            bottom: `${0.2 * squareWidth}px`,
            objectFit: piece[1] === 'K' ? 'contain' : 'cover'
          }} />
          </div>;
      });
      return pieceComponents;
    }, []);

    // set the chessboard options
    const chessboardOptions = {
      id: '3d-board',
      boardStyle: {
        transform: 'rotateX(27.5deg)',
        transformOrigin: 'center',
        border: '16px solid #b8836f',
        borderStyle: 'outset',
        borderRightColor: ' #b27c67',
        borderRadius: '4px',
        boxShadow: 'rgba(0, 0, 0, 0.5) 2px 24px 24px 8px',
        borderRightWidth: '2px',
        borderLeftWidth: '2px',
        borderTopWidth: '0px',
        borderBottomWidth: '18px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '8px 8px 12px',
        background: '#e0c094',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover',
        overflow: 'visible'
      },
      pieces: threeDPieces,
      lightSquareStyle: {
        backgroundColor: '#e0c094',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover'
      },
      darkSquareStyle: {
        backgroundColor: '#865745',
        backgroundImage: 'url("wood-pattern.png")',
        backgroundSize: 'cover'
      }
    };

    // render the chessboard
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center',
      margin: '3rem 0'
    }}>
        <Chessboard options={chessboardOptions} />
      </div>;
  }
}
```

---

# Options API

This page will explain how to use the options API for React Chessboard. It includes sections for each option for the component that also contain relevant examples of how to use them.

The component has a number of options that you can use to customise the component. These are passed in via the options prop to the Chessboard component. (or the ChessboardProvider component if you are using spare pieces or other features that require the context provider).

The code for these examples can be viewed by clicking the "Show code" button in the bottom right of the interactive examples. The code can also be viewed in the GitHub repository.

| Option | Description |
|--------|-------------|
| allowAutoScroll | Controls auto-scrolling when dragging pieces near window edges |
| allowDragging | Controls whether pieces can be dragged on the board |
| allowDragOffBoard | Controls whether pieces can be dragged off the board |
| allowDrawingArrows | Controls whether arrows can be drawn by right-clicking and dragging |
| alphaNotationStyle | Controls styling of the alpha notation (a-h) |
| animationDurationInMs | Controls duration of piece movement animations |
| arrows | Array of arrows to display on the board |
| arrowOptions | Controls styling and behavior of arrows |
| boardOrientation | Sets orientation of the board ('white' or 'black') |
| boardStyle | Controls styling of the main board container |
| canDragPiece | Function to determine if a piece can be dragged |
| chessboardColumns | Number of columns on the board |
| chessboardRows | Number of rows on the board |
| clearArrowsOnClick | Controls whether arrows are cleared on board click |
| clearArrowsOnPositionChange | Controls whether arrows are cleared on position change |
| darkSquareNotationStyle | Controls styling of notation on dark squares |
| darkSquareStyle | Controls styling of dark squares |
| dragActivationDistance | Distance in pixels before drag activation |
| draggingPieceGhostStyle | Controls styling of ghost piece while dragging |
| draggingPieceStyle | Controls styling of piece being dragged |
| dropSquareStyle | Controls styling of squares when dragging over them |
| id | Sets the id of the chessboard component |
| lightSquareNotationStyle | Controls styling of notation on light squares |
| lightSquareStyle | Controls styling of light squares |
| numericNotationStyle | Controls styling of numeric notation (1-8) |
| onArrowsChange | Handler for when internal arrows change |
| onMouseOutSquare | Handler for mouse leaving a square |
| onMouseOverSquare | Handler for mouse entering a square |
| onPieceClick | Handler for clicking a piece |
| onPieceDrag | Handler for starting to drag a piece |
| onPieceDrop | Handler for dropping a piece |
| onSquareClick | Handler for clicking a square |
| onSquareMouseDown | Handler for mouse button down on a square |
| onSquareMouseUp | Handler for mouse button up on a square |
| onSquareRightClick | Handler for right-clicking a square |
| pieces | Object mapping piece types to React components |
| position | Current position on the board (FEN string or position object) |
| showAnimations | Controls whether piece movements are animated |
| showNotation | Controls whether board notation is displayed |
| squareRenderer | Controls the rendering of squares on the board |
| squareStyle | Base styling applied to all squares |
| squareStyles | Object mapping squares to custom styles |

## Options

### options.allowAutoScroll
Controls whether dragging a piece near the edge of the window will automatically scroll the window.

**Default value:** `false`

**TypeScript type:** `boolean`

**Standard use case:** Enabling auto-scrolling when dragging pieces near the edge of the window. Could be used if the board is larger than the window.

```
Allow auto-scroll when dragging near screen edges
```

Enable the checkbox and try dragging a piece near the edge of the screen to see auto-scroll behavior

```tsx
{
  render: () => {
    const [allowAutoScroll, setAllowAutoScroll] = useState(false);

    // chessboard options
    const chessboardOptions = {
      allowAutoScroll,
      id: 'allow-auto-scroll'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={allowAutoScroll} onChange={e => setAllowAutoScroll(e.target.checked)} />
          Allow auto-scroll when dragging near screen edges
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Enable the checkbox and try dragging a piece near the edge of the
          screen to see auto-scroll behavior
        </p>
      </div>;
  }
}
```

### options.allowDragging
Controls whether pieces can be dragged.

When set to true, pieces can be dragged and dropped, and by default will have cursor: grab style. When set to false, the pieces can no longer be dragged, and by default will have the cursor: pointer style.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling drag and drop functionality for the entire board.

```
Allow dragging pieces
```

Toggle the checkbox to enable/disable piece dragging

```tsx
{
  render: () => {
    const [allowDragging, setAllowDragging] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDragging,
      id: 'allow-dragging'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={allowDragging} onChange={e => setAllowDragging(e.target.checked)} />
          Allow dragging pieces
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to enable/disable piece dragging
        </p>
      </div>;
  }
}
```

### options.allowDragOffBoard
Controls whether pieces can be dragged off the board.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling the ability to drag pieces off the board.

#### Warning
Due to how Storybook renders canvases in iframes, and how the preventDragOffBoard modifier works by calculating the position of the piece and the board, this story example will not work in the Storybook preview.

As a result, if your application adjusts the position of the board in a similar way with iframes, you may face similar issues. To see the example in action, please run the example in your own project.

```
Allow dragging pieces off board
```

Try dragging a piece off the board when the checkbox is unchecked

```tsx
{
  render: () => {
    const [allowDragOffBoard, setAllowDragOffBoard] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDragOffBoard,
      id: 'allow-drag-off-board'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={allowDragOffBoard} onChange={e => setAllowDragOffBoard(e.target.checked)} />
          Allow dragging pieces off board
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Try dragging a piece off the board when the checkbox is unchecked
        </p>
      </div>;
  }
}
```

### options.allowDrawingArrows
Controls whether additional arrows can be added by holding down the right mouse button and dragging the mouse over the board.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling the ability to add arrows to the board.

```
Allow drawing arrows
```

Toggle the checkbox to enable/disable drawing arrows by holding right click and dragging

```tsx
{
  render: () => {
    const [allowDrawingArrows, setAllowDrawingArrows] = useState(true);

    // chessboard options
    const chessboardOptions = {
      allowDrawingArrows,
      id: 'allow-drawing-arrows'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={allowDrawingArrows} onChange={e => setAllowDrawingArrows(e.target.checked)} />
          Allow drawing arrows
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to enable/disable drawing arrows by holding right
          click and dragging
        </p>
      </div>;
  }
}
```

### options.alphaNotationStyle
Controls the styling of the alpha notation (a-h) on the board. If you wish to instead hide the notation, set showNotation to false.

If you wish to display different styles of notation on different coloured squares, you can use the darkSquareNotationStyle and lightSquareNotationStyle props.

**Default value:**
```json
{
  "fontSize": "13px",
  "position": "absolute",
  "bottom": 1,
  "right": 4,
  "userSelect": "none"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the appearance of the board notation coordinates.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      alphaNotationStyle: {
        color: 'cyan',
        fontSize: '20px',
        fontWeight: 'bold'
      },
      id: 'alpha-notation-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.animationDurationInMs
Controls the duration of piece movement animations in milliseconds.

**Default value:** `300`

**TypeScript type:** `number`

**Standard use case:** Adjusting the speed of piece movements to match your application's feel.

```
Animation duration (ms):
300ms
```

Play against random moves. Try moving pieces to see the animation effects

```tsx
{
  render: () => {
    // create a chess game using a ref to always have access to the latest game state within closures and maintain the game state across renders
    const chessGameRef = useRef(new Chess());
    const chessGame = chessGameRef.current;

    // track the animation duration in state
    const [animationDuration, setAnimationDuration] = useState(300);

    // track the current position of the chess game in state to trigger a re-render of the chessboard
    const [chessPosition, setChessPosition] = useState(chessGame.fen());

    // make a random "CPU" move
    function makeRandomMove() {
      // get all possible moves
      const possibleMoves = chessGame.moves();

      // exit if the game is over
      if (chessGame.isGameOver()) {
        return;
      }

      // pick a random move
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // make the move
      chessGame.move(randomMove);

      // update the position state
      setChessPosition(chessGame.fen());
    }

    // handle piece drop
    const onPieceDrop = ({
      sourceSquare,
      targetSquare
    }: PieceDropHandlerArgs) => {
      if (!targetSquare) return false;
      try {
        chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q' // always promote to a queen for example simplicity
        });

        // update the position state
        setChessPosition(chessGame.fen());

        // make random cpu move after a short delay
        setTimeout(makeRandomMove, 500);

        // return true as the move was successful
        return true;
      } catch {
        // return false as the move was not successful
        return false;
      }
    };

    // chessboard options
    const chessboardOptions = {
      animationDurationInMs: animationDuration,
      position: chessPosition,
      onPieceDrop,
      id: 'animation-duration-in-ms'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
          Animation duration (ms):
          <input type="range" min="0" max="1000" step="50" value={animationDuration} onChange={e => setAnimationDuration(Number(e.target.value))} />
          {animationDuration}ms
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Play against random moves. Try moving pieces to see the animation
          effects
        </p>
      </div>;
  }
}
```

### options.arrows
Controls the base set of arrows on the board. By default, additional arrows can be added by holding down the right mouse button and dragging the mouse over the board. You can disable this by setting allowDrawingArrows to false.

By default, these arrows will not be automatically cleared when a square is clicked or a piece is dragged. Instead, you will need to clear them manually using the onSquareClick or onPieceDrag prop and pass in a new value for this prop.

**Default value:** `[]`

**TypeScript type:**
```typescript
{
  startSquare: string;
  endSquare: string;
  color: string;
}[];
```

**Standard use case:** Adding arrows to the board to indicate possible moves or attacks.

```
Generate Random Arrows
```

Click the button to generate 3 random arrows on the board.

```tsx
{
  render: () => {
    const [arrows, setArrows] = useState([{
      startSquare: 'e2',
      endSquare: 'e4',
      color: 'red'
    }, {
      startSquare: 'g1',
      endSquare: 'f3',
      color: 'blue'
    }, {
      startSquare: 'c1',
      endSquare: 'g5',
      color: 'green'
    }]);
    const generateRandomArrows = () => {
      // Get 6 unique squares (3 pairs of start/end squares)
      const uniqueSquares = getUniqueSquares(6);
      const colors = ['red', 'blue', 'green'];
      const newArrows = Array.from({
        length: 3
      }, (_, index) => ({
        startSquare: uniqueSquares[index * 2],
        endSquare: uniqueSquares[index * 2 + 1],
        color: colors[index]
      }));
      setArrows(newArrows);
    };

    // chessboard options
    const chessboardOptions = {
      arrows,
      id: 'arrows'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <button onClick={generateRandomArrows}>Generate Random Arrows</button>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Click the button to generate 3 random arrows on the board.
        </p>
      </div>;
  }
}
```

### options.arrowOptions
Controls the appearance and behavior of arrows on the board. This includes settings for arrow colors, width, length, and opacity.

**Arrow colors**
- `color`: Sets the default arrow color when no modifiers are held down when drawing an arrow
- `secondaryColor`: Sets the arrow color when shift is held down when drawing an arrow
- `tertiaryColor`: Sets the arrow color when control is held down when drawing an arrow

When drawing an arrow, you can hold down modifier keys to change the arrow color:
- Hold Shift to use `secondaryColor`
- Hold Control to use `tertiaryColor`
- If both Shift and Control are held down, Shift takes precedence

**Arrow length**
- `arrowLengthReducerDenominator`: Controls how much the arrow length is reduced. The lower the denominator, the greater the reduction (e.g. 8 = 1/8 of a square width removed, 4 = 1/4 of a square width removed)
- `sameTargetArrowLengthReducerDenominator`: Works the same way but specifically for arrows targeting the same square, using a greater reduction to avoid overlaps

**Arrow width**
- `arrowWidthDenominator`: Controls the width of the arrow. The lower the denominator, the greater the width (e.g. 5 = 1/5 of a square width, 10 = 1/10 of a square width)
- `activeArrowWidthMultiplier`: Sets the multiplier for the arrow width when it is being drawn

**Arrow opacity**
- `opacity`: Controls the opacity of arrows when not being drawn
- `activeOpacity`: Controls the opacity of arrows when they are being drawn

**Default value:**
```json
{
  "color": "#ffaa00",
  "secondaryColor": "#4caf50",
  "tertiaryColor": "#f44336",
  "arrowLengthReducerDenominator": 8,
  "sameTargetArrowLengthReducerDenominator": 4,
  "arrowWidthDenominator": 5,
  "activeArrowWidthMultiplier": 0.9,
  "opacity": 0.65,
  "activeOpacity": 0.5
}
```

**TypeScript type:**
```typescript
{
  color: string,
  secondaryColor: string,
  tertiaryColor: string,
  arrowLengthReducerDenominator: number,
  sameTargetArrowLengthReducerDenominator: number,
  arrowWidthDenominator: number,
  activeArrowWidthMultiplier: number,
  opacity: number,
  activeOpacity: number
}
```

**Standard use case:** Customizing the appearance of arrows to match your application's theme or to make them more or less prominent.

```
Primary Color:
Secondary Color:
Tertiary Color:
Arrow Length (1/8):
Same Target Arrow Length (1/4):
Arrow Width (1/5):
Opacity (0.65):
Active Opacity (0.5):
Active Width Multiplier (0.9x):
Reset to Default Settings
```

Adjust the controls above to customize arrow appearance. Click the button to reset to default settings.

```tsx
{
  render: () => {
    // default arrow settings
    const defaultArrowOptions = {
      color: '#ffaa00',
      secondaryColor: '#ffaa00',
      tertiaryColor: '#000000',
      arrowLengthReducerDenominator: 8,
      sameTargetArrowLengthReducerDenominator: 4,
      arrowWidthDenominator: 5,
      activeArrowWidthMultiplier: 0.9,
      opacity: 0.65,
      activeOpacity: 0.5
    };

    // arrows
    const arrows = [{
      startSquare: 'e2',
      endSquare: 'e4',
      color: '#ffaa00'
    }, {
      startSquare: 'g1',
      endSquare: 'f3',
      color: '#ffaa00'
    }, {
      startSquare: 'd2',
      endSquare: 'd4',
      color: '#ffaa00'
    }, {
      startSquare: 'b1',
      endSquare: 'c3',
      color: '#ffaa00'
    }, {
      startSquare: 'f1',
      endSquare: 'b5',
      color: '#ffaa00'
    }];

    // arrow settings
    const [arrowOptions, setarrowOptions] = useState(defaultArrowOptions);

    // chessboard options
    const chessboardOptions = {
      arrows,
      arrowOptions,
      id: 'arrow-options'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        width: '100%',
        maxWidth: '800px'
      }}>
          {/* Colors */}
          <div>
            <label>Primary Color:</label>
            <input type="color" value={arrowOptions.color} onChange={e => setarrowOptions({
            ...arrowOptions,
            color: e.target.value
          })} />
          </div>
          <div>
            <label>Secondary Color:</label>
            <input type="color" value={arrowOptions.secondaryColor} onChange={e => setarrowOptions({
            ...arrowOptions,
            secondaryColor: e.target.value
          })} />
          </div>
          <div>
            <label>Tertiary Color:</label>
            <input type="color" value={arrowOptions.tertiaryColor} onChange={e => setarrowOptions({
            ...arrowOptions,
            tertiaryColor: e.target.value
          })} />
          </div>

          {/* Lengths */}
          <div>
            <label>
              Arrow Length (1/{arrowOptions.arrowLengthReducerDenominator}):
            </label>
            <input type="range" min="2" max="16" value={arrowOptions.arrowLengthReducerDenominator} onChange={e => setarrowOptions({
            ...arrowOptions,
            arrowLengthReducerDenominator: Number(e.target.value)
          })} />
          </div>
          <div>
            <label>
              Same Target Arrow Length (1/
              {arrowOptions.sameTargetArrowLengthReducerDenominator}):
            </label>
            <input type="range" min="2" max="16" value={arrowOptions.sameTargetArrowLengthReducerDenominator} onChange={e => setarrowOptions({
            ...arrowOptions,
            sameTargetArrowLengthReducerDenominator: Number(e.target.value)
          })} />
          </div>
          <div>
            <label>Arrow Width (1/{arrowOptions.arrowWidthDenominator}):</label>
            <input type="range" min="2" max="20" value={arrowOptions.arrowWidthDenominator} onChange={e => setarrowOptions({
            ...arrowOptions,
            arrowWidthDenominator: Number(e.target.value)
          })} />
          </div>

          {/* Opacity and Active Settings */}
          <div>
            <label>Opacity ({arrowOptions.opacity}):</label>
            <input type="range" min="0" max="1" step="0.05" value={arrowOptions.opacity} onChange={e => setarrowOptions({
            ...arrowOptions,
            opacity: Number(e.target.value)
          })} />
          </div>
          <div>
            <label>Active Opacity ({arrowOptions.activeOpacity}):</label>
            <input type="range" min="0" max="1" step="0.05" value={arrowOptions.activeOpacity} onChange={e => setarrowOptions({
            ...arrowOptions,
            activeOpacity: Number(e.target.value)
          })} />
          </div>
          <div>
            <label>
              Active Width Multiplier ({arrowOptions.activeArrowWidthMultiplier}
              x):
            </label>
            <input type="range" min="0.1" max="2" step="0.1" value={arrowOptions.activeArrowWidthMultiplier} onChange={e => setarrowOptions({
            ...arrowOptions,
            activeArrowWidthMultiplier: Number(e.target.value)
          })} />
          </div>
        </div>

        <button onClick={() => setarrowOptions(defaultArrowOptions)}>
          Reset to Default Settings
        </button>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Adjust the controls above to customize arrow appearance. Click the
          button to reset to default settings.
        </p>
      </div>;
  }
}
```

### options.boardOrientation
Controls the orientation of the board. When set to "black", the board is flipped so black pieces are at the bottom.

**Default value:** `"white"`

**TypeScript type:** `"white" | "black"`

**Standard use case:** Allowing players to view the board from the perspective of the pieces they are playing with.

```
White at bottomBlack at bottom
```

Toggle the radio buttons to change the board orientation

```tsx
{
  render: () => {
    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

    // chessboard options
    const chessboardOptions = {
      boardOrientation,
      id: 'board-orientation'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          <label>
            <input type="radio" checked={boardOrientation === 'white'} onChange={() => setBoardOrientation('white')} />
            White at bottom
          </label>
          <label style={{
          marginLeft: '1rem'
        }}>
            <input type="radio" checked={boardOrientation === 'black'} onChange={() => setBoardOrientation('black')} />
            Black at bottom
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the radio buttons to change the board orientation
        </p>
      </div>;
  }
}
```

### options.boardStyle
Controls the styling of the entire chessboard container.

**Default value:**
```json
{
  "display": "grid",
  "gridTemplateColumns": `repeat(${chessboardColumns}, 1fr)`,
  "overflow": "hidden",
  "width": "100%",
  "height": "100%",
  "position": "relative"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Adding custom styling like borders, shadows, or rounded corners to the board.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      boardStyle: {
        borderRadius: '10px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)',
        border: '1px solid #000',
        margin: '20px 0'
      },
      id: 'board-style'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
        <Chessboard options={chessboardOptions} />
      </div>;
  }
}
```

### options.canDragPiece
Controls whether a piece can be dragged.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  isSparePiece: boolean;
  piece: { pieceType: string };
  square: string | null;
}) => boolean;
```

**Standard use case:** Restricting piece dragging to certain pieces or squares.

```
Only white pieces can be dragged
```

```tsx
{
  render: () => {
    function canDragPiece({
      piece
    }: PieceHandlerArgs) {
      return piece.pieceType[0] === 'w';
    }

    // chessboard options
    const chessboardOptions = {
      canDragPiece,
      id: 'can-drag-piece'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Only white pieces can be dragged
        </p>
      </div>;
  }
}
```

### options.chessboardColumns
Controls the number of columns on the chessboard. If you set either of the row or column options above 9, you will need to use the positionObject notation for the position prop, as fen notation only supports single digit columns.

**Default value:** `8`

**TypeScript type:** `number`

**Standard use case:** Creating custom chess variants with different board sizes.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      chessboardColumns: 16,
      id: 'chessboard-columns'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.chessboardRows
Controls the number of rows on the chessboard. If you set either of the row or column options above 9, you will need to use the positionObject notation for the position prop, as fen notation only supports single digit columns.

**Default value:** `8`

**TypeScript type:** `number`

**Standard use case:** Creating custom chess variants with different board sizes.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      chessboardRows: 16,
      position: {
        a1: {
          pieceType: 'wR'
        },
        a2: {
          pieceType: 'wP'
        },
        a15: {
          pieceType: 'bP'
        },
        a16: {
          pieceType: 'bR'
        },
        b1: {
          pieceType: 'wN'
        },
        b2: {
          pieceType: 'wP'
        },
        b15: {
          pieceType: 'bP'
        },
        b16: {
          pieceType: 'bN'
        },
        c1: {
          pieceType: 'wB'
        },
        c2: {
          pieceType: 'wP'
        },
        c15: {
          pieceType: 'bP'
        },
        c16: {
          pieceType: 'bB'
        },
        d1: {
          pieceType: 'wQ'
        },
        d2: {
          pieceType: 'wP'
        },
        d15: {
          pieceType: 'bP'
        },
        d16: {
          pieceType: 'bQ'
        },
        e1: {
          pieceType: 'wK'
        },
        e2: {
          pieceType: 'wP'
        },
        e15: {
          pieceType: 'bP'
        },
        e16: {
          pieceType: 'bK'
        },
        f1: {
          pieceType: 'wB'
        },
        f2: {
          pieceType: 'wP'
        },
        f15: {
          pieceType: 'bP'
        },
        f16: {
          pieceType: 'bB'
        },
        g1: {
          pieceType: 'wN'
        },
        g2: {
          pieceType: 'wP'
        },
        g15: {
          pieceType: 'bP'
        },
        g16: {
          pieceType: 'bN'
        },
        h1: {
          pieceType: 'wR'
        },
        h2: {
          pieceType: 'wP'
        },
        h15: {
          pieceType: 'bP'
        },
        h16: {
          pieceType: 'bR'
        }
      } as PositionDataType,
      id: 'chessboard-rows'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.clearArrowsOnClick
Controls whether internal arrows are cleared when a square is clicked. If you are passing in external arrows via the arrows prop, these will not be automatically cleared when a square is clicked. Instead, you will need to clear them manually using the onSquareClick prop and pass in a new value for the arrows prop.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling the ability to clear internal arrows when a square is clicked.

```
Clear arrows on click
```

Toggle the checkbox to enable/disable clearing arrows when clicking on a square

```tsx
{
  render: () => {
    const [clearArrowsOnClick, setClearArrowsOnClick] = useState(true);
    const [arrows] = useState([{
      startSquare: 'e2',
      endSquare: 'e4',
      color: 'red'
    }, {
      startSquare: 'g1',
      endSquare: 'f3',
      color: 'blue'
    }]);

    // chessboard options
    const chessboardOptions = {
      arrows,
      clearArrowsOnClick,
      id: 'clear-arrows-on-click'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={clearArrowsOnClick} onChange={e => setClearArrowsOnClick(e.target.checked)} />
          Clear arrows on click
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to enable/disable clearing arrows when clicking on
          a square
        </p>
      </div>;
  }
}
```

### options.clearArrowsOnPositionChange
Controls whether internal arrows are cleared when the position changes. If you are passing in external arrows via the arrows prop, these will not be automatically cleared when the position changes. Instead, you will need to clear them manually when updating the position and pass in a new value for the arrows prop.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling the ability to clear internal arrows when the position changes.

```
Clear arrows on position change
Generate random FEN position
```

Toggle the checkbox to enable/disable clearing arrows when the position changes.

```tsx
{
  render: () => {
    const [clearArrowsOnPositionChange, setClearArrowsOnPositionChange] = useState(true);
    const [arrows] = useState([{
      startSquare: 'e2',
      endSquare: 'e4',
      color: 'red'
    }, {
      startSquare: 'g1',
      endSquare: 'f3',
      color: 'blue'
    }]);
    const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

    // generate random FEN position
    function generateRandomFen() {
      const pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
      let fen = '';

      // create 8 rows of random pieces
      for (let i = 0; i < 8; i++) {
        let emptyCount = 0;

        // create 8 columns of random pieces or empty squares
        for (let j = 0; j < 8; j++) {
          if (Math.random() < 0.2) {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            fen += pieces[Math.floor(Math.random() * pieces.length)];
          } else {
            emptyCount++;
          }
        }

        // add empty count to FEN string if there are empty squares
        if (emptyCount > 0) {
          fen += emptyCount;
        }

        // add slash between rows
        if (i < 7) {
          fen += '/';
        }
      }

      // set the position
      setPosition(fen);
    }

    // chessboard options
    const chessboardOptions = {
      arrows,
      clearArrowsOnPositionChange,
      id: 'clear-arrows-on-click',
      position
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={clearArrowsOnPositionChange} onChange={e => setClearArrowsOnPositionChange(e.target.checked)} />
          Clear arrows on position change
        </label>

        <button onClick={generateRandomFen}>
          Generate random FEN position
        </button>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to enable/disable clearing arrows when the
          position changes.
        </p>
      </div>;
  }
}
```

### options.darkSquareNotationStyle
Controls the styling of notation on dark squares. If you wish to instead hide the notation, set showNotation to false.

This is separate from the alphaNotationStyle prop, which controls the styling of the notation on all alpha squares.

alphaNotationStyle and numericNotationStyle will take precedence over this style for any clashing properties.

**Default value:**
```json
{
  "color": "#F0D9B5"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Ensuring notation is readable on dark squares by adjusting color and size.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      darkSquareNotationStyle: {
        color: 'cyan',
        fontWeight: 'bold'
      },
      id: 'dark-square-notation-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.darkSquareStyle
Controls the styling of dark squares on the board.

**Default value:**
```json
{
  "backgroundColor": "#B58863"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the appearance of dark squares to match your application's theme.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      darkSquareStyle: {
        backgroundColor: 'cyan'
      },
      id: 'dark-square-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.dragActivationDistance
Controls the distance in pixels that the mouse needs to move before a piece can be dragged. Note that setting this to 0 will cause issues with the onPieceClick event firing because the click will be registered as a drag instead.

**Default value:** `1`

**TypeScript type:** `number`

**Standard use case:** Preventing accidental piece dragging when clicking on a piece.

```
Drag activation distance:
2px
```

Adjust the slider to change how far you need to drag a piece before it starts moving

```tsx
{
  render: () => {
    const [dragActivationDistance, setDragActivationDistance] = useState(2);

    // chessboard options
    const chessboardOptions = {
      dragActivationDistance,
      id: 'drag-activation-distance'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
          Drag activation distance:
          <input type="range" min="0" max="20" step="1" value={dragActivationDistance} onChange={e => setDragActivationDistance(Number(e.target.value))} />
          {dragActivationDistance}px
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Adjust the slider to change how far you need to drag a piece before it
          starts moving
        </p>
      </div>;
  }
}
```

### options.draggingPieceStyle
Controls the styling of the piece being dragged. This allows you to customise the appearance of the piece while it's being dragged, such as scaling it up, adding a shadow, or rotating it.

**Default value:**
```json
{
  "transform": "scale(1.2)"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Enhancing the visual feedback when dragging pieces, such as making the dragged piece larger or adding effects to make it stand out.

```
Scale:
1.2x
Rotate:
0°
```

Drag a piece to see the custom dragging style. Adjust the sliders to change the scale and rotation of the dragged piece.

```tsx
{
  render: () => {
    const [scale, setScale] = useState(1.2);
    const [rotate, setRotate] = useState(0);

    // chessboard options
    const chessboardOptions = {
      draggingPieceStyle: {
        transform: `scale(${scale}) rotate(${rotate}deg)`
      },
      id: 'dragging-piece-style'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        gap: '2rem'
      }}>
          <label style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
            Scale:
            <input type="range" min="1" max="2" step="0.1" value={scale} onChange={e => setScale(Number(e.target.value))} />
            {scale}x
          </label>

          <label style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
            Rotate:
            <input type="range" min="-180" max="180" step="15" value={rotate} onChange={e => setRotate(Number(e.target.value))} />
            {rotate}°
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Drag a piece to see the custom dragging style. Adjust the sliders to
          change the scale and rotation of the dragged piece.
        </p>
      </div>;
  }
}
```

### options.draggingPieceGhostStyle
Controls the styling of the ghost piece that remains in the original square while dragging. This allows you to customize the appearance of the ghost piece, such as its opacity or blur effect.

**Default value:**
```json
{
  "opacity": 0.5
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the visual feedback of the ghost piece to make it more or less prominent while dragging.

```
Opacity:
0.5
Blur:
0px
```

Drag a piece to see the ghost piece style. Adjust the sliders to change the opacity and blur of the ghost piece.

```tsx
{
  render: () => {
    const [opacity, setOpacity] = useState(0.5);
    const [blur, setBlur] = useState(0);

    // chessboard options
    const chessboardOptions = {
      draggingPieceGhostStyle: {
        opacity,
        filter: `blur(${blur}px)`
      },
      id: 'dragging-piece-ghost-style'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        gap: '2rem'
      }}>
          <label style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
            Opacity:
            <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
            {opacity}
          </label>

          <label style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
            Blur:
            <input type="range" min="0" max="10" step="1" value={blur} onChange={e => setBlur(Number(e.target.value))} />
            {blur}px
          </label>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Drag a piece to see the ghost piece style. Adjust the sliders to
          change the opacity and blur of the ghost piece.
        </p>
      </div>;
  }
}
```

### options.dropSquareStyle
Controls the styling of squares when a piece is being dragged over them.

**Default value:**
```json
{
  "boxShadow": "inset 0px 0px 0px 1px black"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Making it clear to users which squares are valid drop targets.

```
Drag a piece to see a custom drop square style
```

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      dropSquareStyle: {
        boxShadow: 'inset 0px 0px 0px 5px red'
      },
      id: 'drop-square-style'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Drag a piece to see a custom drop square style
        </p>
      </div>;
  }
}
```

### options.id
Sets the id of the chessboard component. This is useful for handling multiple chessboards on the same page or directly targeting the chessboard component with JS or CSS.

**Default value:** `"chessboard"`

**TypeScript type:** `string`

**Standard use case:** Handling multiple chessboards on the same page or directly targeting the chessboard component with JS or CSS.

### options.lightSquareNotationStyle
Controls the styling of notation on light squares. If you wish to instead hide the notation, set showNotation to false.

This is separate from the alphaNotationStyle prop, which controls the styling of the notation on all alpha squares.

alphaNotationStyle and numericNotationStyle will take precedence over this style for any clashing properties.

**Default value:**
```json
{
  "color": "#B58863"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Ensuring notation is readable on light squares by adjusting color and size.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      lightSquareNotationStyle: {
        color: 'blue',
        fontWeight: 'bold'
      },
      id: 'light-square-notation-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.lightSquareStyle
Controls the styling of light squares on the board.

**Default value:**
```json
{
  "backgroundColor": "#F0D9B5"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the appearance of light squares to match your application's theme.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      lightSquareStyle: {
        backgroundColor: 'cyan'
      },
      id: 'light-square-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.numericNotationStyle
Controls the styling of the numeric notation (1-8) on the board. If you wish to instead hide the notation, set showNotation to false.

If you wish to display different styles of notation on different coloured squares, you can use the darkSquareNotationStyle and lightSquareNotationStyle props.

**Default value:**
```json
{
  "fontSize": "13px",
  "position": "absolute",
  "top": 2,
  "left": 2,
  "userSelect": "none"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the appearance of the board notation coordinates.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      numericNotationStyle: {
        color: 'cyan',
        fontSize: '20px',
        fontWeight: 'bold'
      },
      id: 'numeric-notation-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.onArrowsChange
Handler for when internal arrows change. This is useful for updating external state or re-rendering when arrows are added or removed.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  arrows: Arrow[];
}) => void;
```

**Standard use case:** Updating the state of arrows when they are added or removed.

```
Current Internal Arrows:
No arrows drawn

Arrow Change History:
Change 1: 0 arrow(s)
Change 2: 0 arrow(s)
Clear History
```

Right-click and drag to draw arrows. The onArrowsChange callback will be triggered whenever internal arrows are added or removed.

```tsx
{
  render: () => {
    const [internalArrows, setInternalArrows] = useState<Arrow[]>([]);
    const [arrowHistory, setArrowHistory] = useState<Arrow[][]>([]);

    // handle arrows change
    const onArrowsChange = ({
      arrows
    }: {
      arrows: Arrow[];
    }) => {
      setInternalArrows(arrows);
      setArrowHistory(prev => [...prev, arrows]);
    };

    // clear arrow history
    const clearHistory = () => {
      setArrowHistory([]);
    };

    // chessboard options
    const chessboardOptions = {
      onArrowsChange,
      id: 'on-arrows-change'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          <h4>Current Internal Arrows:</h4>
          <div style={{
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}>
            {internalArrows.length === 0 ? <span style={{
            color: '#666'
          }}>No arrows drawn</span> : internalArrows.map((arrow, index) => <div key={index} style={{
            marginBottom: '0.25rem'
          }}>
                  {arrow.startSquare} → {arrow.endSquare} ({arrow.color})
                </div>)}
          </div>

          <h4>Arrow Change History:</h4>
          <div style={{
          fontSize: '0.8rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
            {arrowHistory.length === 0 ? <span style={{
            color: '#666'
          }}>No changes yet</span> : arrowHistory.map((arrows, index) => <div key={index} style={{
            marginBottom: '0.5rem',
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
                  <strong>Change {index + 1}:</strong> {arrows.length} arrow(s)
                  {arrows.length > 0 && <div style={{
              marginTop: '0.25rem'
            }}>
                      {arrows.map((arrow, arrowIndex) => <div key={arrowIndex} style={{
                fontSize: '0.75rem',
                color: '#666'
              }}>
                          {arrow.startSquare} → {arrow.endSquare}
                        </div>)}
                    </div>}
                </div>)}
          </div>

          <button onClick={clearHistory} style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          fontSize: '0.8rem'
        }}>
            Clear History
          </button>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Right-click and drag to draw arrows. The onArrowsChange callback will
          be triggered whenever internal arrows are added or removed.
        </p>
      </div>;
  }
}
```

### options.onMouseOutSquare
Callback function triggered when the mouse leaves a square. Entering a drag state will trigger this event, but whilst dragging, no further events will be triggered until the drag ends and the mouse leaves a square again.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}) => void;
```

**Standard use case:** Implementing hover effects or tooltips for squares.

```
Last square mouse left: None
Piece in last square mouse left: None
```

Move your mouse over and out of squares to see the mouse out events

```tsx
{
  render: () => {
    const [lastOutSquare, setLastOutSquare] = useState<string>('None');
    const [lastOutPiece, setLastOutPiece] = useState<string | null>('None');

    // handle mouse out square
    const onMouseOutSquare = ({
      square,
      piece
    }: SquareHandlerArgs) => {
      setLastOutSquare(square);
      setLastOutPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onMouseOutSquare,
      id: 'on-mouse-out-square'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Last square mouse left: {lastOutSquare}
          <br />
          Piece in last square mouse left: {lastOutPiece}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Move your mouse over and out of squares to see the mouse out events
        </p>
      </div>;
  }
}
```

### options.onMouseOverSquare
Callback function triggered when the mouse enters a square.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}) => void;
```

**Standard use case:** Implementing hover effects or tooltips for squares.

```
Last square mouse entered: None
Piece in last square mouse entered: None
```

Move your mouse over squares to see the mouse over events

```tsx
{
  render: () => {
    const [lastOverSquare, setLastOverSquare] = useState<string>('None');
    const [lastOverPiece, setLastOverPiece] = useState<string | null>('None');

    // handle mouse over square
    const onMouseOverSquare = ({
      square,
      piece
    }: SquareHandlerArgs) => {
      setLastOverSquare(square);
      setLastOverPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onMouseOverSquare,
      id: 'on-mouse-over-square'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Last square mouse entered: {lastOverSquare}
          <br />
          Piece in last square mouse entered: {lastOverPiece}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Move your mouse over squares to see the mouse over events
        </p>
      </div>;
  }
}
```

### options.onPieceClick
Callback function triggered when a piece is clicked. This callback will only be triggered if allowDragging is set to false.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  isSparePiece: boolean;
  piece: { pieceType: string };
  square: string | null;
}) => void;
```

**Standard use case:** Implementing custom piece selection or movement logic such as click to move.

```
Clicked square: None
Clicked piece: None
Is spare piece: No
```

Click on pieces to see the click events

```tsx
{
  render: () => {
    const [clickedSquare, setClickedSquare] = useState<string>('None');
    const [clickedPiece, setClickedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece click
    const onPieceClick = ({
      square,
      piece,
      isSparePiece
    }: PieceHandlerArgs) => {
      setClickedSquare(square || 'None');
      setClickedPiece(piece.pieceType);
      setIsSparePiece(isSparePiece);
    };

    // chessboard options
    const chessboardOptions = {
      allowDragging: false,
      onPieceClick,
      id: 'on-piece-click'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Clicked square: {clickedSquare}
          <br />
          Clicked piece: {clickedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Click on pieces to see the click events
        </p>
      </div>;
  }
}
```

### options.onPieceDrag
Callback function triggered when a piece drag operation starts.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  isSparePiece: boolean;
  piece: { pieceType: string };
  square: string | null;
}) => void;
```

**Standard use case:** Implementing custom drag and drop behavior or validation.

```
Dragged from square: None
Dragged piece: None
Is spare piece: No
```

Start dragging pieces to see the drag start events

```tsx
{
  render: () => {
    const [draggedSquare, setDraggedSquare] = useState<string>('None');
    const [draggedPiece, setDraggedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece drag start
    const onPieceDrag = ({
      square,
      piece,
      isSparePiece
    }: PieceHandlerArgs) => {
      setDraggedSquare(square || 'None');
      setDraggedPiece(piece.pieceType);
      setIsSparePiece(isSparePiece);
    };

    // chessboard options
    const chessboardOptions = {
      onPieceDrag,
      id: 'on-piece-drag-start'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Dragged from square: {draggedSquare}
          <br />
          Dragged piece: {draggedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Start dragging pieces to see the drag start events
        </p>
      </div>;
  }
}
```

### options.onPieceDrop
Callback function triggered when a piece is dropped. Return true to indicate a successful move to set some internal state. Return false to indicate a failed move to reset the internal state.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { isSparePiece: boolean, pieceType: string, position: string };
  sourceSquare: string;
  targetSquare: string | null;
}) => boolean;
```

**Standard use case:** Validating moves or implementing custom move logic.

```
Source square: None
Target square: None
Dropped piece: None
Is spare piece: No
```

Drag and drop pieces to see the drop events

```tsx
{
  render: () => {
    const [sourceSquare, setSourceSquare] = useState<string>('None');
    const [targetSquare, setTargetSquare] = useState<string>('None');
    const [droppedPiece, setDroppedPiece] = useState<string>('None');
    const [isSparePiece, setIsSparePiece] = useState<boolean>(false);

    // handle piece drop
    const onPieceDrop = ({
      sourceSquare,
      targetSquare,
      piece
    }: PieceDropHandlerArgs) => {
      setSourceSquare(sourceSquare);
      setTargetSquare(targetSquare || 'None');
      setDroppedPiece(piece.pieceType);
      setIsSparePiece(piece.isSparePiece);
      return true; // Allow the drop
    };

    // chessboard options
    const chessboardOptions = {
      onPieceDrop,
      id: 'on-piece-drop'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div>
          Source square: {sourceSquare}
          <br />
          Target square: {targetSquare}
          <br />
          Dropped piece: {droppedPiece}
          <br />
          Is spare piece: {isSparePiece ? 'Yes' : 'No'}
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Drag and drop pieces to see the drop events
        </p>
      </div>;
  }
}
```

### options.onSquareClick
Callback function triggered when a square is clicked.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}) => void;
```

**Standard use case:** Implementing custom square selection or movement logic.

```
Clicked square: None
Piece in clicked square: None
```

Click on squares to see the click events in action

```tsx
{
  render: () => {
    const [clickedSquare, setClickedSquare] = useState<string | null>(null);
    const [clickedPiece, setClickedPiece] = useState<string | null>(null);

    // handle square click
    const onSquareClick = ({
      square,
      piece
    }: SquareHandlerArgs) => {
      setClickedSquare(square);
      setClickedPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onSquareClick,
      id: 'on-square-click'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <div>Clicked square: {clickedSquare || 'None'}</div>
          <div>Piece in clicked square: {clickedPiece || 'None'}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Click on squares to see the click events in action
        </p>
      </div>;
  }
}
```

### options.onSquareMouseDown
Callback function triggered when a mouse button is pressed down on a square.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}, e: React.MouseEvent) => void;
```

**Standard use case:** Implementing custom interactions or visual feedback on mouse down events.

```
Mouse last pressed in: None
Piece in square: None
Button pressed: None
```

Press mouse button down on squares to see the mouse down events in action

```tsx
{
  render: () => {
    const [mouseDownSquare, setMouseDownSquare] = useState<string | null>(null);
    const [mouseDownPiece, setMouseDownPiece] = useState<string | null>(null);
    const [buttonPressed, setButtonPressed] = useState<string | null>(null);

    // handle square click
    const onSquareMouseDown = ({
      square,
      piece
    }: SquareHandlerArgs, e: React.MouseEvent) => {
      setMouseDownSquare(square);
      setMouseDownPiece(piece?.pieceType || null);
      setButtonPressed(e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : e.button === 2 ? 'Right' : `Button ${e.button}`);
    };

    // chessboard options
    const chessboardOptions = {
      onSquareMouseDown,
      id: 'on-square-mouse-down'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <div>Mouse last pressed in: {mouseDownSquare || 'None'}</div>
          <div>Piece in square: {mouseDownPiece || 'None'}</div>
          <div>Button pressed: {buttonPressed || 'None'}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Press mouse button down on squares to see the mouse down events in
          action
        </p>
      </div>;
  }
}
```

### options.onSquareMouseUp
Callback function triggered when a mouse button is released on a square.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}, e: React.MouseEvent) => void;
```

**Standard use case:** Implementing custom interactions or visual feedback on mouse up events.

```
Mouse released in square: None
Piece in square: None
Button released: None
```

Release mouse button on squares to see the mouse up events in action

```tsx
{
  render: () => {
    const [mouseUpSquare, setMouseUpSquare] = useState<string | null>(null);
    const [mouseUpPiece, setMouseUpPiece] = useState<string | null>(null);
    const [buttonReleased, setButtonReleased] = useState<string | null>(null);

    // handle square click
    const onSquareMouseUp = ({
      square,
      piece
    }: SquareHandlerArgs, e: React.MouseEvent) => {
      setMouseUpSquare(square);
      setMouseUpPiece(piece?.pieceType || null);
      setButtonReleased(e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : e.button === 2 ? 'Right' : `Button ${e.button}`);
    };

    // chessboard options
    const chessboardOptions = {
      onSquareMouseUp,
      id: 'on-square-mouse-up'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <div>Mouse released in square: {mouseUpSquare || 'None'}</div>
          <div>Piece in square: {mouseUpPiece || 'None'}</div>
          <div>Button released: {buttonReleased || 'None'}</div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Release mouse button on squares to see the mouse up events in action
        </p>
      </div>;
  }
}
```

### options.onSquareRightClick
Callback function triggered when a square is right-clicked.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
}) => void;
```

**Standard use case:** Implementing context menus or alternative interaction methods.

```
Right-clicked square: None
Piece in right-clicked square: None
```

Right-click on squares to see the right-click events in action

```tsx
{
  render: () => {
    const [rightClickedSquare, setRightClickedSquare] = useState<string | null>(null);
    const [rightClickedPiece, setRightClickedPiece] = useState<string | null>(null);

    // handle square right click
    const onSquareRightClick = ({
      square,
      piece
    }: SquareHandlerArgs) => {
      setRightClickedSquare(square);
      setRightClickedPiece(piece?.pieceType || null);
    };

    // chessboard options
    const chessboardOptions = {
      onSquareRightClick,
      id: 'on-square-right-click'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
          <div>Right-clicked square: {rightClickedSquare || 'None'}</div>
          <div>
            Piece in right-clicked square: {rightClickedPiece || 'None'}
          </div>
        </div>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Right-click on squares to see the right-click events in action
        </p>
      </div>;
  }
}
```

### options.pieces
Custom piece renderers for each piece type. You can use this to fully replace the default piece SVGs, extend the default piece SVGs to add custom piece SVGs for new piece types, or replace individual piece SVGs.

**Default value:** Default chess piece SVGs

**TypeScript type:** `Record<string, () => React.JSX.Element>`

**Standard use case:** Using custom piece designs or implementing different piece sets.

```tsx
{
  render: () => {
    const customPieces: PieceRenderObject = {
      ...defaultPieces,
      // exported from react-chessboard
      wK: () => <svg viewBox="0 0 24 24" fill="white">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>,
      bK: () => <svg viewBox="0 0 24 24" fill="black">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    };

    // chessboard options
    const chessboardOptions = {
      pieces: customPieces,
      id: 'pieces'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.position
The current position of the board in FEN notation or an object of square coordinates to piece type.

**Default value:** `"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"`

**TypeScript type:** `string | { [square: string]: { pieceType: string } }`

**Standard use case:** Setting up specific chess positions or updating the board state.

```
Generate random FEN position
Show animations
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

Click on the button to generate a random FEN position

```tsx
{
  render: () => {
    const [showAnimations, setShowAnimations] = useState(true);
    const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

    // generate random FEN position
    function generateRandomFen() {
      const pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
      let fen = '';

      // create 8 rows of random pieces
      for (let i = 0; i < 8; i++) {
        let emptyCount = 0;

        // create 8 columns of random pieces or empty squares
        for (let j = 0; j < 8; j++) {
          if (Math.random() < 0.2) {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            fen += pieces[Math.floor(Math.random() * pieces.length)];
          } else {
            emptyCount++;
          }
        }

        // add empty count to FEN string if there are empty squares
        if (emptyCount > 0) {
          fen += emptyCount;
        }

        // add slash between rows
        if (i < 7) {
          fen += '/';
        }
      }

      // set the position
      setPosition(fen);
    }

    // chessboard options
    const chessboardOptions = {
      position,
      showAnimations,
      id: 'position'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <button onClick={generateRandomFen}>
          Generate random FEN position
        </button>
        <label>
          <input type="checkbox" checked={showAnimations} onChange={() => setShowAnimations(!showAnimations)} />
          Show animations
        </label>
        <p>{position}</p>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Click on the button to generate a random FEN position
        </p>
      </div>;
  }
}
```

### options.showAnimations
Controls whether piece movements are animated.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Disabling animations for performance, accessibility, or design reasons.

```
Generate random FEN position
Show animations
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

Toggle the checkbox to enable/disable piece movement animations

```tsx
{
  render: () => {
    const [showAnimations, setShowAnimations] = useState(true);
    const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

    // generate random FEN position
    function generateRandomFen() {
      const pieces = ['r', 'n', 'b', 'q', 'k', 'p', 'R', 'N', 'B', 'Q', 'K', 'P'];
      let fen = '';

      // create 8 rows of random pieces
      for (let i = 0; i < 8; i++) {
        let emptyCount = 0;

        // create 8 columns of random pieces or empty squares
        for (let j = 0; j < 8; j++) {
          if (Math.random() < 0.2) {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            fen += pieces[Math.floor(Math.random() * pieces.length)];
          } else {
            emptyCount++;
          }
        }

        // add empty count to FEN string if there are empty squares
        if (emptyCount > 0) {
          fen += emptyCount;
        }

        // add slash between rows
        if (i < 7) {
          fen += '/';
        }
      }

      // set the position
      setPosition(fen);
    }

    // chessboard options
    const chessboardOptions = {
      allowDragging: false,
      position,
      showAnimations,
      id: 'show-animations'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <button onClick={generateRandomFen}>
          Generate random FEN position
        </button>
        <label>
          <input type="checkbox" checked={showAnimations} onChange={() => setShowAnimations(!showAnimations)} />
          Show animations
        </label>
        <p>{position}</p>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to enable/disable piece movement animations
        </p>
      </div>;
  }
}
```

### options.showNotation
Controls whether board coordinates are displayed.

**Default value:** `true`

**TypeScript type:** `boolean`

**Standard use case:** Hiding notation for a cleaner look or when space is limited.

```
Show notation
```

Toggle the checkbox to show/hide board coordinates

```tsx
{
  render: () => {
    const [showNotation, setShowNotation] = useState(true);

    // chessboard options
    const chessboardOptions = {
      showNotation,
      id: 'show-notation'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <label>
          <input type="checkbox" checked={showNotation} onChange={e => setShowNotation(e.target.checked)} />
          Show notation
        </label>

        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Toggle the checkbox to show/hide board coordinates
        </p>
      </div>;
  }
}
```

### options.squareRenderer
Controls the rendering of squares on the board. This allows you to fully replace the default square rendering with your own custom rendering.

**Default value:** `undefined`

**TypeScript type:**
```typescript
({
  piece: { pieceType: string } | null;
  square: string;
  children?: React.ReactNode;
}) => React.JSX.Element;
```

**Standard use case:** Customizing the appearance of squares to match your application's theme.

```
a8
b8
c8
d8
e8
f8
g8
h8
a7
b7
c7
d7
e7
f7
g7
h7
a6
b6
c6
d6
e6
f6
g6
h6
a5
b5
c5
d5
e5
f5
g5
h5
a4
b4
c4
d4
e4
f4
g4
h4
a3
b3
c3
d3
e3
f3
g3
h3
a2
b2
c2
d2
e2
f2
g2
h2
a1
b1
c1
d1
e1
f1
g1
h1
```

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions: ChessboardOptions = {
      squareRenderer: ({
        square,
        children
      }) => <div style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}>
          {children}

          <span style={{
          position: 'absolute',
          top: 0,
          right: 0
        }}>
            {square}
          </span>
        </div>,
      id: 'square-renderer'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.squareStyle
Controls the styling of all squares on the board, regardless of their colour.

**Default value:**
```json
{
  "aspectRatio": "1/1",
  "display": "flex",
  "justifyContent": "center",
  "alignItems": "center",
  "position": "relative"
}
```

**TypeScript type:** `React.CSSProperties`

**Standard use case:** Customizing the size or appearance of all squares uniformly.

```tsx
{
  render: () => {
    // chessboard options
    const chessboardOptions = {
      squareStyle: {
        border: '2px dashed #666',
        borderRadius: '8px',
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
        boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)'
      },
      id: 'square-style'
    };

    // render
    return <Chessboard options={chessboardOptions} />;
  }
}
```

### options.squareStyles
Controls the styling of individual squares on the board. This style will go over the top of any existing styles set with the squareStyle prop. This allows you to achieve effects like a background color over light and dark squares without needing to know whether the square is light or dark.

**Default value:** `{}`

**TypeScript type:** `Record<string, React.CSSProperties>`

**Standard use case:** Customizing the appearance of specific squares such as for right clicks on squares or premoves.

```
Right click on a square to add or remove a red background. Left click to remove all red backgrounds.
```

```tsx
{
  render: () => {
    const [squareStyles, setSquareStyles] = useState<Record<string, React.CSSProperties>>({
      e4: {
        backgroundColor: 'rgba(255,0,0,0.2)'
      }
    });
    function onSquareClick() {
      setSquareStyles({});
    }

    // add or remove a style when a square is right clicked
    function onSquareRightClick(args: SquareHandlerArgs) {
      setSquareStyles(prev => {
        const newSquareStyles = {
          ...prev
        };
        if (newSquareStyles[args.square]) {
          delete newSquareStyles[args.square];
        } else {
          newSquareStyles[args.square] = {
            backgroundColor: 'rgba(255,0,0,0.2)'
          };
        }
        return newSquareStyles;
      });
    }

    // chessboard options
    const chessboardOptions = {
      onSquareClick,
      onSquareRightClick,
      squareStyles,
      id: 'square-styles'
    };

    // render
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
        <Chessboard options={chessboardOptions} />

        <p style={{
        fontSize: '0.8rem',
        color: '#666'
      }}>
          Right click on a square to add or remove a red background. Left click
          to remove all red backgrounds.
        </p>
      </div>;
  }
}
```

---

# Utility Functions

React Chessboard exports several utility functions and types to help you work with the chessboard component. The functions handle various aspects of chess notation, board generation, and position management, and whilst not necessary to use the component, they may prove useful for consumers.

## Table of Contents
- Board Generation
  - generateBoard
- Chess Notation Conversion
  - rowIndexToChessRow
  - columnIndexToChessColumn
  - chessColumnToColumnIndex
  - chessRowToRowIndex
- Position Management
  - fenStringToPositionObject
  - getPositionUpdates
- Coordinate Calculation
  - getRelativeCoords
- Types
  - Arrow
  - SquareDataType
  - PieceDataType
  - DraggingPieceDataType
  - PositionDataType
  - SquareHandlerArgs
  - PieceHandlerArgs
  - PieceDropHandlerArgs
  - PieceRenderObject
  - FenPieceString

## Board Generation

### generateBoard
Generates a 2D array representing the chessboard with square information.

```typescript
function generateBoard(
  noOfRows: number,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
): SquareDataType[][];
```

**Parameters:**
- `noOfRows`: Number of rows in the board
- `noOfColumns`: Number of columns in the board
- `boardOrientation`: Board orientation ('white' or 'black')

**Returns:** A 2D array where each element contains:
- `squareId`: The chess notation for the square (e.g., "a8")
- `isLightSquare`: Boolean indicating if the square is light-colored

**Example:**
```typescript
// Generate a standard 8x8 chessboard in white orientation
const board = generateBoard(8, 8, 'white');

// Result for the first row (top row in white orientation):
[
  [
    { squareId: 'a8', isLightSquare: true },
    { squareId: 'b8', isLightSquare: false },
    { squareId: 'c8', isLightSquare: true },
    // ... and so on
  ],
  // ... remaining rows
];
```

## Chess Notation Conversion

### rowIndexToChessRow
Converts a row index to chess notation row number.

```typescript
function rowIndexToChessRow(
  row: number,
  noOfRows: number,
  boardOrientation: 'white' | 'black',
): string;
```

**Example:**
```typescript
// Convert row index 0 to chess notation in white orientation
rowIndexToChessRow(0, 8, 'white'); // Returns "8"

// Convert row index 0 to chess notation in black orientation
rowIndexToChessRow(0, 8, 'black'); // Returns "1"
```

### columnIndexToChessColumn
Converts a column index to chess notation column letter.

```typescript
function columnIndexToChessColumn(
  column: number,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
): string;
```

**Example:**
```typescript
// Convert column index 0 to chess notation in white orientation
columnIndexToChessColumn(0, 8, 'white'); // Returns "a"

// Convert column index 0 to chess notation in black orientation
columnIndexToChessColumn(0, 8, 'black'); // Returns "h"
```

### chessColumnToColumnIndex
Converts a chess notation column letter to column index.

```typescript
function chessColumnToColumnIndex(
  column: string,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
): number;
```

**Example:**
```typescript
// Convert chess notation "a" to column index in white orientation
chessColumnToColumnIndex('a', 8, 'white'); // Returns 0

// Convert chess notation "a" to column index in black orientation
chessColumnToColumnIndex('a', 8, 'black'); // Returns 7
```

### chessRowToRowIndex
Converts a chess notation row number to row index.

```typescript
function chessRowToRowIndex(
  row: string,
  noOfRows: number,
  boardOrientation: 'white' | 'black',
): number;
```

**Example:**
```typescript
// Convert chess notation "1" to row index in white orientation
chessRowToRowIndex('1', 8, 'white'); // Returns 7

// Convert chess notation "1" to row index in black orientation
chessRowToRowIndex('1', 8, 'black'); // Returns 0
```

## Position Management

### fenStringToPositionObject
Converts a FEN string to a position object.

```typescript
function fenStringToPositionObject(
  fen: string,
  noOfRows: number,
  noOfColumns: number,
): PositionDataType;
```

**Parameters:**
- `fen`: FEN string representing the chess position
- `noOfRows`: Number of rows in the board
- `noOfColumns`: Number of columns in the board

**Returns:** An object where keys are square positions (e.g., "e2") and values contain piece information.

**Example:**
```typescript
// Convert starting position FEN to position object
const position = fenStringToPositionObject(
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  8,
  8
);

// Result:
{
  'a8': { pieceType: 'bR' },
  'b8': { pieceType: 'bN' },
  'c8': { pieceType: 'bB' },
  // ... and so on
}
```

### getPositionUpdates
Calculates the moves made between two positions.

```typescript
function getPositionUpdates(
  oldPosition: PositionDataType,
  newPosition: PositionDataType,
  noOfColumns: number,
  boardOrientation: 'white' | 'black',
): { [square: string]: string };
```

**Parameters:**
- `oldPosition`: Previous position object
- `newPosition`: New position object
- `noOfColumns`: Number of columns in the board
- `boardOrientation`: Board orientation ('white' or 'black')

**Returns:** An object where keys are source squares and values are destination squares.

**Example:**
```typescript
// Calculate moves from e2e4
const updates = getPositionUpdates(
  {
    'e2': { pieceType: 'wP' }
  },
  {
    'e4': { pieceType: 'wP' }
  },
  8,
  'white'
);

// Result:
{
  'e2': 'e4'
}
```

## Coordinate Calculation

### getRelativeCoords
Calculates the center coordinates of a square relative to the board's top-left corner.

```typescript
function getRelativeCoords(
  boardOrientation: 'white' | 'black',
  boardWidth: number,
  chessboardColumns: number,
  chessboardRows: number,
  square: string,
): { x: number; y: number };
```

**Parameters:**
- `boardOrientation`: Board orientation ('white' or 'black')
- `boardWidth`: Width of the board in pixels
- `chessboardColumns`: Number of columns in the board
- `chessboardRows`: Number of rows in the board
- `square`: Chess notation for the square (e.g., "e2")

**Returns:** An object containing the x and y coordinates of the square's center.

**Example:**
```typescript
// Get coordinates for square e2 on a 400px wide board
const coords = getRelativeCoords('white', 400, 8, 8, 'e2');

// Result:
{
  x: 225, // center of the e file (4.5 * 50px)
  y: 350  // center of the 2nd rank (7 * 50px)
}
```

## Types

### Arrow
Represents an arrow on the chessboard.

```typescript
type Arrow = {
  startSquare: string; // e.g. "a8"
  endSquare: string; // e.g. "a7"
  color: string; // e.g. "#000000"
};
```

**Example:**
```typescript
const arrow: Arrow = {
  startSquare: 'e2',
  endSquare: 'e4',
  color: '#000000',
};
```

### SquareDataType
Represents a square on the chessboard.

```typescript
type SquareDataType = {
  squareId: string; // e.g. "a8"
  isLightSquare: boolean;
};
```

**Example:**
```typescript
const square: SquareDataType = {
  squareId: 'e4',
  isLightSquare: true,
};
```

### PieceDataType
Represents a chess piece.

```typescript
type PieceDataType = {
  pieceType: string; // e.g. "wP" for white pawn, "bK" for black king
};
```

**Example:**
```typescript
const piece: PieceDataType = {
  pieceType: 'wP', // white pawn
};
```

### DraggingPieceDataType
Represents a piece being dragged on the board.

```typescript
type DraggingPieceDataType = {
  isSparePiece: boolean;
  position: string; // e.g. "a8" or "wP"
  pieceType: string; // e.g. "wP" for white pawn, "bK" for black king
};
```

**Example:**
```typescript
const draggingPiece: DraggingPieceDataType = {
  isSparePiece: false,
  position: 'e2',
  pieceType: 'wP',
};
```

### PositionDataType
Represents the current position of all pieces on the board.

```typescript
type PositionDataType = {
  [square: string]: PieceDataType;
};
```

**Example:**
```typescript
const position: PositionDataType = {
  e4: { pieceType: 'wP' },
  e5: { pieceType: 'bP' },
};
```

### SquareHandlerArgs
Arguments passed to square click handlers.

```typescript
type SquareHandlerArgs = {
  piece: PieceDataType | null;
  square: string;
};
```

**Example:**
```typescript
const args: SquareHandlerArgs = {
  piece: { pieceType: 'wP' },
  square: 'e4',
};
```

### PieceHandlerArgs
Arguments passed to piece click handlers.

```typescript
type PieceHandlerArgs = {
  isSparePiece: boolean;
  piece: PieceDataType;
  square: string | null;
};
```

**Example:**
```typescript
const args: PieceHandlerArgs = {
  isSparePiece: false,
  piece: { pieceType: 'wP' },
  square: 'e4',
};
```

### PieceDropHandlerArgs
Arguments passed to piece drop handlers.

```typescript
type PieceDropHandlerArgs = {
  piece: DraggingPieceDataType;
  sourceSquare: string;
  targetSquare: string | null;
};
```

**Example:**
```typescript
const args: PieceDropHandlerArgs = {
  piece: {
    isSparePiece: false,
    position: 'e2',
    pieceType: 'wP',
  },
  sourceSquare: 'e2',
  targetSquare: 'e4',
};
```

### PieceRenderObject
Type for custom piece rendering functions.

```typescript
type PieceRenderObject = Record<
  string,
  (props?: {
    fill?: string;
    svgStyle?: React.CSSProperties;
  }) => React.JSX.Element
>;
```

**Example:**
```typescript
const customPieces: PieceRenderObject = {
  wP: ({ fill, svgStyle }) => (
    <svg viewBox="0 0 45 45" style={svgStyle}>
      <path
        d="M22.5 9c-2.21 0-4 1.79-4 4 0 .24.04.47.09.71-1.25.27-2.36.84-3.25 1.6-.89-.76-2-1.33-3.25-1.6.05-.24.09-.47.09-.71 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .24.04.47.09.71-1.25.27-2.36.84-3.25 1.6-.89-.76-2-1.33-3.25-1.6.05-.24.09-.47.09-.71 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 2.21 1.79 4 4 4h.5v12h-1v2h3v-2h-1v-12h.5c2.21 0 4-1.79 4-4 0-.24-.04-.47-.09-.71 1.25-.27 2.36-.84 3.25-1.6.89.76 2 1.33 3.25 1.6-.05.24-.09.47-.09.71 0 2.21 1.79 4 4 4s4-1.79 4-4c0-.24-.04-.47-.09-.71 1.25-.27 2.36-.84 3.25-1.6.89.76 2 1.33 3.25 1.6-.05.24-.09.47-.09.71 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z"
        fill={fill}
      />
    </svg>
  )
};
```

### FenPieceString
A string type representing a piece in FEN notation.

```typescript
type FenPieceString =
  | 'p' // black pawn
  | 'r' // black rook
  | 'n' // black knight
  | 'b' // black bishop
  | 'q' // black queen
  | 'k' // black king
  | 'P' // white pawn
  | 'R' // white rook
  | 'N' // white knight
  | 'B' // white bishop
  | 'Q' // white queen
  | 'K'; // white king
```

**Example:**
```typescript
const piece: FenPieceString = 'N'; // represents a white knight
```

---

# Upgrading to V5

This guide will help you upgrade your react-chessboard implementation from v4 to v5. The new version is a ground up rewrite that includes several breaking changes and new features that you'll need to be aware of.

React Chessboard v5 is 27% smaller minified and 19% smaller gzipped. With fewer dependencies, many more customisation options, and less opinionated internal logic.

## Breaking Changes

### React Version Requirement
Minimum react version is now 19.0.0

Update your react and react-dom dependencies:

```bash
pnpm add react@^19.0.0 react-dom@^19.0.0
# or
yarn add react@^19.0.0 react-dom@^19.0.0
# or
npm install react@^19.0.0 react-dom@^19.0.0
```

### Node.js Requirement
Minimum node version is now 20.11.0

### API Changes
The v5 release includes significant changes to the API. Here's a detailed comparison of the changes:

#### Props Renamed/Removed/Changed

| v4 Prop | v5 Change | Notes |
|---------|-----------|-------|
| allowDragOutsideBoard | Renamed to allowDragOffBoard | Same functionality, new name |
| animationDuration | Renamed to animationDurationInMs | Same functionality, more explicit name |
| areArrowsAllowed | Renamed to allowDrawingArrows | Same functionality, new name |
| arePiecesDraggable | Renamed to allowDragging | Same functionality, new name |
| arePremovesAllowed | Removed | Premoves should now be handled externally |
| autoPromoteToQueen | Removed | Promotion logic should now be handled externally |
| boardOrientation | Unchanged | - |
| boardWidth | Removed | The board is now responsive, CSS can be used to control board width |
| clearPremovesOnRightClick | Removed | Premove functionality should now be handled externally |
| customArrows | Renamed to arrows with new type | See API |
| customArrowColor | Renamed and moved to be part of arrowOptions | See API |
| customBoardStyle | Renamed to boardStyle | Same functionality, simplified name |
| customDarkSquareStyle | Renamed to darkSquareStyle | Same functionality, simplified name |
| customDndBackend | Removed | No longer required with move to @dnd-kit/core |
| customDndBackendOptions | Removed | No longer required with move to @dnd-kit/core |
| customDropSquareStyle | Renamed to dropSquareStyle | Same functionality, simplified name |
| customLightSquareStyle | Renamed to lightSquareStyle | Same functionality, simplified name |
| customNotationStyle | Split into alphaNotationStyle, numericNotationStyle, darkSquareNotationStyle, lightSquareNotationStyle | More granular control over notation styling |
| customPieces | Renamed to pieces with new type | See API |
| customPremoveDarkSquareStyle | Removed | Premove functionality should now be handled externally |
| customPremoveLightSquareStyle | Removed | Premove functionality should now be handled externally |
| customSquare | Renamed to squareRenderer with new type | See API |
| customSquareStyles | Renamed to squareStyles | Same functionality, simplified name |
| dropOffBoardAction | Removed | Functionality should now be handled externally |
| getPositionObject | Removed | Removed until desired use case arises |
| id | Unchanged | - |
| isDraggablePiece | Renamed to canDragPiece with new type | See API |
| onArrowsChange | New type | See API |
| onDragOverSquare | Removed | Removed until desired use case arises |
| onMouseOutSquare | New type | See API |
| onMouseOverSquare | New type | See API |
| onPieceClick | New type | See API |
| onPieceDragBegin | Renamed to onPieceDrag with new type | See API |
| onPieceDragEnd | Removed | Redundant, can use onPieceDrop instead |
| onPieceDrop | New type | See API |
| onPieceDropOffBoard | Removed | Redundant, can use onPieceDrop instead with null targetSquare |
| onPromotionCheck | Removed | Promotion handling should now be handled externally |
| onPromotionPieceSelect | Removed | Promotion handling should now be handled externally |
| onSparePieceDrop | Removed | Redundant, can use onPieceDrop instead with piece.isSparePiece = true |
| onSquareClick | New type | See API |
| onSquareRightClick | New type | See API |
| position | New type | See API |
| promotionDialogVariant | Removed | Promotion handling should now be handled externally |
| promotionToSquare | Removed | Promotion handling should now be handled externally |
| showBoardNotation | Renamed to showNotation | Same functionality, simplified name |
| showPromotionDialog | Removed | Promotion handling should now be handled externally |
| snapToCursor | Removed | Piece snapping is now default |

#### New Props
- `allowAutoScroll`: Controls whether dragging a piece near the edge of the window will automatically scroll the window
- `chessboardRows` and `chessboardColumns`: Control board dimensions
- `clearArrowsOnClick`: Control whether to clear arrows when clicking on the board
- `clearArrowsOnPositionChange`: Control whether to clear arrows when the position changes
- `dragActivationDistance`: Control the distance from the cursor to the piece to activate dragging
- `draggingPieceGhostStyle`: Style the ghost piece while being dragged
- `draggingPieceStyle`: Style the piece while being dragged

## Migration Steps

1. **Update Dependencies**

```bash
pnpm i react-chessboard@latest
# or
yarn add react-chessboard@latest
# or
npm i react-chessboard@latest
```

2. **Update React Version**

```bash
pnpm i react@^19.0.0 react-dom@^19.0.0
# or
yarn add react@^19.0.0 react-dom@^19.0.0
# or
npm i react@^19.0.0 react-dom@^19.0.0
```

3. **Review Your Implementation**
   - Update prop names to match new API
   - Remove/update any usage of removed features
   - Update event handlers to use new names and types
   - Review styling implementation to use new style props

## Need Help?
If you encounter any issues during the upgrade process, the best place to get help is the Discord server.

---