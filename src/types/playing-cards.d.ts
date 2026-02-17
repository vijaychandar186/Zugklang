declare module '@letele/playing-cards' {
  import { ComponentType, CSSProperties } from 'react';

  interface CardProps {
    style?: CSSProperties;
  }

  // Card components - format: SuitRank (e.g., Ha = Hearts Ace, S0 = Spades 10)
  // Suits: H (Hearts), D (Diamonds), C (Clubs), S (Spades)
  // Ranks: a, 2-9, 0 (10), j, q, k
  export const Ha: ComponentType<CardProps>;
  export const H2: ComponentType<CardProps>;
  export const H3: ComponentType<CardProps>;
  export const H4: ComponentType<CardProps>;
  export const H5: ComponentType<CardProps>;
  export const H6: ComponentType<CardProps>;
  export const H7: ComponentType<CardProps>;
  export const H8: ComponentType<CardProps>;
  export const H9: ComponentType<CardProps>;
  export const H0: ComponentType<CardProps>;
  export const Hj: ComponentType<CardProps>;
  export const Hq: ComponentType<CardProps>;
  export const Hk: ComponentType<CardProps>;

  export const Da: ComponentType<CardProps>;
  export const D2: ComponentType<CardProps>;
  export const D3: ComponentType<CardProps>;
  export const D4: ComponentType<CardProps>;
  export const D5: ComponentType<CardProps>;
  export const D6: ComponentType<CardProps>;
  export const D7: ComponentType<CardProps>;
  export const D8: ComponentType<CardProps>;
  export const D9: ComponentType<CardProps>;
  export const D0: ComponentType<CardProps>;
  export const Dj: ComponentType<CardProps>;
  export const Dq: ComponentType<CardProps>;
  export const Dk: ComponentType<CardProps>;

  export const Ca: ComponentType<CardProps>;
  export const C2: ComponentType<CardProps>;
  export const C3: ComponentType<CardProps>;
  export const C4: ComponentType<CardProps>;
  export const C5: ComponentType<CardProps>;
  export const C6: ComponentType<CardProps>;
  export const C7: ComponentType<CardProps>;
  export const C8: ComponentType<CardProps>;
  export const C9: ComponentType<CardProps>;
  export const C0: ComponentType<CardProps>;
  export const Cj: ComponentType<CardProps>;
  export const Cq: ComponentType<CardProps>;
  export const Ck: ComponentType<CardProps>;

  export const Sa: ComponentType<CardProps>;
  export const S2: ComponentType<CardProps>;
  export const S3: ComponentType<CardProps>;
  export const S4: ComponentType<CardProps>;
  export const S5: ComponentType<CardProps>;
  export const S6: ComponentType<CardProps>;
  export const S7: ComponentType<CardProps>;
  export const S8: ComponentType<CardProps>;
  export const S9: ComponentType<CardProps>;
  export const S0: ComponentType<CardProps>;
  export const Sj: ComponentType<CardProps>;
  export const Sq: ComponentType<CardProps>;
  export const Sk: ComponentType<CardProps>;

  // Card backs
  export const B1: ComponentType<CardProps>;
  export const B2: ComponentType<CardProps>;

  // Jokers
  export const J1: ComponentType<CardProps>;
  export const J2: ComponentType<CardProps>;
}
