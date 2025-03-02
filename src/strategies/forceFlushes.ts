import createFrequencyMap from '../utils/createFrequencyMap';
import filterOutSuitedCards from '../utils/filterOutSuitedCards';
import filterOutOffSuitCards from '../utils/filterOutOffSuitCards';
import PlayedHand from '../classes/PlayedHand';
import sortCardsByRankAscending from '../utils/sortCardsByRankAscending';
import sortCardsByRankDescending from '../utils/sortCardsByRankDescending';
import type { StrategyParams, StrategyReturnType } from '../types/Strategy';
import Suit from '../types/Suit';

export default function forceFlushes(
  ...[gameState]: StrategyParams
): StrategyReturnType {
  const { chips, chipRequirement, heldHand, numRemainingDiscards } = gameState;

  const suitToFrequency = createFrequencyMap(heldHand, ({ suit }) => suit);

  let highestFrequency = -Infinity;
  let highestFrequencySuit = Suit.Spades;

  for (const [suit, frequency] of suitToFrequency) {
    if (frequency > highestFrequency) {
      highestFrequency = frequency;
      highestFrequencySuit = suit;
    }
  }

  const suitedCardsByRankDescending = sortCardsByRankDescending(
    filterOutOffSuitCards(heldHand, highestFrequencySuit),
  );

  if (highestFrequency >= 5) {
    const highestRankingSuitedCards = suitedCardsByRankDescending.slice(0, 5);
    const currentBestScore = new PlayedHand(
      highestRankingSuitedCards,
    ).scoreHand();

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
