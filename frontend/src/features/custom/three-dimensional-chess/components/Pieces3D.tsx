import { useGLTF } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import type { Piece } from '../store/gameStore';
import { THEME } from '../config/theme';
import { resolveBoardId } from '../utils/resolveBoardId';
import { getAssetUrl } from '../config/assets';

export function Pieces3D() {
  const pieces = useGameStore((state) => state.pieces);
  const world = useGameStore((state) => state.world);
  const attackBoardStates = useGameStore((state) => state.attackBoardStates);

  return (
    <group>
      {pieces.map((piece) => {
        const boardId = resolveBoardId(piece.level, attackBoardStates);
        const squareId = `${['z', 'a', 'b', 'c', 'd', 'e'][piece.file]}${piece.rank}${boardId}`;
        const square = world.squares.get(squareId);

        if (!square) {
          return null;
        }

        return (
          <Model3DPiece
            key={piece.id}
            piece={piece}
            position={[
              square.worldX,
              square.worldY,
              square.worldZ + THEME.pieces.zOffset
            ]}
          />
        );
      })}
    </group>
  );
}

function Model3DPiece({
  piece,
  position
}: {
  piece: Piece;
  position: [number, number, number];
}) {
  const color =
    piece.color === 'white' ? THEME.pieces.white : THEME.pieces.black;
  const modelPath = `/models/3d-pieces/${piece.type}.${THEME.pieces.modelFormat}`;
  const modelUrl = getAssetUrl(modelPath);

  const { scene } = useGLTF(modelUrl);

  const clonedScene = scene.clone();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clonedScene.traverse((child: any) => {
    if (child.isMesh) {
      child.material = child.material.clone();
      child.material.color.set(color);
      child.material.metalness = THEME.pieces.metalness;
      child.material.roughness = THEME.pieces.roughness;
    }
  });

  const hasDeferred = piece.type === 'pawn' && piece.promotionState?.isDeferred;

  return (
    <group>
      <primitive
        object={clonedScene}
        position={position}
        rotation={THEME.pieces.rotation}
        scale={THEME.pieces.scale}
        userData={{ testId: 'piece' }}
      />
      {hasDeferred && (
        <DeferredPromotionIndicator
          position={[position[0], position[1], position[2] + 2.0]}
        />
      )}
    </group>
  );
}

function DeferredPromotionIndicator({
  position
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.08, 16, 32]} />
        <meshStandardMaterial
          color='#FFD700'
          emissive='#FFD700'
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <pointLight color='#FFD700' intensity={0.3} distance={2} />
    </group>
  );
}

// Preload all models
const modelSet = THEME.pieces.modelSet;
const modelFormat = THEME.pieces.modelFormat;
const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
pieceTypes.forEach((type) => {
  const path = `/models/3d-pieces/${type}.${modelFormat}`;
  useGLTF.preload(getAssetUrl(path));
});
