# 3D Chess Piece Models

GLTF models for the Three-dimensional Chess mode in Zugklang.

## Files

Each piece is stored as a `.gltf` + `.bin` pair:

```
3d-pieces/
├── pawn.gltf / pawn.bin
├── rook.gltf / rook.bin
├── knight.gltf / knight.bin
├── bishop.gltf / bishop.bin
├── queen.gltf / queen.bin
└── king.gltf / king.bin
```

## Model Requirements

- Format: `.gltf` with external `.bin`, or self-contained `.glb`
- Geometry centered at origin
- Upright along the Z-axis
- Low poly recommended for performance

## Color

Piece colors (white/black) are applied at runtime via the theme config — the model's original material color is overwritten automatically.

## Adding Custom Sets

1. Drop a new folder under `public/models/` with the 6 piece files
2. Update `modelFormat` in the feature's `config/theme.ts`
3. Update the path in `components/Pieces3D.tsx` to point to the new folder
