import filterOutSuitedCards from '../utils/filterOutSuitedCards';
import filterOutOffSuitCards from '../utils/filterOutOffSuitCards';
import Hand from '../classes/Hand';
import sortCardsByRankAscending from '../utils/sortCardsByRankAscending';
import sortCardsByRankDescending from '../utils/sortCardsByRankDescending';
import type { StrategyParams, StrategyReturnType } from '../types/Strategy';
import Suit from '../types/Suit';

export default function forceFlushes(
  ...[gameState]: StrategyParams
): StrategyReturnType {
  const { chips, chipRequirement, heldHand, numRemainingDiscards } = gameState;

  const cardsGroupedBySuit = Hand.groupCardsBySuit(heldHand);

  let highestFrequency = 0;
  let highestFrequencySuit = Suit.Spades;

  for (const group of cardsGroupedBySuit) {
    if (group.length > highestFrequency) {
      highestFrequency = group.length;
      highestFrequencySuit = group[0].suit;
    }
  }

  const suitedCardsByRankDescending = sortCardsByRankDescending(
    filterOutOffSuitCards(heldHand, highestFrequencySuit),
  );

  if (highestFrequency >= 5) {
    const highestRankingSuitedCards = suitedCardsByRankDescending.slice(0, 5);
    const currentBestScore = Hand.scoreHand(highestRankingSuitedCards);

    if (currentBestScore >= chipRequirement - chips) {
      return ['playHand', highestRankingSuitedCards];
    }
  }

  const offSuitCardsByRankAscending = sortCardsByRankAscending(
    filterOutSuitedCards(heldHand, highestFrequencySuit),
  );

  const lowestRankingOffSuitCards = offSuitCardsByRankAscending.slice(0, 5);

  const cardsToDiscardOrPlay = [
    ...lowestRankingOffSuitCards,
    ...suitedCardsByRankDescending.slice(5),
  ].slice(0, 5);

  if (numRemainingDiscards > 0) {
    return ['discardHand', cardsToDiscardOrPlay];
  } else {
    return ['playHand', cardsToDiscardOrPlay];
  }
}
