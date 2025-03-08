import type ScoringInfo from './ScoringInfo';

enum PokerHand {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  FiveOfAKind,
  FlushHouse,
  FlushFive,
}

export default PokerHand;

export const pokerHandToScoringInfo: Record<PokerHand, ScoringInfo> = {
  [PokerHand.FlushFive]: { chips: 160, mult: 16 },
  [PokerHand.FlushHouse]: { chips: 140, mult: 14 },
  [PokerHand.FiveOfAKind]: { chips: 120, mult: 12 },
  [PokerHand.StraightFlush]: { chips: 100, mult: 8 },
  [PokerHand.FourOfAKind]: { chips: 60, mult: 7 },
  [PokerHand.FullHouse]: { chips: 40, mult: 4 },
  [PokerHand.Flush]: { chips: 35, mult: 4 },
  [PokerHand.Straight]: { chips: 30, mult: 4 },
  [PokerHand.ThreeOfAKind]: { chips: 30, mult: 3 },
  [PokerHand.TwoPair]: { chips: 20, mult: 2 },
  [PokerHand.Pair]: { chips: 10, mult: 2 },
  [PokerHand.HighCard]: { chips: 5, mult: 1 },
};
